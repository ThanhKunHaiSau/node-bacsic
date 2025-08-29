// src/subscribers/user.subscriber.ts
import { createClient } from "redis";

const subscriber = createClient();

export async function startUserSubscriber() {
  await subscriber.connect();
  await subscriber.subscribe("user_created", (message) => {
    const user = JSON.parse(message);
    console.log("📩 [SUBSCRIBER] Nhận event user_created:", user);
  });

  console.log("✅ [SUBSCRIBER] Đang listen user_created");
}
