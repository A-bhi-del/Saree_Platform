import { useState } from "react";
import { useSaree } from "../context/SareeContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function AddSaree() {
  const { addSaree } = useSaree();
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [fabric, setFabric] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !fabric || !price || !stock || !color) {
      alert("Please fill all required fields");
      return;
    }

    addSaree({
      id: Date.now(),
      name,
      fabric,
      price: Number(price),
      stock: Number(stock),
      color,
      description,
      image,
      discountPercentage: 0,
    });
    
    setName("");
    setFabric("");
    setPrice("");
    setStock("");
    setColor("");
    setDescription("");
    setImage("");

    navigate("/sarees");
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto rounded-2xl shadow-sm border p-6 md:p-10 transition-all ${
          theme === "dark"
            ? "bg-slate-900 border-slate-800 text-slate-100"
            : "bg-white border-gray-100 text-gray-700"
        }`}
      >
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2
            className={`text-3xl font-bold font-serif uppercase tracking-wide transition-colors ${
              theme === "dark" ? "text-rose-400" : "text-rose-900"
            }`}
          >
            Add New Saree Variant
          </h2>
          <p className={`text-sm mt-2 ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
            Launch a new product into the catalog. Fill in the artisan specifications below.
          </p>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Product Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Form Fields Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Saree Name */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>
                Saree/Design Name *
              </label>
              <input
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kanjeevaram Silk Pure Zari"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* Fabric Type */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>
                Fabric Material *
              </label>
              <input
                value={fabric}
                type="text"
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g., Organza, Chanderi, Georgette"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>
                Retail Price (₹) *
              </label>
              <input
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 4999"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* Stock Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>
                Stock Available *
              </label>
              <input
                value={stock}
                type="number"
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g., 15"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* Color Scheme */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>
                Color Shade *
              </label>
              <input
                value={color}
                type="text"
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Mustard Yellow / Rani Pink"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* Product Image Link */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}>
                Saree Image URL
              </label>
              <input
                value={image}
                type="text"
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste an online image link address"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

          </div>

          {/* Saree Description - Full Row */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${
              theme === "dark" ? "text-slate-400" : "text-gray-600"
            }`}>
              Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the intricate details, pallu work, zari thread composition, border width or styling tips..."
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-none ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
              }`}
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className={`w-full font-semibold text-sm uppercase tracking-widest py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                theme === "dark"
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
              }`}
            >
              Publish Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddSaree;