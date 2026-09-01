import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSaree } from "../context/SareeContext";
import { useSale } from "../context/SaleContext";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { useTheme } from "../context/ThemeContext";
import SalesBanner from "../components/SaleBanner";
import SareeCard from "../components/SareeCard"; // 👈 Imported Extracted Component

function Sarees() {
  const { theme } = useTheme();
  const { addFavourites } = useFavourites();
  const { sarees, deleteSaree } = useSaree();
  const { sale } = useSale();

  const [searchName, setSearchName] = useState("");
  const [searchColor, setSearchColor] = useState("");
  const [searchFabric, setSearchFabric] = useState("");
  const [searchMinimumPrice, setSearchMinimumPrice] = useState("");
  const [searchMaximumPrice, setSearchMaximumPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const { role } = useAuth();

  const isDark = theme === "dark";

  const filterSarees = sarees.filter((saree) => {
    const matchName =
      !searchName ||
      saree.name.toLowerCase().includes(searchName.toLowerCase());
    const matchColor =
      !searchColor || saree.color.toLowerCase() === searchColor.toLowerCase();
    const matchFabric =
      !searchFabric ||
      saree.fabric.toLowerCase() === searchFabric.toLowerCase();
    const matchMinimumPrice =
      !searchMinimumPrice || saree.price >= Number(searchMinimumPrice);
    const matchMaximumPrice =
      !searchMaximumPrice || saree.price <= Number(searchMaximumPrice);

    return (
      matchName &&
      matchColor &&
      matchFabric &&
      matchMinimumPrice &&
      matchMaximumPrice
    );
  });

  const sortedSarees = [...filterSarees].sort((a, b) => {
    if (sortBy === "priceLowToHigh") return a.price - b.price;
    if (sortBy === "priceHighToLow") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  });

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-8 transition-all duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Dynamic Extracted Sales Banner Component */}
      {role === "customer" && <SalesBanner sale={sale} isDark={isDark} />}

      {/* Main Content Body */}
      {sarees.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center min-h-[30vh] font-serif ${
            isDark ? "text-slate-500" : "text-gray-500"
          }`}
        >
          <h2
            className={`text-2xl font-semibold ${
              isDark ? "text-slate-300" : "text-gray-700"
            }`}
          >
            No Sarees Available At The Moment
          </h2>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          >
            Please check back later or contact admin.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <h1
              className={`text-3xl font-bold font-serif uppercase tracking-wider ${
                isDark ? "text-rose-400" : "text-rose-900"
              }`}
            >
              Our Exclusive Collection
            </h1>
            <p
              className={`text-xs font-medium tracking-wide mt-1 ${
                isDark ? "text-slate-400" : "text-gray-400"
              }`}
            >
              Handwoven masterpieces curation crafted by generational heritage
              artisans
            </p>
            <div
              className={`h-0.5 w-16 mx-auto mt-3 ${
                isDark ? "bg-amber-600" : "bg-amber-500"
              }`}
            ></div>
          </div>

          {/* Filter Layout */}
          <div
            className={`p-5 rounded-2xl border shadow-sm mb-10 transition-colors duration-300 ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100"
            }`}
          >
            <div
              className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-gray-400"
              }`}
            >
              <span>🎛️ Filter & Sort Catalog</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="🔍 Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="🎨 Search by Color"
                value={searchColor}
                onChange={(e) => setSearchColor(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="🧵 Search by Fabric"
                value={searchFabric}
                onChange={(e) => setSearchFabric(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                }`}
              />
              <input
                type="number"
                placeholder="₹ Min Price"
                value={searchMinimumPrice}
                onChange={(e) => setSearchMinimumPrice(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                }`}
              />
              <input
                type="number"
                placeholder="₹ Max Price"
                value={searchMaximumPrice}
                onChange={(e) => setSearchMaximumPrice(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500"
                    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                }`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl font-semibold cursor-pointer focus:outline-none ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-300"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <option value="">Sort By</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSearchName("");
                  setSearchColor("");
                  setSearchFabric("");
                  setSearchMinimumPrice("");
                  setSearchMaximumPrice("");
                  setSortBy("");
                }}
                className={`text-xs font-semibold underline cursor-pointer ${
                  isDark
                    ? "text-rose-400 hover:text-rose-300"
                    : "text-rose-900 hover:text-rose-950"
                }`}
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Saree Collection Grid */}
          <div>
            {sortedSarees.length === 0 ? (
              <div
                className={`text-center py-16 rounded-2xl border border-dashed transition-colors duration-300 ${
                  isDark
                    ? "bg-slate-900 border-slate-800 text-slate-500"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                <h2 className="text-xl font-serif font-semibold">
                  No Sarees Match Your Filters
                </h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {sortedSarees.map((saree, index) => (
                  <SareeCard
                    key={saree._id || index}
                    saree={saree}
                    isDark={isDark}
                    role={role}
                    addFavourites={addFavourites}
                    navigate={navigate}
                    deleteSaree={deleteSaree}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Sarees;