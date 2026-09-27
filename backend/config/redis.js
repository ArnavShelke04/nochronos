import Redis from "ioredis";

// Pass the clean connection string directly into new Redis()
const redis = new Redis(
  "rediss://default:gQAAAAAABF0oAAIgcDFmZTk3YzU4YTAxMGU0M2RmOTdmZTBiOTRmMzE4MGFkYg@saving-lionfish-285992.upstash.io:6379",
);

redis.on("connect", () => {
  console.log("Connected to Redis !!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
