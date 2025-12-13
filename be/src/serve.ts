import app from "./app";
import { connectWithRetry } from "./config/databases";
import { env } from "./config/env.config";
import { connectRedis } from "@/utils/redis";

const port = env.PORT ? Number(env.PORT) : 5000;
app.onStart(() => {
  console.log(`🦊 Elysia running at http://localhost:${port}`);
});

async function connected() {
  try {
    await connectWithRetry();
    await connectRedis();
    app.listen(port);
  } catch (error) {
    console.error("❌ Could not connect to database after retries:", error);
    process.exit(1);
  }
}

connected();
