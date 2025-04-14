import "dotenv/config";
import express from "express";
import { getOrderById, getOrders, initializeOrders } from "./orders.mjs";
import { auth } from "./middleware/index.mjs";
import { HttpStatusCode } from "axios";
import { runJobs } from "./jobs.mjs";
import { convertOrdersToCSV } from "./csv.mjs";

const app = express();

await initializeOrders();
runJobs();

app.get("/orders", auth, async (req, res) => {
  try {
    const minWorth = parseFloat(req.query.minWorth, 10);
    const maxWorth = parseFloat(req.query.maxWorth, 10);

    const orders = await getOrders(minWorth, maxWorth);
    res.status(HttpStatusCode.Ok).send(convertOrdersToCSV(orders));
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

app.get("/orders/:id", auth, async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    return res
      .status(HttpStatusCode.BadRequest)
      .json({ message: "Order ID is required" });
  }

  try {
    const order = await getOrderById(orderId);
    res.status(HttpStatusCode.Ok).json(convertOrdersToCSV([order]));
  } catch (error) {
    res.status(HttpStatusCode.InternalServerError).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, "127.0.0.1");
