import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function SaleCard({ sale }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const {
    title,
    description,
    discountType,
    discountValue,
    startDate,
    endDate,
    admin,
  } = sale;

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  function getTimeRemaining(endTime) {
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds, expired: false };
  }

  return (
    <div
      className={`rounded-2xl border shadow-sm p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-gray-100 text-gray-800"
      }`}
    >
      {/* Decorative Discount Tag Ribbon */}
      <div className="absolute top-0 right-0 bg-rose-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">
        {discountType === "percentage"
          ? `${discountValue}% OFF`
          : `₹${discountValue} OFF`}
      </div>

      <div className="space-y-4">
        {/* Admin Store Info Header */}
        {admin && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-500/30 flex-shrink-0 bg-slate-800">
              <img
                src={
                  admin.profileImage ||
                  "https://placehold.co/100x100?text=Shop"
                }
                alt={admin.shopName || "Store"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/100x100?text=Shop";
                }}
              />
            </div>
            <div>
              <h4
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? "text-amber-400" : "text-amber-700"
                }`}
              >
                {admin.shopName || "Verified Artisan Store"}
              </h4>
              <span
                className={`text-[10px] ${
                  isDark ? "text-slate-400" : "text-gray-500"
                }`}
              >
                Limited Period Offer
              </span>
            </div>
          </div>
        )}

        {/* Title and Description */}
        <div>
          <h3 className="text-xl font-bold font-serif line-clamp-1 pr-16">
            {title}
          </h3>
          <p
            className={`text-xs mt-2 line-clamp-3 ${
              isDark ? "text-slate-400" : "text-gray-600"
            }`}
          >
            {description || "No specific terms provided for this sale."}
          </p>
        </div>
      </div>

      {/* Sale Timer and Valid Dates Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-800 space-y-3">
        {/* Realtime Countdown Timer */}
        <div
          className={`p-3 rounded-xl flex items-center justify-between text-xs border ${
            isDark
              ? "bg-slate-800/60 border-slate-700/60"
              : "bg-rose-50/50 border-rose-100"
          }`}
        >
          <span className="font-semibold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            ⏳ {timeLeft.expired ? "Sale Ended" : "Ends In:"}
          </span>
          {!timeLeft.expired ? (
            <div className="font-bold font-mono tracking-tight text-xs flex gap-1">
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.days).padStart(2, "0")}d
              </span>
              <span>:</span>
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span>:</span>
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span>:</span>
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          ) : (
            <span className="font-bold text-red-500">Expired</span>
          )}
        </div>

        {/* Date Limits Display */}
        <div
          className={`flex justify-between items-center text-[11px] ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          <span>
            Start: {new Date(startDate).toLocaleDateString()}
          </span>
          <span>
            End: {new Date(endDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default SaleCard;