import cron from "node-cron";
import dotenv from "dotenv";
import { Pool } from "../models/Pool.js";
import { ledgerQueue } from "../queues/ledgerQueue.js";

const renew = () => {
  try {
    // Run every night at midnight
    cron.schedule("0 0 * * *", async () => {
      console.log("Running daily renewal check...");
      const today = new Date();
      const pools = await Pool.find({ status: "Active" });

      if (pools.length === 0) {
        console.log("No active pools found.");
        return;
      }

      let paymentDues = [];
      const msInDay = 1000 * 60 * 60 * 24;

      for (const pool of pools) {
        // Calculate days since creation
        const diffDays = Math.floor((today - new Date(pool.createdAt)) / msInDay);
        
        // Every 30 days after pool is formed
        if (diffDays > 0 && diffDays % 30 === 0) {
          paymentDues.push(pool);
        }
      }

      if (paymentDues.length === 0) {
        console.log("No renewals due today.");
        return;
      }

      for (const pool of paymentDues) {
        await ledgerQueue.add("Payment Job", {
          _id: pool._id,
        });
      }
      console.log(`Added ${paymentDues.length} jobs to the queue.`);
    });
  } catch (error) {
    console.error("Cron Error:", error);
  }
};

renew();
