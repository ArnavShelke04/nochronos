import cron from "node-cron";
import dotenv from "dotenv";
import { Pool } from "../models/Pool.js";
import { ledgerQueue } from "../queues/ledgerQueue.js";

/**
 * Core midnight renewal logic — extracted so it can be:
 *   1. Triggered by the cron schedule (automatic, every midnight)
 *   2. Called manually via CLI:        node scripts/runMidnightTask.js
 *   3. Called via hidden API endpoint: POST /run-midnight-task
 *
 * @returns {{ processed: number, queued: number, errors: string[] }}
 */
export async function runDailyRenewal() {
  const startTime = Date.now();
  const errors = [];

  console.log(`[DailyRenewal] Starting renewal check at ${new Date().toISOString()}`);

  let pools;
  try {
    pools = await Pool.find({ status: "Active" });
  } catch (err) {
    const msg = `[DailyRenewal] FATAL — Failed to query active pools: ${err.message}`;
    console.error(msg, err);
    return { processed: 0, queued: 0, errors: [msg] };
  }

  if (!pools || pools.length === 0) {
    console.log("[DailyRenewal] No active pools found.");
    return { processed: 0, queued: 0, errors };
  }

  const today = new Date();
  const msInDay = 1000 * 60 * 60 * 24;
  let paymentDues = [];

  for (const pool of pools) {
    try {
      const diffDays = Math.floor((today - new Date(pool.createdAt)) / msInDay);

      // Every 30 days after pool is formed
      if (diffDays > 0 && diffDays % 30 === 0) {
        paymentDues.push(pool);
      }
    } catch (err) {
      const msg = `[DailyRenewal] Error processing pool ${pool._id}: ${err.message}`;
      console.error(msg, err);
      errors.push(msg);
    }
  }

  if (paymentDues.length === 0) {
    console.log("[DailyRenewal] No renewals due today.");
    return { processed: pools.length, queued: 0, errors };
  }

  let queued = 0;
  for (const pool of paymentDues) {
    try {
      await ledgerQueue.add("Payment Job", { _id: pool._id });
      queued++;
      console.log(`[DailyRenewal] Queued payment job for pool: ${pool.name} (${pool._id})`);
    } catch (err) {
      const msg = `[DailyRenewal] Failed to queue job for pool ${pool._id}: ${err.message}`;
      console.error(msg, err);
      errors.push(msg);
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[DailyRenewal] Done — ${queued}/${paymentDues.length} jobs queued in ${elapsed}ms`);

  return { processed: pools.length, queued, errors };
}

/**
 * Starts the cron schedule. Call this once at server boot.
 * The cron itself is wrapped in try/catch so a failure inside the task
 * never crashes the Node process.
 */
export function startDailyRenewalCron() {
  console.log("[DailyRenewal] Cron scheduled — will run at midnight (0 0 * * *)");

  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await runDailyRenewal();

      if (result.errors.length > 0) {
        console.error("[DailyRenewal] Completed with errors:", result.errors);
      }
    } catch (err) {
      // This outer catch is the last-resort safety net.
      // Even if runDailyRenewal throws an unexpected error, the server stays alive.
      console.error("[DailyRenewal] CRITICAL — Unhandled error in cron task:", err);
    }
  });
}

// ── Backward-compat: auto-start when this file is imported directly ──
// Only auto-start if this module is the entry point (not imported by another module)
const isDirectRun = process.argv[1]?.includes("dailyRenewal");
if (isDirectRun) {
  startDailyRenewalCron();
}
