import { useState } from "react";
import { useSaree } from "../context/SareeContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function AddSaree() {
  const { addSaree } = useSaree(); // Ensure addSaree in context sends a FormData request
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [fabric, setFabric] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  // Local file selection state (Max 6)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Handle local file selection with 6-image limit
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 6) {
      alert("Maximum limit is 6 images per saree variant.");
      return;
    }

    const fileObjects = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...fileObjects]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].previewUrl);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name || !fabric || !price || !stock || !color || !category) {
      alert("Please fill all required fields (*)");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please upload at least one image of the saree.");
      return;
    }

    try {
      setUploading(true);

      // Create a FormData instance to send text fields + raw files
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("fabric", fabric.trim());
      formData.append("category", category.trim());
      formData.append("price", Number(price));
      formData.append("stock", Number(stock));
      formData.append("color", color.trim());
      formData.append("isAvailable", isAvailable);

      if (description.trim()) {
        formData.append("description", description.trim());
      }

      // Append all selected files under key "images" (matches multer field)
      selectedFiles.forEach((fileObj) => {
        formData.append("images", fileObj.file);
      });

      // Pass the formData object to your context / API function
      await addSaree(formData);

      // Clean up object memory URLs
      selectedFiles.forEach((fileObj) => URL.revokeObjectURL(fileObj.previewUrl));

      setName("");
      setFabric("");
      setCategory("");
      setPrice("");
      setStock("");
      setColor("");
      setDescription("");
      setSelectedFiles([]);
      setIsAvailable(true);

      navigate("/sarees");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create saree. Please try again.");
    } finally {
      setUploading(false);
    }
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
          <p
            className={`text-sm mt-2 ${
              theme === "dark" ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Launch a new product into the catalog. Select artisan imagery to upload.
          </p>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Form Submission */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Saree Name */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Saree/Design Name *
              </label>
              <input
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kanjeevaram Silk Pure Zari"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
                }`}
              />
            </div>

            {/* Category Field */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Category *
              </label>
              <input
                value={category}
                type="text"
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Bridal, Traditional, Partywear"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
                }`}
              />
            </div>

            {/* Fabric Type */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Fabric Material *
              </label>
              <input
                value={fabric}
                type="text"
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g., Organza, Chanderi, Georgette"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
                }`}
              />
            </div>

            {/* Color Scheme */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Color Shade *
              </label>
              <input
                value={color}
                type="text"
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Mustard Yellow / Rani Pink"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
                }`}
              />
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
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
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
                }`}
              />
            </div>

            {/* Stock Quantity */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  theme === "dark" ? "text-slate-400" : "text-gray-600"
                }`}
              >
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
                    ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
                }`}
              />
            </div>

            {/* Local Image Selection Box */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    theme === "dark" ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Upload Saree Images * (Max 6)
                </label>
                <span className="text-xs text-amber-500 font-semibold">
                  {selectedFiles.length} / 6 Selected
                </span>
              </div>

              <label
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  selectedFiles.length >= 6
                    ? "opacity-50 cursor-not-allowed"
                    : theme === "dark"
                    ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <span className="text-2xl mb-1">📸</span>
                  <p className="text-xs font-semibold">
                    Click to browse or drop images here
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    PNG, JPG, WEBP up to 10MB each
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={selectedFiles.length >= 6 || uploading}
                  className="hidden"
                />
              </label>

              {/* Thumbnails Preview */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {selectedFiles.map((fileObj, index) => (
                    <div
                      key={index}
                      className="relative group w-20 h-24 rounded-lg overflow-hidden border border-slate-700 shadow-sm"
                    >
                      <img
                        src={fileObj.previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        disabled={uploading}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow cursor-pointer disabled:opacity-50"
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

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              className={`text-xs font-semibold uppercase tracking-wider ${
                theme === "dark" ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Product Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe intricate details, pallu work, zari thread composition, etc."
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all resize-none ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-slate-100 focus:ring-rose-400"
                  : "bg-gray-50 border-gray-200 text-gray-900 focus:ring-rose-800"
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
            <label
              htmlFor="isAvailable"
              className={`text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                theme === "dark" ? "text-slate-300" : "text-gray-700"
              }`}
            >
              Mark product as Available for Sale
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full font-semibold text-sm uppercase tracking-widest py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                theme === "dark"
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
              }`}
            >
              {uploading ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Creating Saree...
                </>
              ) : (
                "Publish Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSaree;