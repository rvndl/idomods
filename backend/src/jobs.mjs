import cron from "node-cron";
import { fetchOrders } from "./orders.mjs";

function runJobs() {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running job for fetching orders");
    await fetchOrders();
  });
}

export { runJobs };
