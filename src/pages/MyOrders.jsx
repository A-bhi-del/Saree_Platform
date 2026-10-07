import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getMyOrders, cancelOrder } from "../api/orderApi";

function MyOrders() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (filterStatus) params.status = filterStatus;
      
      const response = await getMyOrders(params);
      setOrders(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrderId(orderId);
      await cancelOrder(orderId);
      // Refresh orders
      await fetchOrders();
      alert("Order cancelled successfully");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      PLACED: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      CONFIRMED: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
      PROCESSING: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      SHIPPED: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      DELIVERED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      CANCELLED: "bg-red-500/10 text-red-600 dark:text-red-400",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
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

  if (loading) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Page Header */}
      <div
        className={`mb-8 border-b pb-5 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <h1
          className={`text-2xl font-bold font-serif uppercase tracking-wide ${
            isDark ? "text-slate-100" : "text-gray-800"
          }`}
        >
          My Orders
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          Track and manage your orders
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["", "PENDING", "PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
          <button
            key={status || "all"}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              filterStatus === status
                ? isDark
                  ? "bg-rose-700 text-white"
                  : "bg-rose-900 text-white"
                : isDark
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status || "All"}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-red-500/10 text-red-500 border border-red-500/20">
          ⚠️ {error}
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center min-h-[50vh] font-serif ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          <div className="text-5xl mb-3">📦</div>
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-slate-200" : "text-gray-700"
            }`}
          >
            No Orders Found
          </h2>
          <p className="text-sm mt-1 mb-6">
            {filterStatus
              ? `No orders with status: ${filterStatus}`
              : "You haven't placed any orders yet"}
          </p>
          <Link
            to="/sarees"
            className="bg-rose-900 hover:bg-rose-950 text-white font-sans text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Browse Sarees
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`rounded-2xl border p-6 transition-all duration-300 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-gray-100 text-gray-800"
              }`}
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">
                    Order ID
                  </p>
                  <p className="font-mono text-sm font-bold">{order._id}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                  <span
                    className={`text-xs font-semibold ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    Payment: {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">
                  Items ({order.items?.length || 0})
                </p>
                {order.items?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                <span className="font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>
              </div>

              {/* Shipping Address */}
              <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">
                  Shipping Address
                </p>
                <p className="text-sm">
                  {order.shippingAddress?.name}, {order.shippingAddress?.phone}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/order/${order._id}`}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-center transition-all ${
                    isDark
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  View Details
                </Link>

                {!["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].includes(
                  order.orderStatus
                ) && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancellingOrderId === order._id}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      cancellingOrderId === order._id
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {cancellingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
