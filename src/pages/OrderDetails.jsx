import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getOrderById, cancelOrder, updateOrderStatus } from "../api/orderApi";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOrderById(id);
      setOrder(response.data?.data || response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setActionLoading(true);
      await cancelOrder(id);
      alert("Order cancelled successfully");
      await fetchOrderDetails();
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Update order status to ${newStatus}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      await updateOrderStatus(id, newStatus);
      alert("Order status updated successfully");
      await fetchOrderDetails();
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      PLACED: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      CONFIRMED: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      PROCESSING: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      SHIPPED: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      DELIVERED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      CANCELLED: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600 border-gray-500/20";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      PENDING: "text-yellow-600 dark:text-yellow-400",
      PAID: "text-emerald-600 dark:text-emerald-400",
      FAILED: "text-red-600 dark:text-red-400",
      REFUNDED: "text-purple-600 dark:text-purple-400",
    };
    return colors[status] || "text-gray-600";
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      PENDING: "PLACED",
      PLACED: "CONFIRMED",
      CONFIRMED: "PROCESSING",
      PROCESSING: "SHIPPED",
      SHIPPED: "DELIVERED",
    };
    return statusFlow[currentStatus];
  };

  if (loading) {
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

  if (error || !order) {
    return (
      <div
        className={`min-h-[70vh] flex flex-col items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <div className="text-5xl mb-4">❌</div>
        <p className="text-xl font-semibold mb-4">{error || "Order not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-rose-900 hover:bg-rose-950 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-lg ${
            isDark ? "hover:bg-slate-800" : "hover:bg-gray-200"
          }`}
        >
          ← Back
        </button>
        <div>
          <h1
            className={`text-2xl font-bold font-serif uppercase tracking-wide ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            Order Details
          </h1>
          <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Order ID: {order._id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div
            className={`rounded-2xl border p-6 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4">
              Order Status
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase border ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Order Date
                </p>
                <p className="text-sm font-semibold">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div
            className={`rounded-2xl border p-6 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      ₹{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-rose-600 dark:text-rose-400">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div
            className={`rounded-2xl border p-6 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4">
              Shipping Address
            </h2>
            <div className="space-y-1">
              <p className="font-semibold">{order.shippingAddress?.name}</p>
              <p className="text-sm">{order.shippingAddress?.phone}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {order.shippingAddress?.address}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* Customer Details (Admin Only) */}
          {isAdmin && order.userId && (
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-gray-100 text-gray-800"
              }`}
            >
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4">
                Customer Details
              </h2>
              <div className="space-y-1">
                <p className="font-semibold">{order.userId.name}</p>
                <p className="text-sm">{order.userId.email}</p>
                <p className="text-sm">{order.userId.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div
            className={`rounded-2xl border p-6 sticky top-24 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className={isDark ? "text-slate-400" : "text-gray-500"}>
                  Subtotal
                </span>
                <span className="font-semibold">
                  ₹{order.subtotal?.toLocaleString()}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-₹{order.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-slate-800 text-base">
                <span className="font-bold">Total</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-slate-800">
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-slate-400" : "text-gray-500"}>
                  Payment Method
                </span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDark ? "text-slate-400" : "text-gray-500"}>
                  Payment Status
                </span>
                <span
                  className={`font-semibold ${getPaymentStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isCustomer &&
                !["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
                  order.orderStatus
                ) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={actionLoading}
                    className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      actionLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {actionLoading ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}

              {isAdmin &&
                getNextStatus(order.orderStatus) &&
                order.orderStatus !== "CANCELLED" && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(getNextStatus(order.orderStatus))
                    }
                    disabled={actionLoading}
                    className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      actionLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : isDark
                        ? "bg-rose-700 hover:bg-rose-600 text-white"
                        : "bg-rose-900 hover:bg-rose-950 text-white"
                    }`}
                  >
                    {actionLoading
                      ? "Updating..."
                      : `Mark as ${getNextStatus(order.orderStatus)}`}
                  </button>
                )}

              <Link
                to={isAdmin ? "/admin/orders" : "/orders"}
                className={`block w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all ${
                  isDark
                    ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
