import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getAllCoupons, toggleCouponStatus, deleteCoupon } from "../api/couponApi";

function AdminCoupons() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isActive, setIsActive] = useState("all");
  const [discountType, setDiscountType] = useState("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(null);

  // Fetch coupons
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");
      
      const params = {
        page,
        limit,
        isActive: isActive !== "all" ? isActive : undefined,
        discountType: discountType !== "all" ? discountType : undefined,
        search: search || undefined,
      };

      const response = await getAllCoupons(params);
      const data = response.data?.data || response.data;
      
      setCoupons(data);
      setPagination(response.data?.pagination);
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError(err.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, isActive, discountType]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchCoupons();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Toggle coupon status
  const handleToggleStatus = async (couponId, currentStatus) => {
    try {
      await toggleCouponStatus(couponId, !currentStatus);
      fetchCoupons();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Delete coupon
  const handleDelete = async (couponId, code) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      return;
    }

    try {
      await deleteCoupon(couponId);
      fetchCoupons();
    } catch (err) {
      console.error("Error deleting coupon:", err);
      alert(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading && coupons.length === 0) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif">Loading coupons...</p>
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
        className={`mb-8 border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <div>
          <h1
            className={`text-2xl font-bold font-serif uppercase tracking-wide ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            🎟️ Coupon Management
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Create, manage, and track discount coupons
          </p>
        </div>
        <Link
          to="/admin/coupons/create"
          className={`px-6 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap ${
            isDark
              ? "bg-rose-700 hover:bg-rose-600 text-white"
              : "bg-rose-900 hover:bg-rose-950 text-white"
          } transition-colors`}
        >
          + Create Coupon
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-red-500/10 text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Filters */}
      <div
        className={`mb-6 p-6 rounded-2xl border ${
          isDark
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-4 py-2.5 rounded-lg border text-sm ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-white border-gray-200 text-gray-800 placeholder-gray-400"
            } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
          />

          {/* Status Filter */}
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className={`px-4 py-2.5 rounded-lg border text-sm ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100"
                : "bg-white border-gray-200 text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
          >
            <option value="all">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className={`px-4 py-2.5 rounded-lg border text-sm ${
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-100"
                : "bg-white border-gray-200 text-gray-800"
            } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
          >
            <option value="all">All Types</option>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed Amount</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={fetchCoupons}
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            } transition-colors disabled:opacity-50`}
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div
          className={`p-12 rounded-2xl border text-center ${
            isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="text-6xl mb-4">🎟️</div>
          <h3
            className={`text-xl font-bold mb-2 ${
              isDark ? "text-slate-200" : "text-gray-800"
            }`}
          >
            No Coupons Found
          </h3>
          <p
            className={`text-sm mb-6 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            {search
              ? "Try a different search term"
              : "Create your first coupon to get started"}
          </p>
          <Link
            to="/admin/coupons/create"
            className={`inline-block px-6 py-2.5 rounded-lg font-semibold text-sm ${
              isDark
                ? "bg-rose-700 hover:bg-rose-600 text-white"
                : "bg-rose-900 hover:bg-rose-950 text-white"
            } transition-colors`}
          >
            + Create First Coupon
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => {
            const isExpired = new Date(coupon.expiresAt) < new Date();
            const isNotStarted = new Date(coupon.startsAt) > new Date();
            const usagePercent = coupon.usageLimit
              ? (coupon.usageStats.totalUsage / coupon.usageLimit) * 100
              : 0;

            return (
              <div
                key={coupon._id}
                className={`p-6 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-slate-900 border-slate-800 hover:border-slate-700"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left: Coupon Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Status Badge */}
                      <div
                        className={`text-3xl p-3 rounded-lg ${
                          coupon.isActive && !isExpired && !isNotStarted
                            ? isDark
                              ? "bg-emerald-950/40 text-emerald-400"
                              : "bg-emerald-50 text-emerald-600"
                            : isDark
                              ? "bg-slate-800 text-slate-500"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        🎟️
                      </div>

                      <div className="flex-1">
                        {/* Code */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`text-xl font-bold font-mono ${
                              isDark ? "text-slate-100" : "text-gray-800"
                            }`}
                          >
                            {coupon.code}
                          </h3>
                          
                          {/* Status Badges */}
                          <div className="flex gap-2">
                            {coupon.isActive ? (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                Inactive
                              </span>
                            )}
                            
                            {isExpired && (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
                                Expired
                              </span>
                            )}
                            
                            {isNotStarted && (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                Scheduled
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {coupon.description && (
                          <p
                            className={`text-sm mb-3 ${
                              isDark ? "text-slate-400" : "text-gray-600"
                            }`}
                          >
                            {coupon.description}
                          </p>
                        )}

                        {/* Discount Info */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span
                              className={`${
                                isDark ? "text-slate-500" : "text-gray-500"
                              }`}
                            >
                              Discount:{" "}
                            </span>
                            <span
                              className={`font-bold ${
                                isDark ? "text-rose-400" : "text-rose-600"
                              }`}
                            >
                              {coupon.discountType === "PERCENTAGE"
                                ? `${coupon.discountValue}% off`
                                : `₹${coupon.discountValue} off`}
                            </span>
                            {coupon.maxDiscountAmount && (
                              <span
                                className={`ml-1 ${
                                  isDark ? "text-slate-500" : "text-gray-500"
                                }`}
                              >
                                (max ₹{coupon.maxDiscountAmount})
                              </span>
                            )}
                          </div>

                          <div>
                            <span
                              className={`${
                                isDark ? "text-slate-500" : "text-gray-500"
                              }`}
                            >
                              Min Order:{" "}
                            </span>
                            <span
                              className={`font-semibold ${
                                isDark ? "text-slate-300" : "text-gray-700"
                              }`}
                            >
                              ₹{coupon.minOrderAmount}
                            </span>
                          </div>

                          <div>
                            <span
                              className={`${
                                isDark ? "text-slate-500" : "text-gray-500"
                              }`}
                            >
                              Valid:{" "}
                            </span>
                            <span
                              className={`font-semibold ${
                                isDark ? "text-slate-300" : "text-gray-700"
                              }`}
                            >
                              {formatDate(coupon.startsAt)} -{" "}
                              {formatDate(coupon.expiresAt)}
                            </span>
                          </div>
                        </div>

                        {/* Usage Stats */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-semibold ${
                                isDark ? "text-slate-500" : "text-gray-500"
                              }`}
                            >
                              Usage
                            </span>
                            <span
                              className={`text-xs font-bold ${
                                isDark ? "text-slate-300" : "text-gray-700"
                              }`}
                            >
                              {coupon.usageStats.totalRedeemed} redeemed
                              {coupon.usageLimit &&
                                ` / ${coupon.usageLimit} limit`}
                            </span>
                          </div>
                          {coupon.usageLimit && (
                            <div
                              className={`h-2 rounded-full overflow-hidden ${
                                isDark ? "bg-slate-800" : "bg-gray-100"
                              }`}
                            >
                              <div
                                className={`h-full transition-all ${
                                  usagePercent >= 90
                                    ? "bg-red-500"
                                    : usagePercent >= 70
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <Link
                      to={`/admin/coupons/${coupon._id}/edit`}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm text-center ${
                        isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-100"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      } transition-colors`}
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleToggleStatus(coupon._id, coupon.isActive)
                      }
                      className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                        coupon.isActive
                          ? isDark
                            ? "bg-amber-900/40 hover:bg-amber-900/60 text-amber-400"
                            : "bg-amber-50 hover:bg-amber-100 text-amber-700"
                          : isDark
                            ? "bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-400"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                      } transition-colors`}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(coupon._id, coupon.code)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                        isDark
                          ? "bg-red-900/40 hover:bg-red-900/60 text-red-400"
                          : "bg-red-50 hover:bg-red-100 text-red-700"
                      } transition-colors`}
                    >
                      🗑️ Delete
                    </button>

                    <Link
                      to={`/admin/coupons/${coupon._id}/redemptions`}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm text-center ${
                        isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      } transition-colors`}
                    >
                      📊 History
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-100 disabled:opacity-50"
                : "bg-white hover:bg-gray-50 text-gray-800 disabled:opacity-50"
            } border ${
              isDark ? "border-slate-700" : "border-gray-200"
            } transition-colors`}
          >
            Previous
          </button>

          <span
            className={`px-4 py-2 text-sm ${
              isDark ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-slate-100 disabled:opacity-50"
                : "bg-white hover:bg-gray-50 text-gray-800 disabled:opacity-50"
            } border ${
              isDark ? "border-slate-700" : "border-gray-200"
            } transition-colors`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminCoupons;
