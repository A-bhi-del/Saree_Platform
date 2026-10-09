import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { createOrder } from "../api/orderApi";
import { createPaymentOrder, verifyPayment } from "../api/paymentApi";
import { applyCoupon, removeCoupon } from "../api/couponApi";
import { loadRazorpayScript, openRazorpayCheckout } from "../utils/razorpay";

function Checkout() {
  const { cart, loading: cartLoading, fetchCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formErrors, setFormErrors] = useState({});
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Cart data
  const items = cart?.items || cart?.cartItems || [];

  // Calculate cart totals
  const subtotal = items.reduce((acc, item) => {
    const saree = item.sareeId || item.saree || {};
    const price = saree.price || 0;
    const discount = saree.discountPercentage || 0;
    const effectivePrice =
      discount > 0 ? Math.round(price - (price * discount) / 100) : price;
    return acc + effectivePrice * (item.quantity || 1);
  }, 0);

  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const shippingCost = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal - couponDiscount + shippingCost;

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate("/cart");
    }
  }, [cartLoading, items.length, navigate]);

  // Load Razorpay SDK on component mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      const response = await applyCoupon(couponCode.trim());
      const data = response.data?.data || response.data;

      setAppliedCoupon(data);
      setCouponError("");
      setOrderError("");
    } catch (error) {
      console.error("Apply coupon error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to apply coupon";
      setCouponError(errorMessage);
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Handle coupon removal
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");
    } catch (error) {
      console.error("Remove coupon error:", error);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!shippingAddress.name.trim()) {
      errors.name = "Name is required";
    }

    if (!shippingAddress.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!shippingAddress.address.trim()) {
      errors.address = "Address is required";
    }

    if (!shippingAddress.city.trim()) {
      errors.city = "City is required";
    }

    if (!shippingAddress.state.trim()) {
      errors.state = "State is required";
    }

    if (!shippingAddress.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      errors.pincode = "Pincode must be 6 digits";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle COD order placement
  const handleCODOrder = async () => {
    try {
      setIsProcessingOrder(true);
      setOrderError("");

      const orderData = {
        shippingAddress,
        paymentMethod: "COD",
        couponCode: appliedCoupon ? appliedCoupon.coupon.code : undefined,
      };

      const response = await createOrder(orderData, idempotencyKey);
      const createdOrder = response.data?.data || response.data;

      // Navigate to success page
      navigate("/order-success", {
        state: {
          orderId: createdOrder._id,
          orderData: createdOrder,
          paymentMethod: "COD",
        },
      });

      // Clear cart after successful order
      await fetchCart();
    } catch (error) {
      console.error("COD Order Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order. Please try again.";
      setOrderError(errorMessage);
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Handle Online payment order placement
  const handleOnlinePayment = async () => {
    try {
      setIsProcessingOrder(true);
      setOrderError("");

      // Step 1: Create order with ONLINE payment method
      const orderData = {
        shippingAddress,
        paymentMethod: "ONLINE",
        couponCode: appliedCoupon ? appliedCoupon.coupon.code : undefined,
      };

      const orderResponse = await createOrder(orderData, idempotencyKey);
      const createdOrder = orderResponse.data?.data || orderResponse.data;
      const orderId = createdOrder._id;

      // Step 2: Create Razorpay order
      const paymentResponse = await createPaymentOrder(orderId);
      const paymentData = paymentResponse.data?.data || paymentResponse.data;

      const { razorpayOrderId, amount, currency, keyId } = paymentData;

      // Step 3: Verify Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay SDK. Please refresh the page.");
      }

      // Step 4: Open Razorpay checkout
      const razorpayOptions = {
        key: keyId,
        amount: amount * 100, // Amount in paise
        currency: currency || "INR",
        name: "Saree Platform",
        description: "Saree Purchase",
        order_id: razorpayOrderId,
        prefill: {
          name: shippingAddress.name,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#881337", // Rose-900
        },
      };

      openRazorpayCheckout(
        razorpayOptions,
        // On Success
        async (response) => {
          console.log("Razorpay Payment Success:", response);
          
          try {
            // Verify payment with backend
            await verifyPayment({
              orderId: orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });

            // Navigate to success page after verification
            navigate("/order-success", {
              state: {
                orderId: orderId,
                orderData: createdOrder,
                paymentMethod: "ONLINE",
                razorpayPaymentId: response.razorpay_payment_id,
                verified: true,
              },
            });

            // Refresh cart (it will be empty after verification)
            await fetchCart();
          } catch (verificationError) {
            console.error("Payment verification failed:", verificationError);
            setOrderError(
              verificationError.response?.data?.message ||
              "Payment verification failed. Please contact support with your payment ID: " +
              response.razorpay_payment_id
            );
          }
          
          setIsProcessingOrder(false);
        },
        // On Failure
        (error) => {
          console.error("Razorpay Payment Failed:", error);
          setOrderError(
            error.description ||
            error.reason ||
            "Payment failed. Please try again or use COD."
          );
          setIsProcessingOrder(false);
        },
        // On Dismiss
        () => {
          console.log("Razorpay checkout dismissed by user");
          setOrderError("Payment cancelled. You can retry or choose COD.");
          setIsProcessingOrder(false);
        }
      );
    } catch (error) {
      console.error("Online Payment Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment. Please try again.";
      setOrderError(errorMessage);
      setIsProcessingOrder(false);
    }
  };

  // Handle form submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Process based on payment method
    if (paymentMethod === "COD") {
      await handleCODOrder();
    } else if (paymentMethod === "ONLINE") {
      await handleOnlinePayment();
    }
  };

  if (cartLoading) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif">Loading checkout...</p>
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
          Checkout
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          Complete your order details and select payment method
        </p>
      </div>

      {/* Error Message */}
      {orderError && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-red-500/10 text-red-500 border border-red-500/20">
          ⚠️ {orderError}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Section */}
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-gray-100 text-gray-800"
              }`}
            >
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
                Shipping Address
              </h2>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    disabled={isProcessingOrder}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                        : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50`}
                    placeholder="Enter your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    disabled={isProcessingOrder}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                        : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Address Field */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    disabled={isProcessingOrder}
                    rows="3"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                        : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50 resize-none`}
                    placeholder="House no., Building name, Street"
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDark ? "text-slate-300" : "text-gray-700"
                      }`}
                    >
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      disabled={isProcessingOrder}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                        isDark
                          ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                          : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                      } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50`}
                      placeholder="City"
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${
                        isDark ? "text-slate-300" : "text-gray-700"
                      }`}
                    >
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      disabled={isProcessingOrder}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                        isDark
                          ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                          : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                      } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50`}
                      placeholder="State"
                    />
                    {formErrors.state && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                    )}
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    disabled={isProcessingOrder}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                        : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50`}
                    placeholder="6-digit pincode"
                    maxLength="6"
                  />
                  {formErrors.pincode && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon Section */}
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-gray-100 text-gray-800"
              }`}
            >
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
                Apply Coupon
              </h2>

              {appliedCoupon ? (
                <div className="space-y-3">
                  {/* Applied Coupon Display */}
                  <div className="p-4 rounded-lg border-2 border-emerald-500 bg-emerald-500/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">✅</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {appliedCoupon.coupon.code}
                          </span>
                        </div>
                        {appliedCoupon.coupon.description && (
                          <p className={`text-sm mt-1 ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                            {appliedCoupon.coupon.description}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                          You saved ₹{appliedCoupon.discountAmount.toLocaleString()}!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        disabled={isProcessingOrder}
                        className="text-red-500 hover:text-red-600 font-semibold text-sm disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Coupon Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      disabled={isApplyingCoupon || isProcessingOrder}
                      placeholder="Enter coupon code"
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm uppercase ${
                        isDark
                          ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-500"
                          : "bg-white border-gray-200 text-gray-800 focus:border-rose-500"
                      } focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isApplyingCoupon || isProcessingOrder}
                      className={`px-6 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap ${
                        isDark
                          ? "bg-rose-700 hover:bg-rose-600 text-white"
                          : "bg-rose-900 hover:bg-rose-950 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>

                  {/* Coupon Error */}
                  {couponError && (
                    <div className="p-3 rounded-lg text-sm bg-red-500/10 text-red-500 border border-red-500/20">
                      {couponError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div
              className={`rounded-2xl border p-6 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-slate-100"
                  : "bg-white border-gray-100 text-gray-800"
              }`}
            >
              <h2 className="text-lg font-bold font-serif uppercase tracking-wider mb-4 pb-3 border-b border-gray-200 dark:border-slate-800">
                Payment Method
              </h2>

              <div className="space-y-3">
                {/* COD Option */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-rose-500 bg-rose-500/5"
                      : isDark
                      ? "border-slate-700 hover:border-slate-600"
                      : "border-gray-200 hover:border-gray-300"
                  } ${isProcessingOrder ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessingOrder}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Cash on Delivery</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      Pay when you receive your order
                    </div>
                  </div>
                  <span className="text-2xl">💵</span>
                </label>

                {/* Online Payment Option */}
                <label
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === "ONLINE"
                      ? "border-rose-500 bg-rose-500/5"
                      : isDark
                      ? "border-slate-700 hover:border-slate-600"
                      : "border-gray-200 hover:border-gray-300"
                  } ${isProcessingOrder ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={paymentMethod === "ONLINE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={isProcessingOrder}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Online Payment</div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isDark ? "text-slate-400" : "text-gray-500"
                      }`}
                    >
                      Pay securely via Razorpay (UPI, Card, Net Banking)
                    </div>
                  </div>
                  <span className="text-2xl">💳</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
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

              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const saree = item.sareeId || item.saree || {};
                  const price = saree.price || 0;
                  const discount = saree.discountPercentage || 0;
                  const effectivePrice =
                    discount > 0 ? Math.round(price - (price * discount) / 100) : price;

                  return (
                    <div
                      key={item._id || saree._id}
                      className="flex justify-between text-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium line-clamp-1">
                          {saree.name || "Saree"}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-slate-400" : "text-gray-500"
                          }`}
                        >
                          Qty: {item.quantity} × ₹{effectivePrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ₹{(effectivePrice * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm border-t border-gray-200 dark:border-slate-800 pt-4">
                <div className="flex justify-between">
                  <span className={isDark ? "text-slate-400" : "text-gray-500"}>
                    Subtotal
                  </span>
                  <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && appliedCoupon.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1">
                      <span>🎟️</span>
                      Coupon Discount
                    </span>
                    <span className="font-bold">
                      -₹{appliedCoupon.discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className={isDark ? "text-slate-400" : "text-gray-500"}>
                    Shipping
                  </span>
                  <span className="font-bold">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-500">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isProcessingOrder}
                className={`w-full mt-6 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-rose-700 hover:bg-rose-600 text-white"
                    : "bg-rose-900 hover:bg-rose-950 text-white"
                } ${
                  isProcessingOrder
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                {isProcessingOrder ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>Place Order</>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <p
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  🔒 Your payment information is secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
