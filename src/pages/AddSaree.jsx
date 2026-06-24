import { useState } from "react";
import { useSaree } from "../context/SareeContext";
import { useNavigate } from "react-router-dom";

function AddSaree() {
  const { addSaree } = useSaree();
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
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-rose-900 uppercase tracking-wide">
            Add New Saree Variant
          </h2>
          <p className="text-sm text-gray-500 mt-2">
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
              Publish Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddSaree;