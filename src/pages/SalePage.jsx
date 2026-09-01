import { useSale } from "../context/SaleContext";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SalePage() {
  const { sale, removeSale } = useSale();
  const { theme } = useTheme();

  console.log(sale);

  const isDark = theme === "dark";

  // Check if Sale is currently Active based on current date
  const isSaleActive = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  // Date Formatter helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!sale || sale.length === 0) {
  return (
    <div
      className={`min-h-[calc(100dvh-80px)] w-full flex flex-col items-center justify-center font-serif px-4 transition-colors duration-300 overflow-hidden ${
        isDark ? "text-slate-400 bg-slate-950" : "text-gray-500 bg-gray-50"
      }`}
    >
      <div className="text-4xl mb-3">📢</div>
      <h2
        className={`text-xl font-semibold ${
          isDark ? "text-slate-200" : "text-gray-700"
        }`}
      >
        No Active Sale Campaigns
      </h2>
      <p
        className={`text-sm mt-1 max-w-sm text-center ${
          isDark ? "text-slate-500" : "text-gray-400"
        }`}
      >
        You haven't launched any promotional sales yet.
      </p>
      <Link
        to="/admin"
        className={`mt-5 border px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
          isDark
            ? "border-rose-400 text-rose-400 hover:bg-rose-950/30"
            : "border-rose-900 text-rose-900 hover:bg-rose-50"
        }`}
      >
        &larr; Back to Dashboard
      </Link>
    </div>
  );
}
  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`mb-10 border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isDark ? "border-slate-800" : "border-gray-200"}`}
      >
        <div>
          <h1
            className={`text-2xl font-bold font-serif uppercase tracking-wide ${isDark ? "text-slate-100" : "text-gray-800"}`}
          >
            Sale Campaigns & Offers
          </h1>
          <p
            className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}
          >
            Monitor or delete active store promotional events.
          </p>
        </div>
        <Link
          to="/admin"
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 self-start sm:self-center ${
            isDark
              ? "text-rose-400 hover:text-rose-300"
              : "text-rose-900 hover:text-rose-950"
          }`}
        >
          &larr; Control Center
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sale.map((s) => {
          const saleId = s._id;
          const active = isSaleActive(s.startDate, s.endDate);

          return (
            <div
              key={saleId}
              className={`rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isDark
                  ? `${active ? "border-slate-800" : "border-slate-800/60 opacity-60"} bg-slate-900`
                  : `${active ? "border-gray-100" : "border-gray-200 opacity-80"} bg-white`
              }`}
            >
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      active
                        ? isDark
                          ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : isDark
                          ? "bg-amber-950/50 text-amber-400 border border-amber-900/40"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {active ? "● Live Now" : "⏸️ Expired / Scheduled"}
                  </span>

                  {/* Discount Badge */}
                  <div className="text-right">
                    <span
                      className={`text-2xl font-extrabold font-serif ${isDark ? "text-rose-400" : "text-rose-900"}`}
                    >
                      {s.discountValue || s.discount}%
                    </span>
                    <span
                      className={`text-[10px] font-semibold block uppercase tracking-tight ${isDark ? "text-slate-500" : "text-gray-400"}`}
                    >
                      OFF
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h2
                  className={`text-lg font-bold font-serif leading-tight ${isDark ? "text-slate-100" : "text-gray-800"}`}
                >
                  {s.title || s.saleName}
                </h2>
                <p
                  className={`text-xs mt-2 line-clamp-3 leading-relaxed font-medium ${isDark ? "text-slate-400" : "text-gray-500"}`}
                >
                  {s.description ||
                    "No description provided for this campaign."}
                </p>
              </div>

              {/* Dates & Actions */}
              <div
                className={`border-t px-6 py-4 mt-auto ${isDark ? "bg-slate-900/50 border-slate-800" : "bg-gray-50/70 border-gray-100"}`}
              >
                <div
                  className={`flex justify-between items-center text-[11px] font-semibold mb-4 px-3 py-1.5 rounded-lg border ${
                    isDark
                      ? "bg-slate-800/40 border-slate-800/80 text-slate-300"
                      : "bg-white border-gray-100 text-gray-500"
                  }`}
                >
                  <div>
                    <span
                      className={`block uppercase text-[9px] ${isDark ? "text-slate-500" : "text-gray-400"}`}
                    >
                      Starts
                    </span>
                    <span
                      className={isDark ? "text-slate-200" : "text-gray-700"}
                    >
                      {formatDate(s.startDate)}
                    </span>
                  </div>
                  <div
                    className={`h-4 w-[1px] ${isDark ? "bg-slate-700" : "bg-gray-200"}`}
                  ></div>
                  <div className="text-right">
                    <span
                      className={`block uppercase text-[9px] ${isDark ? "text-slate-500" : "text-gray-400"}`}
                    >
                      Ends
                    </span>
                    <span
                      className={isDark ? "text-slate-200" : "text-gray-700"}
                    >
                      {formatDate(s.endDate)}
                    </span>
                  </div>
                </div>

                {/* Delete Campaign Button */}
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Kyan aap sachme is sale campaign ko remove karna chahte hain?",
                      )
                    ) {
                      removeSale(saleId);
                    }
                  }}
                  className={`w-full py-2.5 flex items-center justify-center border text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
                    isDark
                      ? "bg-red-950/40 hover:bg-red-900/30 text-red-400 border-red-900/40"
                      : "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                  }`}
                >
                  🗑️ Delete Campaign
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SalePage;
