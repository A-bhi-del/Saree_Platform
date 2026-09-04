import { useState } from "react";
import { useCart } from "../context/CartContext";
import { addToCart } from "../api/cartSystem";

function FavouriteCard({ favourite, isDark, removeFavourites }) {
//   const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  // Support both image array and single image fallbacks
  const imageList =
    favourite.images?.length > 0
      ? favourite.images.map((image) =>
          typeof image === "string" ? image : image.url,
        )
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

  const favouriteId = getSafeIdString(favourite._id || favourite.id);
  const discountPercentage = favourite.discountPercentage || 0;
  const discountedPrice = Math.round(
    favourite.price - (favourite.price * discountPercentage) / 100,
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

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      const sareeId = favourite._id || favourite.id;
      console.log(sareeId);
      await addToCart({ sareeId, quantity: 1 });
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add item to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md border flex flex-col group transition-all duration-300 ${
        isDark ? "bg-slate-900 border-slate-800/80" : "bg-white border-gray-100"
      }`}
    >
      {/* Product Image Container */}
      <div
        className={`relative overflow-hidden aspect-[3/4] ${
          isDark ? "bg-slate-800" : "bg-gray-100"
        }`}
      >
        <img
          src={imageList[activeImgIdx]}
          alt={favourite.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x500?text=Image+Load+Failed";
          }}
        />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 max-w-[70%]">
          {favourite.stock < 5 && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border w-fit ${
                isDark
                  ? "bg-red-950/90 text-red-400 border-red-900/40"
                  : "bg-red-50 text-red-600 border-red-100"
              }`}
            >
              Low Stock ({favourite.stock})
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
          {favourite.fabric}
        </span>

        {/* Multi-image Controls */}
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

      {/* Product Details Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Metadata Badge */}
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
              title={favouriteId}
            >
              {favouriteId}
            </span>
          </div>
        </div>

        {/* Title and Price */}
        <div className="flex justify-between items-start gap-3 mb-2">
          <h3
            className={`text-base font-bold font-serif line-clamp-1 flex-grow ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            {favourite.name}
          </h3>
          <div className="flex flex-col text-right min-w-[80px]">
            {hasDiscount ? (
              <>
                <span
                  className={`text-[11px] line-through font-semibold ${
                    isDark ? "text-slate-500" : "text-gray-400"
                  }`}
                >
                  ₹{favourite.price}
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
                ₹{favourite.price}
              </span>
            )}
          </div>
        </div>

        {/* Color Detail */}
        {favourite.color && (
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`text-xs ${
                isDark ? "text-slate-500" : "text-gray-400"
              }`}
            >
              Color:
            </span>
            <span
              className={`text-xs font-medium capitalize ${
                isDark ? "text-slate-300" : "text-gray-600"
              }`}
            >
              {favourite.color}
            </span>
          </div>
        )}

        <p
          className={`text-xs line-clamp-2 mb-5 leading-relaxed flex-grow ${
            isDark ? "text-slate-400" : "text-gray-500"
          }`}
        >
          {favourite.description || "Authentic traditional handloom work."}
        </p>

        {/* Action Buttons */}
        <div
          className={`mt-auto pt-3 border-t flex flex-col gap-2 ${
            isDark ? "border-slate-800/60" : "border-gray-50"
          }`}
        >
          {/* Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={adding || favourite.stock === 0}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all shadow-sm cursor-pointer ${
              cartSuccess
                ? "bg-emerald-600 text-white"
                : isDark
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
            } ${
              adding || favourite.stock === 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {adding ? (
              <>
                <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                Adding...
              </>
            ) : cartSuccess ? (
              "✓ Added to Cart"
            ) : favourite.stock === 0 ? (
              "Out of Stock"
            ) : (
              "🛒 Add to Cart"
            )}
          </button>

          {/* Remove From Wishlist Button */}
          <button
            onClick={() => removeFavourites(favourite._id || favourite.id)}
            className={`w-full flex items-center justify-center gap-2 border px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
              isDark
                ? "border-red-900/60 text-red-400 hover:bg-red-950/40"
                : "border-red-200 text-red-600 hover:bg-red-50"
            }`}
          >
            ✕ Remove Item
          </button>
        </div>
      </div>
    </div>
  );
}

export default FavouriteCard;
