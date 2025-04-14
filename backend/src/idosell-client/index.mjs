import api from "./api.mjs";

/**
 * @typedef {"new"| "finished" | "false" | "lost" | "on_order" | "packed" | "ready" | "canceled" | "payment_waiting" | "delivery_waiting" | "suspended" | "joined" | "finished_ext"} OrderStatus
 */

/**
 * @typedef {Object} Product
 * @property {number} productId - Product ID
 * @property {string} productOrderPriceBaseCurrency - Price
 * @property {number} productQuantity - Qunatity
 */

/**
 * @typedef {Object} OrderDetails
 * @property {Product[]} productsResults - Products
 */

/**
 * @typedef {Object} Order
 * @property {string} orderId - Order ID
 * @property {OrderDetails} orderDetails - Order details
 *
 */

/**
 * @typedef {Object} ResultsWrapper
 * @property {Order[]} Results
 * @property {number} resultsNumberPage - The number of pages
 * @property {number} resultsPage - Current page number
 */

/**
 * Function to search orders by status
 * @param {OrderStatus} orderStatus - Order status
 * @param {number} [page=0] - The page number for pagination (defaults to 0)
 * @return {import("axios").AxiosResponse<ResultsWrapper>}
 */
function searchOrders(orderStatus, page = 0) {
  return api.post("/orders/orders/search", {
    params: {
      orderStatuses: [orderStatus],
      productName: "*",
    },
    resultsPage: page,
  });
}

export { searchOrders };
