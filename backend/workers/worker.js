import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { Pool } from "../models/Pool.js";
import { Message } from "../models/Message.js";


const myWorker = new Worker('ledgerQueue', async job => {
  const job_id = job.data._id;
  const pool = await Pool.findById(job_id)
  if(!pool || !pool.members){
    return null;
  }
  const poolName = pool.name;
  const members = pool.members;
  // Code for splitting the charges.
  const totalCharge = pool.subscription.monthly_cost;
  
  // Calculate charge per head rounded to 2 decimal places to avoid floating point issues
  const chargePerHead = Number((totalCharge / pool.maxMembers).toFixed(2));

  const totalMembersExcludeHost = members.length - 1;
  // Calculate charge for host maintaining exact precision of 2 decimal places
  const chargeHost = Number((totalCharge - (totalMembersExcludeHost * chargePerHead)).toFixed(2));

  const messagesToInsert = [];

  for (const member of members) {
    // author is stored in pool.author, not hostId
    const isHost = member._id.toString() === pool.author.toString(); 
    const amountOwed = isHost ? chargeHost : chargePerHead;
    // Venmo code 

    messagesToInsert.push({
      type: "system",
      recipientId: member._id,
      content: `Your Payment for the Pool ${poolName} is pending`,
      metadata : {
        action : "payment_required",
        targetUserId : member._id,
        poolId : pool._id,
        amount : amountOwed
      }
    });
  }

  await Message.insertMany(messagesToInsert);

  

}, { connection: redis });
