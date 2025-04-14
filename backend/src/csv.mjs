/**
 * @param {import("./orders.mjs").Order} order
 */
function convertOrderToCSV(order) {
  const { orderID, orderWorth, products } = order;
  const rows = [];

  if (products.length > 0) {
    for (const product of products) {
      rows.push([orderID, product.productId, product.quantity, orderWorth]);
    }
  } else {
    rows.push([orderID, "", "", orderWorth]);
  }

  return rows;
}

/**
 * @param {import("./orders.mjs").Order[]} orders
 */
function convertOrdersToCSV(orders) {
  const csvRows = [["orderID", "productId", "quantity", "orderWorth"]];

  for (const order of orders) {
    const orderRows = convertOrderToCSV(order);
    csvRows.push(...orderRows);
  }

  return csvRows.map((row) => row.join(",")).join("\n");
}

export { convertOrdersToCSV };
