import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const REDIS_URL = process.env.REDIS_URL ||
  "rediss://default:gQAAAAAABF0oAAIgcDFmZTk3YzU4YTAxMGU0M2RmOTdmZTBiOTRmMzE4MGFkYg@saving-lionfish-285992.upstash.io:6379";

const redis = new Redis(REDIS_URL, {
  // Reconnection: retry with exponential backoff, cap at 10s
  retryStrategy(times) {
    const delay = Math.min(times * 200, 10000);
    console.warn(`[Redis] Reconnecting in ${delay}ms (attempt ${times})...`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  // Upstash (managed Redis) handles persistence server-side,
  // so no appendonly/save config is needed from the client.
  // For self-hosted Redis, ensure redis.conf has:
  //   save 900 1
  //   save 300 10
  //   save 60 10000
  //   appendonly yes
});

redis.on("connect", () => {
  console.log("Connected to Redis !!");
});

redis.on("error", (err) => {
  console.error("[Redis] Connection error:", err.message);
});

redis.on("close", () => {
  console.warn("[Redis] Connection closed — will attempt reconnect.");
});

export default redis;
