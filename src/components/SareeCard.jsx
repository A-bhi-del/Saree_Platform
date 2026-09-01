import { useState } from "react";

/**
 * Reusable SareeCard Component
 *
 * @param {Object} saree - The saree data object
 * @param {boolean} isDark - Current theme mode (true for dark)
 * @param {string} role - Logged-in user role ("customer" | "admin")
 * @param {function} addFavourites - Handler function to add saree to wishlist
 * @param {function} navigate - React Router navigate function
 * @param {function} deleteSaree - Handler function to delete saree (admin only)
 */
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
    saree.adminId || saree.createdBy || saree.admin || saree.user
  );

  const discountPercentage = saree.discountPercentage || 0;
  const discountedPrice = Math.round(
    saree.price - (saree.price * discountPercentage) / 100
  );
  const hasDiscount = discountPercentage > 0;

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
      {/* Product Image Area & Badges */}
      <div
        className={`relative overflow-hidden aspect-[3/4] ${
          isDark ? "bg-slate-800" : "bg-gray-100"
        }`}
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

        {/* Badges Container */}
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
              {discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Fabric Tag Overlay */}
        <span
          className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md z-10 ${
            isDark ? "bg-slate-950/80 text-slate-200" : "bg-black/60 text-white"
          }`}
        >
          {saree.fabric}
        </span>

        {/* Multi-Image Carousel Controls */}
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

      {/* Card Content & Details */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Technical IDs Tag Box */}
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

        {/* Title and Pricing */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3
            className={`text-base font-bold font-serif line-clamp-1 flex-grow ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            {saree.name}
          </h3>
          <div className="flex flex-col text-right min-w-[80px]">
            {hasDiscount ? (
              <>
                <span
                  className={`text-[11px] line-through font-semibold ${
                    isDark ? "text-slate-500" : "text-gray-400"
                  }`}
                >
                  ₹{saree.price}
                </span>
                <span
                  className={`text-base font-extrabold leading-none ${
                    isDark ? "text-rose-400" : "text-rose-900"
                  }`}
                >
                  ₹{discountedPrice}
                </span>
              </>
            ) : (
              <span
                className={`text-base font-extrabold ${
                  isDark ? "text-rose-400" : "text-rose-900"
                }`}
              >
                ₹{saree.price}
              </span>
            )}
          </div>
        </div>

        <p
          className={`text-xs line-clamp-2 mb-5 leading-relaxed flex-grow ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          {saree.description || "Authentic traditional handloom work."}
        </p>

        {/* Role-Based Action Area */}
        <div
          className={`mt-auto pt-3 border-t ${
            isDark ? "border-slate-800/60" : "border-gray-50"
          }`}
        >
          {role === "customer" && addFavourites && (
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
              {navigate && (
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
              )}
              {deleteSaree && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SareeCard;