import { searchOrders } from "./idosell-client/index.mjs";
import * as fs from "fs/promises";

const ORDERS_FILE_PATH = "orders.json";

/**
 * @typedef {Object} Order
 * @property {string} orderID - ID
 * @property {Array<{ productId: string, quantity: number }>} products - Products
 * @property {number} orderWorth - Total worth
 */

/**
 * @param {Order} order
 */
function transformOrder(order) {
  const orderWorth = order.orderDetails.productsResults.reduce(
    (acc, product) =>
      acc + product.productOrderPriceBaseCurrency * product.productQuantity,
    0
  );

  return {
    orderID: order.orderId,
    products: order.orderDetails.productsResults.map((product) => ({
      productId: product.productId,
      quantity: product.productQuantity,
    })),
    orderWorth,
  };
}

async function fetchOrders() {
  console.log("Fetching orders..");

  const orders = await searchOrders("finished");
  if (orders.status !== 200) {
    throw new Error("Error while fetching first order:", orders.statusText);
  }

  const totalPages = orders.data.resultsNumberPage;
  console.log(`Fetched 1/${totalPages} pages`);

  /**
   * @type {Array<Order>}
   */
  let allOrders = orders.data.Results.map(transformOrder);
  let page = 1;

  while (page < totalPages) {
    const ordersPage = await searchOrders("finished", page);
    if (ordersPage.status !== 200) {
      console.error("Error fetching orders:", ordersPage.statusText);
      return;
    }
    allOrders = allOrders.concat(ordersPage.data.Results.map(transformOrder));
    page++;
    console.log(`Fetched ${page}/${totalPages} pages`);
  }

  try {
    await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(allOrders));
    console.log(`Orders saved to ${ORDERS_FILE_PATH}`);
  } catch (error) {
    throw new Error("Error while saving orders:", error);
  }
}

/**
 * @param {number} minWorth
 * @param {number} maxWorth
 * @returns {Order[]}
 */
async function getOrders(minWorth, maxWorth) {
  if (minWorth && minWorth < 0) {
    throw new Error("Minimum worth cannot be negative");
  }

  if (maxWorth && maxWorth < 0) {
    throw new Error("Maximum worth cannot be negative");
  }

  if (minWorth && maxWorth && minWorth > maxWorth) {
    throw new Error("Minimum worth cannot be greater than maximum worth");
  }

  try {
    const data = await fs.readFile(ORDERS_FILE_PATH, "utf-8");
    let orders = JSON.parse(data);
    if (minWorth) {
      orders = orders.filter((order) => order.orderWorth >= minWorth);
    }

    if (maxWorth) {
      orders = orders.filter((order) => order.orderWorth <= maxWorth);
    }
    return orders;
  } catch (error) {
    throw new Error("Error while reading orders:", error);
  }
}

/**
 * @param {string} orderId
 * @returns {Promise<Order>}
 */
async function getOrderById(orderId) {
  try {
    const orders = await getOrders();
    const order = orders.find((order) => order.orderID === orderId);
    if (!order) {
      console.error(`Order with ID ${orderId} was not found`);
      return false;
    }

    return order;
  } catch (error) {
    throw new Error("Error while fetching order by ID:", error);
  }
}

async function initializeOrders() {
  try {
    await fs.access(ORDERS_FILE_PATH);
  } catch (error) {
    console.log("Orders file does not exist. Fetching orders...");
    await fetchOrders();
  }
}

export { fetchOrders, initializeOrders, getOrders, getOrderById };
