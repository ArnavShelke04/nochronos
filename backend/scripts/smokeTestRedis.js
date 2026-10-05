#!/usr/bin/env node
/**
 * Redis Smoke Test
 * ----------------
 * Standalone script to verify that the Redis connection is healthy.
 * 
 * Usage:
 *   node scripts/smokeTestRedis.js
 * 
 * What it does:
 *   1. Connects to Redis using the app's shared config
 *   2. Writes a temporary test key
 *   3. Reads it back and verifies the value
 *   4. Deletes the key
 *   5. Confirms deletion
 * 
 * Exit codes:
 *   0 = all checks passed
 *   1 = one or more checks failed
 */

import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL ||
  "rediss://default:gQAAAAAABF0oAAIgcDFmZTk3YzU4YTAxMGU0M2RmOTdmZTBiOTRmMzE4MGFkYg@saving-lionfish-285992.upstash.io:6379";

const TEST_KEY = `nochronos:smoke_test:${Date.now()}`;
const TEST_VALUE = "smoke_test_ok";

const log = (icon, msg) => console.log(`  ${icon}  ${msg}`);

async function runSmokeTest() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║      Redis Smoke Test — Nochronos    ║");
  console.log("╚══════════════════════════════════════╝\n");

  let redis;
  let passed = 0;
  let failed = 0;

  try {
    // ── Step 1: Connect ──────────────────────────────────────────
    log("🔌", "Connecting to Redis...");
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      lazyConnect: true,
    });

    await redis.connect();
    log("✅", `Connected — server info: ${await redis.ping()}`);
    passed++;

    // ── Step 2: Write ────────────────────────────────────────────
    log("📝", `Writing test key: ${TEST_KEY}`);
    const setResult = await redis.set(TEST_KEY, TEST_VALUE, "EX", 30); // auto-expire in 30s as safety net
    if (setResult === "OK") {
      log("✅", "Write succeeded");
      passed++;
    } else {
      log("❌", `Write returned unexpected result: ${setResult}`);
      failed++;
    }

    // ── Step 3: Read ─────────────────────────────────────────────
    log("📖", "Reading test key back...");
    const readValue = await redis.get(TEST_KEY);
    if (readValue === TEST_VALUE) {
      log("✅", `Read succeeded — value matches: "${readValue}"`);
      passed++;
    } else {
      log("❌", `Read mismatch — expected "${TEST_VALUE}", got "${readValue}"`);
      failed++;
    }

    // ── Step 4: Delete ───────────────────────────────────────────
    log("🗑️ ", "Deleting test key...");
    const delResult = await redis.del(TEST_KEY);
    if (delResult === 1) {
      log("✅", "Delete succeeded");
      passed++;
    } else {
      log("❌", `Delete returned unexpected result: ${delResult}`);
      failed++;
    }

    // ── Step 5: Confirm deletion ─────────────────────────────────
    log("🔍", "Confirming key is gone...");
    const confirmValue = await redis.get(TEST_KEY);
    if (confirmValue === null) {
      log("✅", "Key confirmed deleted");
      passed++;
    } else {
      log("❌", `Key still exists with value: "${confirmValue}"`);
      failed++;
    }

  } catch (err) {
    log("💥", `Fatal error: ${err.message}`);
    console.error(err);
    failed++;
  } finally {
    if (redis) {
      await redis.quit().catch(() => {});
    }
  }

  // ── Summary ──────────────────────────────────────────────────
  console.log("\n──────────────────────────────────────");
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log("──────────────────────────────────────\n");

  if (failed > 0) {
    console.log("  ⚠️  SMOKE TEST FAILED — check Redis configuration\n");
    process.exit(1);
  } else {
    console.log("  🎉 ALL CHECKS PASSED — Redis is healthy\n");
    process.exit(0);
  }
}

runSmokeTest();
