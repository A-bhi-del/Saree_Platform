import { useState } from "react";
import { useSaree } from "../context/SareeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function EditSaree() {
  const { id } = useParams();
  const { theme } = useTheme();
  const { sarees, updateSaree } = useSaree();

  const saree = sarees.find((item) => item.id === Number(id));

  // Safe Initialization using Optional Chaining (?.) to prevent app crashes
  const [name, setName] = useState(saree?.name || "");
  const [fabric, setFabric] = useState(saree?.fabric || "");
  const [price, setPrice] = useState(saree?.price || "");
  const [stock, setStock] = useState(saree?.stock || "");
  const [color, setColor] = useState(saree?.color || "");
  const [description, setDescription] = useState(saree?.description || "");
  const [image, setImage] = useState(saree?.image || "");
  const [discountPercentage, setDiscountPercentage] = useState(saree?.discountPercentage || 0);
  
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // Guard Clause: If saree details aren't loaded from context yet, show a clean loader instead of crashing
  if (!saree) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen font-serif transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
      }`}>
        <h2 className={`text-xl font-semibold animate-pulse ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          Loading Saree Details...
        </h2>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !fabric || !price || !stock || !color) {
      alert("Please fill all required fields");
      return;
    }

    updateSaree({
      id: saree.id,
      name,
      fabric,
      price: Number(price),
      stock: Number(stock),
      color,
      description,
      image,
      discountPercentage: Number(discountPercentage),
    });

    navigate("/sarees");
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      <div className={`max-w-3xl mx-auto rounded-2xl shadow-sm border p-6 md:p-10 transition-colors ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
      }`}>
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold font-serif uppercase tracking-wide ${
            isDark ? "text-rose-400" : "text-rose-900"
          }`}>
            Edit existing saree
          </h2>
          <p className={`text-sm mt-2 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Update the specifications, pricing, or stock details of this artisan piece below.
          </p>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Product Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Form Fields Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Saree Name */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Saree/Design Name *
              </label>
              <input
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kanjeevaram Silk Pure Zari"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Fabric Type */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Fabric Material *
              </label>
              <input
                value={fabric}
                type="text"
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g., Organza, Chanderi, Georgette"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Retail Price (₹) *
              </label>
              <input
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 4999"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Stock Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Stock Available *
              </label>
              <input
                value={stock}
                type="number"
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g., 15"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Color Scheme */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Color Shade *
              </label>
              <input
                value={color}
                type="text"
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Mustard Yellow / Rani Pink"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Product Image Link */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Saree Image URL
              </label>
              <input
                value={image}
                type="text"
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste an online image link address"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Discount Percentage */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Discount Percentage (%)
              </label>
              <input
                value={discountPercentage}
                type="number"
                min="0"
                max="100"
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="Enter discount percentage"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>
          </div>

          {/* Saree Description - Full Row */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-600"}`}>
              Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the intricate details, pallu work, zari thread composition, border width or styling tips..."
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all resize-none ${
                isDark ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className={`w-full font-semibold text-sm uppercase tracking-widest py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-white ${
                isDark ? "bg-rose-950 hover:bg-rose-900" : "bg-rose-900 hover:bg-rose-950"
              }`}
            >
              Update & Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditSaree;