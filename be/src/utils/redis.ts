import { createClient, RedisClientType } from "redis";
import { env } from "@/config/env.config";

let redis: RedisClientType | null = null;

export function getRedis(): RedisClientType {
  if (!redis) {
    redis = createClient({
      url: env.REDIS_URL,
    });

    redis.on("error", (err) => console.error("❌ Redis Client Error", err));

    redis.on("connect", () => {
      console.log("🔴 Redis connected successfully");
    });
  }

  return redis;
}

export async function connectRedis() {
  const client = getRedis();
  if (!client.isOpen) {
    await client.connect();
  }
}
