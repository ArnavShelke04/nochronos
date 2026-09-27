import { Queue } from "bullmq";
import redis from "../config/redis.js";

const ledgerQueue = new Queue("ledgerQueue", {
  connection: redis,
  removeOnComplete: 1000,
});

export { ledgerQueue };
