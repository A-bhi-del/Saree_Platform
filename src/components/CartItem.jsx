import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Normalize data: Backend response nests the saree object inside item.sareeId
  const saree = item.sareeId || item.saree || {};
  const quantity = item.quantity || 1;

  // Extract Saree ID string safely
  const sareeId = typeof saree === "object" ? saree._id : saree;

  const [updating, setUpdating] = useState(false);

  // Safely extract main image URL from Cloudinary images array
  const mainImage =
    Array.isArray(saree.images) && saree.images.length > 0
      ? typeof saree.images[0] === "string"
        ? saree.images[0]
        : saree.images[0]?.url
      : saree.image || "https://placehold.co/200x250?text=Saree";

  // Calculate pricing with optional discounts
  const discountPercentage = saree.discountPercentage || 0;
  const unitPrice = saree.price || 0;
  const discountedUnitPrice =
    discountPercentage > 0
      ? Math.round(unitPrice - (unitPrice * discountPercentage) / 100)
      : unitPrice;

  const itemTotal = discountedUnitPrice * quantity;

  const handleQuantityChange = async (newQty) => {
    if (newQty < 1 || updating) return;
    setUpdating(true);
    await onUpdateQuantity(sareeId, newQty);
    setUpdating(false);
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between transition-all duration-300 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-gray-100 text-gray-800"
      }`}
    >
      {/* Saree Thumbnail & Specifications */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/30 bg-slate-800">
          <img
            src={mainImage}
            alt={saree.name || "Saree Design"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/200x250?text=No+Image";
            }}
          />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-base line-clamp-1">
            {saree.name || "Artisan Saree Variant"}
          </h3>

          {saree.fabric && (
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Fabric: <span className="capitalize">{saree.fabric}</span>
            </p>
          )}

          {saree.color && (
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Color: <span className="capitalize">{saree.color}</span>
            </p>
          )}

          {/* Unit Price */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
              ₹{discountedUnitPrice.toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span
                className={`text-xs line-through ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              >
                ₹{unitPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Selector & Item Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
        {/* Quantity Controller */}
        <div
          className={`flex items-center border rounded-lg overflow-hidden ${
            isDark
              ? "bg-slate-800 border-slate-700 text-slate-200"
              : "bg-gray-50 border-gray-200 text-gray-800"
          }`}
        >
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || updating}
            className="px-3 py-1.5 hover:bg-rose-500/10 text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <span className="px-3 py-1 text-xs font-bold font-mono">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={updating || (saree.stock && quantity >= saree.stock)}
            className="px-3 py-1.5 hover:bg-rose-500/10 text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>

        {/* Calculated Total Price & Delete Action */}
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm w-20 text-right">
            ₹{itemTotal.toLocaleString()}
          </span>

          <button
            type="button"
            onClick={() => onRemove(sareeId)}
            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg font-bold transition-colors cursor-pointer"
            title="Remove from Cart"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;