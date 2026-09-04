import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import CartItem from "../components/CartItem";

function AddToCart() {
  const {
    cart,
    loading,
    error,
    handleUpdateCart,
    handleRemoveFromCart,
    handleClearCart,
    validateCart,
  } = useCart();

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [validating, setValidating] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");

  const items = cart?.items || cart?.cartItems || [];

  const subtotal = items.reduce((acc, item) => {
    const saree = item.sareeId || item.saree || {};
    const price = saree.price || 0;
    const discount = saree.discountPercentage || 0;
    const effectivePrice =
      discount > 0 ? Math.round(price - (price * discount) / 100) : price;

    return acc + effectivePrice * (item.quantity || 1);
  }, 0);

  const shippingCost = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + shippingCost;

  const handleProceedToCheckout = async () => {
    try {
      setValidating(true);
      setValidationMsg("");

      const res = await validateCart();
      const isValid = res.data?.data?.valid ?? res.data?.success;

      if (isValid) {
        navigate("/checkout");
      } else {
        setValidationMsg(
          res.data?.message || "Some items in your cart are out of stock."
        );
      }
    } catch (err) {
      setValidationMsg(
        err.response?.data?.message ||
          "Stock validation failed. Please review cart items."
      );
    } finally {
      setValidating(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif">
          🛍️ Loading your shopping bag...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-red-400" : "bg-gray-50 text-red-600"
        }`}
      >
        <p className="font-serif">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[70vh] font-serif transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
        }`}
      >
        <div className="text-5xl mb-3">🛍️</div>
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-slate-200" : "text-gray-700"
          }`}
        >
          Your Shopping Cart is Empty
        </h2>
        <p
          className={`text-sm mt-1 mb-6 ${
            isDark ? "text-slate-500" : "text-gray-400"
          }`}
        >
          Explore our handwoven artisan sarees to add items to your cart.
        </p>
        <Link
          to="/sarees"
          className="bg-rose-900 hover:bg-rose-950 text-white font-sans text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl shadow-md transition-all"
        >
          Browse Sarees Catalog
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Page Title Header */}
      <div
        className={`mb-8 border-b pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <div>
          <h1
            className={`text-2xl font-bold font-serif uppercase tracking-wide ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            Shopping Bag ({items.length})
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Review selected saree variants before placing your order.
          </p>
        </div>

        <button
          onClick={handleClearCart}
          className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wider cursor-pointer"
        >
          Clear Shopping Bag
        </button>
      </div>

      {/* Validation Message Box */}
      {validationMsg && (
        <div className="mb-6 p-4 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20 text-center">
          ⚠️ {validationMsg}
        </div>
      )}

      {/* Layout Grid: Items & Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const saree = item.sareeId || item.saree;
            return (
              <CartItem
                key={item._id || saree?._id}
                item={item}
                onUpdateQuantity={handleUpdateCart}
                onRemove={handleRemoveFromCart}
              />
            );
          })}
        </div>

        {/* Right Column: Order Pricing Summary Card */}
        <div className="lg:col-span-1">
          <div
            className={`rounded-2xl border p-6 shadow-sm sticky top-24 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span
                  className={isDark ? "text-slate-400" : "text-gray-500"}
                >
                  Bag Subtotal
                </span>
                <span className="font-bold">₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span
                  className={isDark ? "text-slate-400" : "text-gray-500"}
                >
                  Estimated Shipping
                </span>
                <span className="font-bold">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-500">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>

              {shippingCost > 0 && (
                <p className="text-[10px] text-amber-500 italic">
                  * Add items worth ₹{(5000 - subtotal).toLocaleString()} more for Free Express Delivery!
                </p>
              )}

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between text-base">
                <span className="font-bold">Grand Total</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={validating}
              className={`w-full mt-6 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
              } ${validating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {validating ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Validating Stock...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToCart;