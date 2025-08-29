import { createClient } from "redis";
import { Request, Response } from "express";

const redis = createClient();
redis.connect();

const createUserRedis = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    console.log("👤 User created:", orderData);

    await redis.publish("user_created", JSON.stringify(orderData));

    return res.json({
      message: "User created and event published",
      data: orderData,
    });
  } catch (error) {
    console.error("Redis publish error:", error);
    res.status(500).json({ error: "Failed to publish event" });
  }
};

export { createUserRedis };
