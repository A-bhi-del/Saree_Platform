import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getCouponById, updateCoupon } from "../api/couponApi";

function EditCoupon() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderAmount: "0",
    startsAt: "",
    expiresAt: "",
    usageLimit: "",
    perUserLimit: "1",
    applicableCategories: "",
    firstOrderOnly: false,
    allowSaleItems: true,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  // Fetch existing coupon data
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await getCouponById(id);
        const coupon = response.data?.data || response.data;

        // Format dates for datetime-local input
        const formatDateForInput = (dateString) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setFormData({
          code: coupon.code,
          description: coupon.description || "",
          discountType: coupon.discountType,
          discountValue: coupon.discountValue.toString(),
          maxDiscountAmount: coupon.maxDiscountAmount ? coupon.maxDiscountAmount.toString() : "",
          minOrderAmount: coupon.minOrderAmount.toString(),
          startsAt: formatDateForInput(coupon.startsAt),
          expiresAt: formatDateForInput(coupon.expiresAt),
          usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
          perUserLimit: coupon.perUserLimit.toString(),
          applicableCategories: coupon.applicableCategories?.join(", ") || "",
          firstOrderOnly: coupon.firstOrderOnly,
          allowSaleItems: coupon.allowSaleItems,
          isActive: coupon.isActive,
        });
      } catch (err) {
        console.error("Error fetching coupon:", err);
        setError(err.response?.data?.message || "Failed to load coupon");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Code must be at least 3 characters";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      newErrors.discountValue = "Percentage cannot exceed 100%";
    }

    if (!formData.startsAt) {
      newErrors.startsAt = "Start date is required";
    }

    if (!formData.expiresAt) {
      newErrors.expiresAt = "Expiry date is required";
    }

    if (formData.startsAt && formData.expiresAt) {
      if (new Date(formData.expiresAt) <= new Date(formData.startsAt)) {
        newErrors.expiresAt = "Expiry date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Prepare data
      const data = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount
          ? parseFloat(formData.maxDiscountAmount)
          : null,
        minOrderAmount: parseFloat(formData.minOrderAmount) || 0,
        startsAt: new Date(formData.startsAt).toISOString(),
        expiresAt: new Date(formData.expiresAt).toISOString(),
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: parseInt(formData.perUserLimit) || 1,
        applicableCategories: formData.applicableCategories
          ? formData.applicableCategories.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
        firstOrderOnly: formData.firstOrderOnly,
        allowSaleItems: formData.allowSaleItems,
        isActive: formData.isActive,
      };

      await updateCoupon(id, data);
      navigate("/admin/coupons");
    } catch (err) {
      console.error("Error updating coupon:", err);
      setError(
        err.response?.data?.message || "Failed to update coupon. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif">Loading coupon...</p>
      </div>
    );
  }

  if (error && !formData.code) {
    return (
      <div
        className={`min-h-screen px-4 md:px-12 py-10 ${
          isDark ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-xl text-center bg-red-500/10 text-red-500 border border-red-500/20">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/admin/coupons")}
              className={`px-6 py-2.5 rounded-lg font-semibold text-sm ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              } transition-colors`}
            >
              Back to Coupons
            </button>
          </div>
        </div>
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
      <div
        className={`mb-8 border-b pb-5 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <button
          onClick={() => navigate("/admin/coupons")}
          className={`text-sm mb-3 flex items-center gap-1 ${
            isDark
              ? "text-slate-400 hover:text-slate-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          ← Back to Coupons
        </button>
        <h1
          className={`text-2xl font-bold font-serif uppercase tracking-wide ${
            isDark ? "text-slate-100" : "text-gray-800"
          }`}
        >
          Edit Coupon
        </h1>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          Modify coupon settings and restrictions
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-red-500/10 text-red-500 border border-red-500/20">
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl space-y-6">
          {/* Basic Information */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 pb-3 border-b ${
                isDark
                  ? "text-slate-100 border-slate-800"
                  : "text-gray-800 border-gray-200"
              }`}
            >
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="SAVE20"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm uppercase ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
                    errors.code ? "border-red-500" : ""
                  }`}
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Get 20% off on all sarees"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                />
              </div>
            </div>
          </div>

          {/* Discount Settings */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 pb-3 border-b ${
                isDark
                  ? "text-slate-100 border-slate-800"
                  : "text-gray-800 border-gray-200"
              }`}
            >
              Discount Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Discount Type */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder={formData.discountType === "PERCENTAGE" ? "20" : "500"}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
                      errors.discountValue ? "border-red-500" : ""
                    }`}
                  />
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                      isDark ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    {formData.discountType === "PERCENTAGE" ? "%" : "₹"}
                  </span>
                </div>
                {errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>
                )}
              </div>

              {/* Max Discount (only for percentage) */}
              {formData.discountType === "PERCENTAGE" && (
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Maximum Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    value={formData.maxDiscountAmount}
                    onChange={handleChange}
                    min="0"
                    placeholder="500"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      isDark
                        ? "bg-slate-800 border-slate-700 text-slate-100"
                        : "bg-white border-gray-200 text-gray-800"
                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                  />
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-slate-500" : "text-gray-400"
                    }`}
                  >
                    Optional: Maximum discount amount for percentage coupons
                  </p>
                </div>
              )}

              {/* Min Order Amount */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  min="0"
                  placeholder="1000"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                />
              </div>
            </div>
          </div>

          {/* Validity & Usage */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 pb-3 border-b ${
                isDark
                  ? "text-slate-100 border-slate-800"
                  : "text-gray-800 border-gray-200"
              }`}
            >
              Validity & Usage Limits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startsAt"
                  value={formData.startsAt}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
                    errors.startsAt ? "border-red-500" : ""
                  }`}
                />
                {errors.startsAt && (
                  <p className="text-red-500 text-xs mt-1">{errors.startsAt}</p>
                )}
              </div>

              {/* Expiry Date */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="expiresAt"
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20 ${
                    errors.expiresAt ? "border-red-500" : ""
                  }`}
                />
                {errors.expiresAt && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiresAt}</p>
                )}
              </div>

              {/* Usage Limit */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  min="1"
                  placeholder="100"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                />
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-slate-500" : "text-gray-400"
                  }`}
                >
                  Leave empty for unlimited uses
                </p>
              </div>

              {/* Per User Limit */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Per User Limit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="perUserLimit"
                  value={formData.perUserLimit}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                />
              </div>
            </div>
          </div>

          {/* Restrictions */}
          <div
            className={`p-6 rounded-2xl border ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-bold mb-4 pb-3 border-b ${
                isDark
                  ? "text-slate-100 border-slate-800"
                  : "text-gray-800 border-gray-200"
              }`}
            >
              Restrictions (Optional)
            </h2>

            <div className="space-y-4">
              {/* Applicable Categories */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Applicable Categories
                </label>
                <input
                  type="text"
                  name="applicableCategories"
                  value={formData.applicableCategories}
                  onChange={handleChange}
                  placeholder="Silk, Cotton, Designer"
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-slate-800 border-slate-700 text-slate-100"
                      : "bg-white border-gray-200 text-gray-800"
                  } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                />
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-slate-500" : "text-gray-400"
                  }`}
                >
                  Comma-separated category names. Leave empty for all categories.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="firstOrderOnly"
                    checked={formData.firstOrderOnly}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span
                    className={`text-sm ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    First Order Only (Valid only for customers' first purchase)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowSaleItems"
                    checked={formData.allowSaleItems}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-emerald-400" : "text-emerald-700"
                    }`}
                  >
                    Allow Sale Items (Can be applied to discounted products)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? "text-slate-100" : "text-gray-800"
                    }`}
                  >
                    Active (Coupon can be used immediately)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider ${
                isDark
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/coupons")}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold text-sm ${
                isDark
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              } transition-colors disabled:opacity-50`}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditCoupon;
