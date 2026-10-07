import API from "./axios";

/**
 * Create Razorpay order for online payment
 * @param {string} orderId - MongoDB order ID
 * @returns {Promise} API response with Razorpay order details
 */
export const createPaymentOrder = async (orderId) => {
  const response = await API.post("/payment/createPaymentOrder", {
    orderId,
  });
  return response;
};

/**
 * Verify Razorpay payment signature
 * @param {Object} paymentData - Contains orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature
 * @returns {Promise} API response
 */
export const verifyPayment = async (paymentData) => {
  const response = await API.post("/payment/verifyPayment", paymentData);
  return response;
};
