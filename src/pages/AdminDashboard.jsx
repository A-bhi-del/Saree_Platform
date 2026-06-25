import { useState } from "react";
import { Link } from "react-router-dom";
import { useSaree } from "../context/SareeContext";
import CreateSale from "./CreateSale"; // Make sure to import your modal file correctly

function AdminDashboard() {
  const { sarees } = useSaree();
  
  // State to manage the open/close behavior of the CreateSale Modal Popup
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const TotalStock = sarees.reduce((total, saree) => total + saree.stock, 0);
  const LowStock = sarees.filter((saree) => saree.stock < 5).length;

  if (sarees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 font-serif">
        <div className="text-4xl mb-3">📦</div>
        <h2 className="text-xl font-semibold text-gray-700">Inventory is Completely Empty</h2>
        <p className="text-sm text-gray-400 mt-1">Get started by launching your very first item variant.</p>
        <Link 
          to="/admin/add-saree" 
          className="mt-5 bg-rose-900 text-white px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider shadow hover:bg-rose-950 transition-colors"
        >
          + Add First Saree
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-10">
      
      {/* Upper Welcome Header */}
      <div className="mb-10 border-b border-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-serif uppercase tracking-wide">
            Admin Control Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time boutique metrics, batch health monitoring, and stock alerts.</p>
        </div>
      </div>

      {/* Analytics Scoreboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        
        {/* Variety Total Counter */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Unique Designs</span>
            <span className="text-3xl font-extrabold text-gray-800 mt-2 block">{sarees.length}</span>
          </div>
          <div className="text-2xl bg-gray-50 p-3 rounded-lg">🏷️</div>
        </div>

        {/* Total Loose Stock Counter */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Pieces in Stock</span>
            <span className="text-3xl font-extrabold text-rose-900 mt-2 block">{TotalStock}</span>
          </div>
          <div className="text-2xl bg-rose-50 p-3 rounded-lg text-rose-900">📦</div>
        </div>

        {/* Low Stock Tracker with conditional border alerts */}
        <div className={`bg-white p-6 rounded-xl shadow-sm flex items-center justify-between border ${
          LowStock > 0 ? "border-red-100 border-l-4 border-l-red-500" : "border-gray-100"
        }`}>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <span className={`text-3xl font-extrabold mt-2 block ${LowStock > 0 ? "text-red-600" : "text-emerald-600"}`}>
              {LowStock}
            </span>
          </div>
          <div className={`text-2xl p-3 rounded-lg ${LowStock > 0 ? "bg-red-50" : "bg-emerald-50"}`}>
            ⚠️
          </div>
        </div>

      </div>

      {/* Quick Launch Control Hub */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Quick Utilities
        </h2>
        
        {/* Responsive grid changed to grid-cols-2 for clean look, as we now have 4 utilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Add New Saree */}
          <Link 
            to="/admin/add-saree"
            className="p-5 bg-white border border-gray-200 rounded-xl hover:border-rose-900 transition-all flex flex-col justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <span className="font-serif font-bold text-gray-800 group-hover:text-rose-900 text-base block">Add New Saree</span>
              <span className="text-xs text-gray-400 mt-1 block">Upload fresh fabric images, details, and adjust inventories.</span>
            </div>
            <span className="text-rose-900 text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform">Launch Form &rarr;</span>
          </Link>

          {/* New Utility: Create Sale (Triggers Box/Modal Overlay) */}
          <button 
            onClick={() => setIsSaleModalOpen(true)}
            className="text-left p-5 bg-white border border-gray-200 rounded-xl hover:border-rose-800 transition-all flex flex-col justify-between group cursor-pointer shadow-sm w-full focus:outline-none"
          >
            <div>
              <span className="font-serif font-bold text-gray-800 group-hover:text-rose-800 text-base block">🎉 Create Sale Event</span>
              <span className="text-xs text-gray-400 mt-1 block">Launch instant discount campaign overlays for seasonal banners.</span>
            </div>
            <span className="text-rose-800 text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform">Open Popup Box &rarr;</span>
          </button>

          {/* Manage Custom Requests */}
          <Link 
            to="/request"
            className="p-5 bg-white border border-gray-200 rounded-xl hover:border-amber-600 transition-all flex flex-col justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <span className="font-serif font-bold text-gray-800 group-hover:text-amber-700 text-base block">Manage Custom Requests</span>
              <span className="text-xs text-gray-400 mt-1 block">Review user design submissions, approve tickets or reject orders.</span>
            </div>
            <span className="text-amber-600 text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform">Open Queue &rarr;</span>
          </Link>

          {/* View live Shop Catalog */}
          <Link 
            to="/sarees"
            className="p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-all flex flex-col justify-between group cursor-pointer shadow-sm"
          >
            <div>
              <span className="font-serif font-bold text-gray-800 text-base block">View live Shop Catalog</span>
              <span className="text-xs text-gray-400 mt-1 block">See how the product grids and stock numbers render for users live.</span>
            </div>
            <span className="text-gray-600 text-xs font-bold mt-4 inline-block group-hover:translate-x-1 transition-transform">Browse Store &rarr;</span>
          </Link>

        </div>
      </div>

      {/* Sale Creator Popup Hooked Here */}
      <CreateSale isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} />

    </div>
  );
}

export default AdminDashboard;