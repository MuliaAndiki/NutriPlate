// redis.ts
import { createClient, RedisClientType } from "redis";

export const redis: RedisClientType = createClient({
  url: "redis://localhost:6379",
});

redis.on("error", (err) => console.error("Redis Client Error", err));

await redis.connect();
console.log("Redis connected successfully");
