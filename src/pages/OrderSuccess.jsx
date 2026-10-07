import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get order details from navigation state
    const state = location.state;
    
    if (!state || !state.orderId) {
      // Redirect to home if no order data
      navigate("/customer");
      return;
    }

    setOrderDetails(state);
  }, [location.state, navigate]);

  if (!orderDetails) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif">Loading order details...</p>
      </div>
    );
  }

  const {
    orderId,
    orderData,
    paymentMethod,
    razorpayPaymentId,
    verified,
  } = orderDetails;

  const isCOD = paymentMethod === "COD";
  const isOnline = paymentMethod === "ONLINE";

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Success Icon and Message */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-emerald-500/10 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1
            className={`text-3xl font-bold font-serif mb-2 ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            {isCOD ? "Order Placed Successfully!" : "Payment Completed!"}
          </h1>

          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-gray-600"
            }`}
          >
            {isCOD
              ? "Thank you for your order. We'll deliver it to your doorstep."
              : verified
              ? "Your payment was successful. Your order is confirmed."
              : "Payment completed successfully!"}
          </p>
        </div>

        {/* Order Details Card */}
        <div
          className={`rounded-2xl border p-6 mb-6 ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-gray-100 text-gray-800"
          }`}
        >
          <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
            Order Details
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Order ID
              </span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {orderId}
              </span>
            </div>

            <div className="flex justify-between">
              <span
                className={`font-semibold ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Payment Method
              </span>
              <span className="font-semibold">
                {isCOD ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>

            {orderData?.totalAmount && (
              <div className="flex justify-between">
                <span
                  className={`font-semibold ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Total Amount
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  ₹{orderData.totalAmount.toLocaleString()}
                </span>
              </div>
            )}

            {isOnline && razorpayPaymentId && (
              <div className="flex justify-between">
                <span
                  className={`font-semibold ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Payment ID
                </span>
                <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  {razorpayPaymentId}
                </span>
              </div>
            )}

            {orderData?.orderStatus && (
              <div className="flex justify-between">
                <span
                  className={`font-semibold ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Order Status
                </span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase text-xs">
                  {orderData.orderStatus}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Address Card */}
        {orderData?.shippingAddress && (
          <div
            className={`rounded-2xl border p-6 mb-6 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
              Shipping Address
            </h2>

            <div className="space-y-1 text-sm">
              <p className="font-semibold">{orderData.shippingAddress.name}</p>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                {orderData.shippingAddress.address}
              </p>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.pincode}
              </p>
              <p className={isDark ? "text-slate-400" : "text-gray-600"}>
                Phone: {orderData.shippingAddress.phone}
              </p>
            </div>
          </div>
        )}

        {/* Verification Pending Notice */}
        {isOnline && !verified && (
          <div className="mb-6 p-4 rounded-xl text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <p className="font-semibold mb-1">Payment Verification Issue</p>
                <p className="text-xs opacity-90">
                  There was an issue verifying your payment. Please contact support with your payment ID.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COD Notice */}
        {isCOD && (
          <div className="mb-6 p-4 rounded-xl text-sm bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <span className="text-xl">💵</span>
              <div>
                <p className="font-semibold mb-1">Cash on Delivery Selected</p>
                <p className="text-xs opacity-90">
                  Please keep the exact amount ready when our delivery partner arrives.
                  You can pay in cash at the time of delivery.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/customer"
            className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center transition-all ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
          >
            Go to Dashboard
          </Link>

          <Link
            to="/sarees"
            className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-center transition-all ${
              isDark
                ? "bg-rose-700 hover:bg-rose-600 text-white"
                : "bg-rose-900 hover:bg-rose-950 text-white"
            }`}
          >
            Continue Shopping
          </Link>
        </div>

        {/* What's Next Section */}
        <div
          className={`mt-8 p-6 rounded-2xl border ${
            isDark
              ? "bg-slate-900 border-slate-800 text-slate-100"
              : "bg-white border-gray-100 text-gray-800"
          }`}
        >
          <h3 className="font-bold font-serif mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span className={isDark ? "text-slate-400" : "text-gray-600"}>
                You'll receive an order confirmation email shortly
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span className={isDark ? "text-slate-400" : "text-gray-600"}>
                Your order will be processed and packed with care
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span className={isDark ? "text-slate-400" : "text-gray-600"}>
                We'll notify you when your order is shipped
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span className={isDark ? "text-slate-400" : "text-gray-600"}>
                Track your delivery status in your orders section
              </span>
            </li>
          </ul>
        </div>

        {/* Developer Note - Remove in production */}
        {isOnline && !verified && razorpayPaymentId && (
          <div className="mt-6 p-4 rounded-xl text-xs bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            <p className="font-bold mb-2 text-yellow-400">⚠️ Payment Verification Failed</p>
            <p className="mb-2">
              Payment was completed but verification failed. Save this payment ID:
            </p>
            <p className="text-emerald-400 break-all">{razorpayPaymentId}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderSuccess;
