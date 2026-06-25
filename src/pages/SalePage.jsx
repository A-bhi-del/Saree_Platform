import { useSale } from "../context/SaleContext";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function SalePage() {
  const { sale, toggleSale, removeSale } = useSale();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  if (!sale || sale.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] font-serif px-4 transition-colors duration-300 ${
        isDark ? "text-slate-400 bg-slate-950" : "text-gray-500 bg-gray-50"
      }`}>
        <div className="text-4xl mb-3">📢</div>
        <h2 className={`text-xl font-semibold ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          No Sale Campaigns Yet
        </h2>
        <p className={`text-sm mt-1 max-w-sm text-center ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          You haven't launched any promotional sales. Head back to the control panel to start one.
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
    <div className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      
      {/* Header Section */}
      <div className={`mb-10 border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
        isDark ? "border-slate-800" : "border-gray-200"
      }`}>
        <div>
          <h1 className={`text-2xl font-bold font-serif uppercase tracking-wide ${
            isDark ? "text-slate-100" : "text-gray-800"
          }`}>
            Sale Campaigns & Offers
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Monitor, pause, or reactivate store-wide promotional events and discount structures.
          </p>
        </div>
        <Link 
          to="/admin"
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 self-start sm:self-center ${
            isDark ? "text-rose-400 hover:text-rose-300" : "text-rose-900 hover:text-rose-950"
          }`}
        >
          &larr; Control Center
        </Link>
      </div>

      {/* Sales Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sale.map((s) => (
          <div 
            key={s.id} 
            className={`rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
              isDark 
                ? `${s.active ? "border-slate-800" : "border-slate-800/60 opacity-60"} bg-slate-900` 
                : `${s.active ? "border-gray-100" : "border-gray-200 opacity-80"} bg-white`
            }`}
          >
            
            {/* Top Info Banner inside Card */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                {/* Sale Active / Paused Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  s.active 
                    ? isDark 
                      ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : isDark 
                      ? "bg-amber-950/50 text-amber-400 border border-amber-900/40" 
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {s.active ? "● Live Now" : "⏸️ Paused"}
                </span>

                {/* Big Discount Circular Tag */}
                <div className="text-right">
                  <span className={`text-2xl font-extrabold font-serif ${isDark ? "text-rose-400" : "text-rose-900"}`}>
                    {s.discount}%
                  </span>
                  <span className={`text-[10px] font-semibold block uppercase tracking-tight ${isDark ? "text-slate-500" : "text-gray-400"}`}>
                    OFF
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className={`text-lg font-bold font-serif leading-tight ${
                isDark ? "text-slate-100" : "text-gray-800"
              }`}>
                {s.saleName}
              </h2>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed font-medium ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}>
                {s.description || s.discription || "No description provided for this offer."}
              </p>
            </div>

            {/* Campaign Duration Meta & Controls */}
            <div className={`border-t px-6 py-4 mt-auto ${
              isDark ? "bg-slate-900/50 border-slate-800" : "bg-gray-50/70 border-gray-100"
            }`}>
              {/* Date Metadata info */}
              <div className={`flex justify-between items-center text-[11px] font-semibold mb-4 px-3 py-1.5 rounded-lg border ${
                isDark 
                  ? "bg-slate-800/40 border-slate-800/80 text-slate-300" 
                  : "bg-white border-gray-100 text-gray-500"
              }`}>
                <div>
                  <span className={`block uppercase text-[9px] ${isDark ? "text-slate-500" : "text-gray-400"}`}>Starts</span>
                  <span className={isDark ? "text-slate-200" : "text-gray-700"}>{s.startDate || "N/A"}</span>
                </div>
                <div className={`h-4 w-[1px] ${isDark ? "bg-slate-700" : "bg-gray-200"}`}></div>
                <div className="text-right">
                  <span className={`block uppercase text-[9px] ${isDark ? "text-slate-500" : "text-gray-400"}`}>Ends</span>
                  <span className={isDark ? "text-slate-200" : "text-gray-700"}>{s.endDate || "N/A"}</span>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div className="flex gap-3 w-full">
                {s.active === true ? (
                  <button 
                    onClick={() => toggleSale(s.id)}
                    className="w-2/3 text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    ⏸️ Pause
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleSale(s.id)}
                    className="w-2/3 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    ▶️ Resume
                  </button>
                )}

                {/* Newly Added Delete Action Button */}
                <button 
                  onClick={() => {
                    if (window.confirm("Bhai, kya aap sachme is sale campaign ko hamesha ke liye delete karna chahte hain?")) {
                      removeSale(s.id);
                    }
                  }}
                  className={`w-1/3 flex items-center justify-center border text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
                    isDark 
                      ? "bg-red-950/40 hover:bg-red-900/30 text-red-400 border-red-900/40" 
                      : "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                  }`}
                  title="Delete Campaign"
                >
                  🗑️ Delete
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default SalePage;