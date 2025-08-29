import { createClient } from "redis";
const notifi = async () => {
  const subscriber = createClient();
  await subscriber.connect();

  await subscriber.subscribe("order_created", (message) => {
    const order = JSON.parse(message);
    console.log("Notification gửi email cho:", order.customerEmail);
  });
};
notifi();
export { notifi };
