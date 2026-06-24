import { useState } from "react";
import { useSaree } from "../context/SareeContext";
import { useNavigate, useParams } from "react-router-dom";

function EditSaree() {
  const { id } = useParams();
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

  // Guard Clause: If saree details aren't loaded from context yet, show a clean loader instead of crashing
  if (!saree) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500 font-serif">
        <h2 className="text-xl font-semibold animate-pulse">Loading Saree Details...</h2>
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
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-rose-900 uppercase tracking-wide">
            Edit existing saree
          </h2>
          <p className="text-sm text-gray-500 mt-2">
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
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Saree/Design Name *</label>
              <input
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Kanjeevaram Silk Pure Zari"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Fabric Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fabric Material *</label>
              <input
                value={fabric}
                type="text"
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g., Organza, Chanderi, Georgette"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Price Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Retail Price (₹) *</label>
              <input
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 4999"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Stock Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock Available *</label>
              <input
                value={stock}
                type="number"
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g., 15"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Color Scheme */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Color Shade *</label>
              <input
                value={color}
                type="text"
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Mustard Yellow / Rani Pink"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Product Image Link */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Saree Image URL</label>
              <input
                value={image}
                type="text"
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste an online image link address"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Discount Percentage */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Discount Percentage (%)</label>
              <input
                value={discountPercentage}
                type="number"
                min="0"
                max="100"
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="Enter discount percentage"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>
          </div>

          {/* Saree Description - Full Row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the intricate details, pallu work, zari thread composition, border width or styling tips..."
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-rose-900 hover:bg-rose-950 text-white font-semibold text-sm uppercase tracking-widest py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
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