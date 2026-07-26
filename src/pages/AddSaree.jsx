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
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageInput, setImageInput] = useState("");
  const [images, setImages] = useState([]);

  const navigate = useNavigate();

  const handleAddImage = () => {
    const trimmed = imageInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      alert("This image URL is already added!");
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setImageInput("");
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !fabric || !price || !stock || !color || !category) {
      alert("Please fill all required fields (*)");
      return;
    }

    let finalImages = [...images];
    if (imageInput.trim() && !finalImages.includes(imageInput.trim())) {
      finalImages.push(imageInput.trim());
    }

    const payload = {
      name: name.trim(),
      fabric: fabric.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      color: color.trim(),
      discountPercentage: 0,
      isAvailable,
      images: finalImages, 
    };

    if (description.trim()) {
      payload.description = description.trim();
    }

    addSaree(payload);

    setName("");
    setFabric("");
    setCategory("");
    setPrice("");
    setStock("");
    setColor("");
    setDescription("");
    setImageInput("");
    setImages([]);
    setIsAvailable(true);

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
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
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

            {/* Category Field */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                Category *
              </label>
              <input
                value={category}
                type="text"
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Bridal, Traditional, Partyware, Casual"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* Fabric Type */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
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

            {/* Color Scheme */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
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

            {/* Price Input */}
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                Retail Price (₹) *
              </label>
              <input
                value={price}
                type="number"
                min="0"
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
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                Stock Available *
              </label>
              <input
                value={stock}
                type="number"
                min="0"
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g., 15"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                }`}
              />
            </div>

            {/* 📸 Multiple Images Input Field & List */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                Saree Images (Multiple URLs)
              </label>
              
              <div className="flex gap-2">
                <input
                  value={imageInput}
                  type="text"
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImage();
                    }
                  }}
                  placeholder="Paste image URL (e.g., https://...) and click Add"
                  className={`flex-grow px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    theme === "dark"
                      ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400 focus:border-rose-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800 focus:border-rose-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {/* Added Images Thumbnails Preview */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((imgUrl, index) => (
                    <div key={index} className="relative group w-20 h-24 rounded-lg overflow-hidden border border-slate-700">
                      <img src={imgUrl} alt={`Saree Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow cursor-pointer"
                        title="Remove image"
                      >
                        ✕
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Saree Description */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
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

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 rounded accent-rose-700 cursor-pointer"
            />
            <label htmlFor="isAvailable" className={`text-xs font-semibold uppercase tracking-wider cursor-pointer ${theme === "dark" ? "text-slate-300" : "text-gray-700"}`}>
              Mark product as Available for Sale
            </label>
          </div>

          {/* Action Button */}
          <div className="pt-2">
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