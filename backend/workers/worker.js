import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { Pool } from "../models/Pool.js";
import { Message } from "../models/Message.js";
import { Transaction } from "../models/Transaction.js";


const myWorker = new Worker('ledgerQueue', async job => {
  const job_id = job.data._id;
  const pool = await Pool.findById(job_id);
  
  if (!pool || !pool.members) {
    return null;
  }
  
  const poolName = pool.name;
  const members = pool.members;
  const monthlyCost = pool.subscription.monthly_cost;

  // Ledger wallet logic
  if (pool.walletBalance >= monthlyCost) {
    // 1. Deduct amount safely
    pool.walletBalance -= monthlyCost;
    
    // 2. Extend the renewal day by 30 days
    const nextRenewal = new Date(pool.renewalDay);
    nextRenewal.setDate(nextRenewal.getDate() + 30);
    pool.renewalDay = nextRenewal;
    
    await pool.save();

    // 3. Log a SUBSCRIPTION_PAYOUT transaction
    await Transaction.create({
      poolId: pool._id,
      amount: monthlyCost,
      type: "SUBSCRIPTION_PAYOUT",
    });

    console.log(`Successfully deducted $${monthlyCost} for pool ${pool.name}`);

  } else {
    // INSUFFICIENT FUNDS
    pool.status = "PAUSED_INSUFFICIENT_FUNDS";
    await pool.save();

    console.log(`Pool ${pool.name} paused due to insufficient funds.`);
    
    // Alert members via Message system
    const messagesToInsert = members.map(member => ({
      type: "system",
      recipientId: member._id ? member._id : member, 
      content: `Your pool ${poolName} is paused due to insufficient wallet balance. Please add funds.`,
      metadata: {
        action: "pool_paused",
        poolId: pool._id
      }
    }));

    await Message.insertMany(messagesToInsert);
  }
}, { connection: redis });
