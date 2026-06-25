import { useState } from "react";
import { Link } from "react-router-dom";
import { useSaree } from "../context/SareeContext";
import CreateSale from "./CreateSale"; 
import { useTheme } from "../context/ThemeContext";

function AdminDashboard() {
  const { sarees } = useSaree();
  const { theme } = useTheme();
  
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const TotalStock = sarees.reduce((total, saree) => total + saree.stock, 0);
  const LowStock = sarees.filter((saree) => saree.stock < 5).length;

  // Empty Inventory Screen
  if (sarees.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] font-serif transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
      }`}>
        <div className="text-4xl mb-3">📦</div>
        <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-slate-200" : "text-gray-700"}`}>
          Inventory is Completely Empty
        </h2>
        <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`}>
          Get started by launching your very first item variant.
        </p>
        <Link 
          to="/admin/add-saree" 
          className={`mt-5 px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider shadow transition-colors ${
            theme === "dark" 
              ? "bg-rose-700 text-white hover:bg-rose-600" 
              : "bg-rose-900 text-white hover:bg-rose-950"
          }`}
        >
          + Add First Saree
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
      theme === "dark" ? "bg-slate-950" : "bg-gray-50"
    }`}>
      
      {/* Upper Welcome Header */}
      <div className={`mb-10 border-b pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
        theme === "dark" ? "border-slate-800" : "border-gray-200"
      }`}>
        <div>
          <h1 className={`text-2xl font-bold font-serif uppercase tracking-wide ${
            theme === "dark" ? "text-slate-100" : "text-gray-800"
          }`}>
            Admin Control Center
          </h1>
          <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
            Real-time boutique metrics, batch health monitoring, and stock alerts.
          </p>
        </div>
      </div>

      {/* Analytics Scoreboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        
        {/* Variety Total Counter */}
        <div className={`p-6 rounded-xl border shadow-sm flex items-center justify-between transition-all ${
          theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider block ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`}>
              Total Unique Designs
            </span>
            <span className={`text-3xl font-extrabold mt-2 block ${theme === "dark" ? "text-slate-100" : "text-gray-800"}`}>
              {sarees.length}
            </span>
          </div>
          <div className={`text-2xl p-3 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-gray-50"}`}>🏷️</div>
        </div>

        {/* Total Loose Stock Counter */}
        <div className={`p-6 rounded-xl border shadow-sm flex items-center justify-between transition-all ${
          theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider block ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`}>
              Total Pieces in Stock
            </span>
            <span className={`text-3xl font-extrabold mt-2 block ${theme === "dark" ? "text-rose-400" : "text-rose-900"}`}>
              {TotalStock}
            </span>
          </div>
          <div className={`text-2xl p-3 rounded-lg ${theme === "dark" ? "bg-rose-950/40 text-rose-400" : "bg-rose-50 text-rose-900"}`}>📦</div>
        </div>

        {/* Low Stock Tracker */}
        <div className={`p-6 rounded-xl shadow-sm flex items-center justify-between border transition-all ${
          theme === "dark" 
            ? LowStock > 0 ? "bg-slate-900 border-red-900/50 border-l-4 border-l-red-500" : "bg-slate-900 border-slate-800"
            : LowStock > 0 ? "bg-white border-red-100 border-l-4 border-l-red-500" : "bg-white border-gray-100"
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider block ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`}>
              Low Stock Alerts
            </span>
            <span className={`text-3xl font-extrabold mt-2 block ${
              LowStock > 0 ? "text-red-500" : theme === "dark" ? "text-emerald-400" : "text-emerald-600"
            }`}>
              {LowStock}
            </span>
          </div>
          <div className={`text-2xl p-3 rounded-lg ${
            LowStock > 0 
              ? theme === "dark" ? "bg-red-950/40" : "bg-red-50" 
              : theme === "dark" ? "bg-emerald-950/40" : "bg-emerald-50"
          }`}>
            ⚠️
          </div>
        </div>

      </div>

      {/* Quick Launch Control Hub */}
      <div>
        <h2 className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme === "dark" ? "text-slate-500" : "text-gray-400"}`}>
          Quick Utilities
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Add New Saree */}
          <Link 
            to="/admin/add-saree"
            className={`p-5 border rounded-xl transition-all flex flex-col justify-between group cursor-pointer shadow-sm ${
              theme === "dark" 
                ? "bg-slate-900 border-slate-800 hover:border-rose-400" 
                : "bg-white border-gray-200 hover:border-rose-900"
            }`}
          >
            <div>
              <span className={`font-serif font-bold text-base block transition-colors ${
                theme === "dark" ? "text-slate-200 group-hover:text-rose-400" : "text-gray-800 group-hover:text-rose-900"
              }`}>
                Add New Saree
              </span>
              <span className={`text-xs mt-1 block ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}>
                Upload fresh fabric images, details, and adjust inventories.
              </span>
            </div>
            <span className={`text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform ${
              theme === "dark" ? "text-rose-400" : "text-rose-900"
            }`}>
              Launch Form &rarr;
            </span>
          </Link>

          {/* Create Sale Event */}
          <button 
            onClick={() => setIsSaleModalOpen(true)}
            className={`text-left p-5 border rounded-xl transition-all flex flex-col justify-between group cursor-pointer shadow-sm w-full focus:outline-none ${
              theme === "dark" 
                ? "bg-slate-900 border-slate-800 hover:border-rose-400" 
                : "bg-white border-gray-200 hover:border-rose-800"
            }`}
          >
            <div>
              <span className={`font-serif font-bold text-base block transition-colors ${
                theme === "dark" ? "text-slate-200 group-hover:text-rose-400" : "text-gray-800 group-hover:text-rose-800"
              }`}>
                🎉 Create Sale Event
              </span>
              <span className={`text-xs mt-1 block ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}>
                Launch instant discount campaign overlays for seasonal banners.
              </span>
            </div>
            <span className={`text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform ${
              theme === "dark" ? "text-rose-400" : "text-rose-800"
            }`}>
              Open Popup Box &rarr;
            </span>
          </button>

          {/* Manage Custom Requests */}
          <Link 
            to="/request"
            className={`p-5 border rounded-xl transition-all flex flex-col justify-between group cursor-pointer shadow-sm ${
              theme === "dark" 
                ? "bg-slate-900 border-slate-800 hover:border-amber-500" 
                : "bg-white border-gray-200 hover:border-amber-600"
            }`}
          >
            <div>
              <span className={`font-serif font-bold text-base block transition-colors ${
                theme === "dark" ? "text-slate-200 group-hover:text-amber-400" : "text-gray-800 group-hover:text-amber-700"
              }`}>
                Manage Custom Requests
              </span>
              <span className={`text-xs mt-1 block ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}>
                Review user design submissions, approve tickets or reject orders.
              </span>
            </div>
            <span className={`text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform ${
              theme === "dark" ? "text-amber-400" : "text-amber-600"
            }`}>
              Open Queue &rarr;
            </span>
          </Link>

          {/* View live Shop Catalog */}
          <Link 
            to="/sarees"
            className={`p-5 border rounded-xl transition-all flex flex-col justify-between group cursor-pointer shadow-sm ${
              theme === "dark" 
                ? "bg-slate-900 border-slate-800 hover:border-slate-600" 
                : "bg-white border-gray-200 hover:border-gray-400"
            }`}
          >
            <div>
              <span className={`font-serif font-bold text-base block transition-colors ${
                theme === "dark" ? "text-slate-200" : "text-gray-800"
              }`}>
                View live Shop Catalog
              </span>
              <span className={`text-xs mt-1 block ${theme === "dark" ? "text-slate-400" : "text-gray-400"}`}>
                See how the product grids and stock numbers render for users live.
              </span>
            </div>
            <span className={`text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform ${
              theme === "dark" ? "text-slate-400" : "text-gray-600"
            }`}>
              Browse Store &rarr;
            </span>
          </Link>

        </div>
      </div>

      {/* Sale Creator Popup */}
      <CreateSale isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />

    </div>
  );
}

export default AdminDashboard;