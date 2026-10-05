#!/usr/bin/env node
/**
 * Manual Midnight Task Runner
 * ----------------------------
 * Manually triggers the daily renewal logic outside of the cron schedule.
 * 
 * Usage:
 *   node scripts/runMidnightTask.js
 * 
 * This is useful for:
 *   - Testing before deployment
 *   - Recovering from a missed cron run
 *   - Debugging renewal logic in staging
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { runDailyRenewal } from "../cron/dailyRenewal.js";

async function main() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   Manual Midnight Task — Nochronos       ║");
  console.log("╚══════════════════════════════════════════╝\n");

  try {
    // Connect to MongoDB (required for Pool queries)
    await connectDB();
    console.log("");

    // Run the renewal logic
    const result = await runDailyRenewal();

    console.log("\n── Results ────────────────────────────────");
    console.log(`  Pools scanned:  ${result.processed}`);
    console.log(`  Jobs queued:    ${result.queued}`);
    console.log(`  Errors:         ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log("\n── Errors ─────────────────────────────────");
      result.errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    }

    console.log("\n  ✅ Manual run complete.\n");
  } catch (err) {
    console.error("\n  💥 Fatal error during manual run:", err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

main();
