import { useSale } from "../context/SaleContext";
import { Link } from "react-router-dom";

function SalePage() {
  const { sale, toggleSale } = useSale();

  if (!sale || sale.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 font-serif px-4">
        <div className="text-4xl mb-3">📢</div>
        <h2 className="text-xl font-semibold text-gray-700">No Sale Campaigns Yet</h2>
        <p className="text-sm text-gray-400 mt-1 max-w-sm text-center">
          You haven't launched any promotional sales. Head back to the control panel to start one.
        </p>
        <Link 
          to="/admin" 
          className="mt-5 border border-rose-900 text-rose-900 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-rose-50 transition-colors"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-10">
      
      {/* Header Section */}
      <div className="mb-10 border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif uppercase tracking-wide">
            Sale Campaigns & Offers
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor, pause, or reactivate store-wide promotional events and discount structures.
          </p>
        </div>
        <Link 
          to="/admin"
          className="text-xs font-bold text-rose-900 hover:text-rose-950 uppercase tracking-wider flex items-center gap-1 self-start sm:self-center"
        >
          &larr; Control Center
        </Link>
      </div>

      {/* Sales Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sale.map((s) => (
          <div 
            key={s.id} 
            className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
              s.active ? "border-gray-100" : "border-gray-200 opacity-80"
            }`}
          >
            
            {/* Top Info Banner inside Card */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                {/* Sale Active / Paused Status Badge */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  s.active 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "bg-amber-50 text-amber-700 border border-amber-100"
                }`}>
                  {s.active ? "● Live Now" : "⏸️ Paused"}
                </span>

                {/* Big Discount Circular Tag */}
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-rose-900 font-serif">{s.discount}%</span>
                  <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-tight">OFF</span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-lg font-bold text-gray-800 font-serif leading-tight group-hover:text-rose-900">
                {s.saleName}
              </h2>
              <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed font-medium">
                {s.description || s.discription || "No description provided for this offer."}
              </p>
            </div>

            {/* Campaign Duration Meta & Controls */}
            <div className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 mt-auto">
              {/* Date Metadata info */}
              <div className="flex justify-between items-center text-gray-500 text-[11px] font-semibold mb-4 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                <div>
                  <span className="text-gray-400 block uppercase text-[9px]">Starts</span>
                  <span className="text-gray-700">{s.startDate || "N/A"}</span>
                </div>
                <div className="h-4 w-[1px] bg-gray-200"></div>
                <div className="text-right">
                  <span className="text-gray-400 block uppercase text-[9px]">Ends</span>
                  <span className="text-gray-700">{s.endDate || "N/A"}</span>
                </div>
              </div>

              {/* Action Button */}
              {s.active === true ? (
                <button 
                  onClick={() => toggleSale(s.id)}
                  className="w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  ⏸️ Pause Campaign
                </button>
              ) : (
                <button 
                  onClick={() => toggleSale(s.id)}
                  className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  ▶️ Resume Campaign
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default SalePage;