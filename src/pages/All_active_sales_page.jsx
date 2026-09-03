import { useState, useEffect } from "react";
import { getActiveSales } from "../api/saleApi"; 
import { useTheme } from "../context/ThemeContext";
import SaleCard from "../components/SaleCard";

function AllActiveSale() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        setError("");
        const res = await getActiveSales();

        // Extract array from response envelope (res.data.data)
        const salesData = res.data?.data || [];
        setSales(salesData);
      } catch (err) {
        console.error("Error fetching active sales:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load active sales."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div
        className={`min-h-[70vh] flex items-center justify-center ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse font-serif text-base">
          🔥 Fetching live active sales...
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

  if (sales.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[70vh] font-serif transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
        }`}
      >
        <div className="text-5xl mb-3">🏷️</div>
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-slate-200" : "text-gray-700"
          }`}
        >
          No Active Sales Available Right Now
        </h2>
        <p
          className={`text-sm mt-1 ${
            isDark ? "text-slate-500" : "text-gray-400"
          }`}
        >
          Check back later for exclusive artisan discounts and seasonal offers!
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Title Header */}
      <div
        className={`mb-10 border-b pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <div>
          <h1
            className={`text-2xl md:text-3xl font-bold font-serif uppercase tracking-wide flex items-center gap-2 ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            <span>🔥 Active Store Sales</span>
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Explore live discount campaigns directly from verified saree artisans.
          </p>
        </div>

        <div
          className={`text-xs font-semibold px-4 py-2 rounded-full shadow-sm border ${
            isDark
              ? "bg-rose-950/60 border-rose-900/60 text-rose-300"
              : "bg-rose-900 text-white border-transparent"
          }`}
        >
          Active Campaigns: {sales.length}
        </div>
      </div>

      {/* Sales Grid Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sales.map((sale) => (
          <SaleCard key={sale._id} sale={sale} />
        ))}
      </div>
    </div>
  );
}

export default AllActiveSale;