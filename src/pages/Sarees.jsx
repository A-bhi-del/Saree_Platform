import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSaree } from "../context/SareeContext";
import { useSale } from "../context/SaleContext";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { useTheme } from "../context/ThemeContext";
import SalesBanner from "../components/SaleBanner";

function SareeCard({
  saree,
  isDark,
  role,
  addFavourites,
  navigate,
  deleteSaree,
}) {
  const imageList =
    Array.isArray(saree.images) && saree.images.length > 0
      ? saree.images
      : saree.image
        ? [saree.image]
        : ["https://placehold.co/400x500?text=No+Saree+Image"];

  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const getSafeIdString = (idValue) => {
    if (!idValue) return "N/A";
    if (typeof idValue === "string" || typeof idValue === "number")
      return String(idValue);
    if (typeof idValue === "object") {
      return (
        idValue._id || idValue.id || idValue.email || idValue.name || "N/A"
      );
    }
    return "N/A";
  };

  const sareeId = getSafeIdString(saree._id || saree.id);
  const adminId = getSafeIdString(
    saree.adminId || saree.createdBy || saree.admin || saree.user,
  );

  const discountedPrice = Math.round(
    saree.price - (saree.price * saree.discountPercentage) / 100,
  );
  const hasDiscount = saree.discountPercentage > 0;

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md border flex flex-col group transition-all duration-300 ${
        isDark ? "bg-slate-900 border-slate-800/80" : "bg-white border-gray-100"
      }`}
    >
      <div
        className={`relative overflow-hidden aspect-[3/4] ${isDark ? "bg-slate-800" : "bg-gray-100"}`}
      >
        <img
          src={imageList[activeImgIdx]}
          alt={saree.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x500?text=Image+Load+Failed";
          }}
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 max-w-[70%]">
          {saree.stock < 5 && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border w-fit ${
                isDark
                  ? "bg-red-950/90 text-red-400 border-red-900/40"
                  : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              Low Stock ({saree.stock})
            </span>
          )}
          {hasDiscount && (
            <span className="bg-amber-500 dark:bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm w-fit">
              {saree.discountPercentage}% OFF
            </span>
          )}
        </div>

        <span
          className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md z-10 ${
            isDark ? "bg-slate-950/80 text-slate-200" : "bg-black/60 text-white"
          }`}
        >
          {saree.fabric}
        </span>

        {imageList.length > 1 && (
          <>
            <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 backdrop-blur-xs">
              📷 {activeImgIdx + 1}/{imageList.length}
            </span>

            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              ❮
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            >
              ❯
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIdx(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeImgIdx === idx ? "w-3 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div
          className={`p-2.5 mb-3 rounded-lg border flex flex-col gap-1 text-[11px] font-mono ${
            isDark
              ? "bg-slate-950/60 border-slate-800 text-slate-400"
              : "bg-gray-50 border-gray-200 text-gray-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold opacity-75">Saree ID:</span>
            <span
              className="font-bold select-all tracking-wider truncate max-w-[150px]"
              title={sareeId}
            >
              {sareeId}
            </span>
          </div>
          {role === "customer" && (
            <div className="flex items-center justify-between border-t border-dashed pt-1 mt-0.5 opacity-90">
              <span className="font-semibold opacity-75">Admin ID:</span>
              <span
                className="font-bold select-all tracking-wider truncate max-w-[150px]"
                title={adminId}
              >
                {adminId}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start gap-3 mb-2">
          <h3
            className={`text-base font-bold font-serif line-clamp-1 flex-grow ${isDark ? "text-slate-100" : "text-gray-800"}`}
          >
            {saree.name}
          </h3>
          <div className="flex flex-col text-right min-w-[80px]">
            {hasDiscount ? (
              <>
                <span
                  className={`text-[11px] line-through font-semibold ${isDark ? "text-slate-500" : "text-gray-400"}`}
                >
                  ₹{saree.price}
                </span>
                <span
                  className={`text-base font-extrabold leading-none ${isDark ? "text-rose-400" : "text-rose-900"}`}
                >
                  ₹{discountedPrice}
                </span>
              </>
            ) : (
              <span
                className={`text-base font-extrabold ${isDark ? "text-rose-400" : "text-rose-900"}`}
              >
                ₹{saree.price}
              </span>
            )}
          </div>
        </div>
        <p
          className={`text-xs line-clamp-2 mb-5 leading-relaxed flex-grow ${isDark ? "text-slate-400" : "text-gray-500"}`}
        >
          {saree.description || "Authentic traditional handloom work."}
        </p>

        <div
          className={`mt-auto pt-3 border-t ${isDark ? "border-slate-800/60" : "border-gray-50"}`}
        >
          {role === "customer" && (
            <button
              onClick={() => addFavourites(saree)}
              className={`w-full flex items-center justify-center gap-2 border px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                isDark
                  ? "border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-slate-950"
                  : "border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white"
              }`}
            >
              ❤️ Add to Favourites
            </button>
          )}
          {role === "admin" && (
            <div className="w-full flex gap-3">
              <button
                onClick={() => navigate(`/edit-saree/${sareeId}`)}
                className={`w-1/2 flex items-center justify-center border px-3 py-2 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? "border-amber-900/50 text-amber-400 hover:bg-amber-950/30"
                    : "border-amber-200 text-amber-700 hover:bg-amber-50"
                }`}
              >
                📝 Edit
              </button>
              <button
                onClick={() => deleteSaree(sareeId)}
                className={`w-1/2 flex items-center justify-center border px-3 py-2 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? "bg-red-950/40 hover:bg-red-900/30 text-red-400 border-red-900/40"
                    : "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                }`}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
          className={`flex flex-col items-center justify-center min-h-[30vh] font-serif ${isDark ? "text-slate-500" : "text-gray-500"}`}
        >
          <h2
            className={`text-2xl font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}
          >
            No Sarees Available At The Moment
          </h2>
          <p
            className={`text-sm mt-2 ${isDark ? "text-slate-500" : "text-gray-400"}`}
          >
            Please check back later or contact admin.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <h1
              className={`text-3xl font-bold font-serif uppercase tracking-wider ${isDark ? "text-rose-400" : "text-rose-900"}`}
            >
              Our Exclusive Collection
            </h1>
            <p
              className={`text-xs font-medium tracking-wide mt-1 ${isDark ? "text-slate-400" : "text-gray-400"}`}
            >
              Handwoven masterpieces curation crafted by generational heritage
              artisans
            </p>
            <div
              className={`h-0.5 w-16 mx-auto mt-3 ${isDark ? "bg-amber-600" : "bg-amber-500"}`}
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
              className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-400"}`}
            >
              <span>🎛️ Filter & Sort Catalog</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input
                type="text"
                placeholder="🔍 Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`}
              />
              <input
                type="text"
                placeholder="🎨 Search by Color"
                value={searchColor}
                onChange={(e) => setSearchColor(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`}
              />
              <input
                type="text"
                placeholder="🧵 Search by Fabric"
                value={searchFabric}
                onChange={(e) => setSearchFabric(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`}
              />
              <input
                type="number"
                placeholder="₹ Min Price"
                value={searchMinimumPrice}
                onChange={(e) => setSearchMinimumPrice(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`}
              />
              <input
                type="number"
                placeholder="₹ Max Price"
                value={searchMaximumPrice}
                onChange={(e) => setSearchMaximumPrice(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-2.5 text-xs border rounded-xl font-semibold cursor-pointer focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-gray-50 border-gray-200 text-gray-600"}`}
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
                className={`text-xs font-semibold underline cursor-pointer ${isDark ? "text-rose-400 hover:text-rose-300" : "text-rose-900 hover:text-rose-950"}`}
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
