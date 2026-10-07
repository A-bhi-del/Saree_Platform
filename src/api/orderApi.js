import API from "./axios";

/**
 * Create a new order
 * @param {Object} data - Order data containing shippingAddress and paymentMethod
 * @param {string} idempotencyKey - Unique key to prevent duplicate orders
 * @returns {Promise} API response with order details
 */
export const createOrder = async (data, idempotencyKey) => {
  const response = await API.post("/order/createOrder", data, {
    headers: {
      "Idempotency-Key": idempotencyKey,
    },
  });
  return response;
};

/**
 * Get customer's orders
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} API response with orders list
 */
export const getMyOrders = async (params = {}) => {
  const response = await API.get("/order/myOrders", { params });
  return response;
};

/**
 * Get admin's orders (orders containing their sarees)
 * @param {Object} params - Query parameters (page, limit, status)
 * @returns {Promise} API response with orders list
 */
export const getAdminOrders = async (params = {}) => {
  const response = await API.get("/order/adminOrders", { params });
  return response;
};

/**
 * Get order details by ID
 * @param {string} orderId - MongoDB order ID
 * @returns {Promise} API response with order details
 */
export const getOrderById = async (orderId) => {
  const response = await API.get(`/order/${orderId}`);
  return response;
};

/**
 * Update order status (admin only)
 * @param {string} orderId - MongoDB order ID
 * @param {string} status - New order status
 * @returns {Promise} API response
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await API.patch(`/order/${orderId}/status`, { status });
  return response;
};

/**
 * Cancel order (customer only)
 * @param {string} orderId - MongoDB order ID
 * @returns {Promise} API response
 */
export const cancelOrder = async (orderId) => {
  const response = await API.post(`/order/${orderId}/cancel`);
  return response;
};

/**
 * Get all orders for the current user (deprecated - use getMyOrders)
 * @returns {Promise} API response with user's orders
 */
export const getUserOrders = async () => {
  const response = await API.get("/order/myOrders");
  return response;
};
