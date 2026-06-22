import { useState } from "react";
import { useRequest } from "../context/RequestContext";

function RequestSaree() {
  const { addRequest } = useRequest();

  const [requestType, setRequestType] = useState("");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [designName, setDesignName] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [image, setImage] = useState("");
  
  // Custom Alert message standard state
  const [successMsg, setSuccessMsg] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !requestType ||
      !designName ||
      !fabric ||
      !quantity ||
      !color ||
      !budget ||
      !requiredByDate
    ) {
      alert("Please fill all required fields");
      return;
    }

    addRequest({
      id: Date.now(),
      requestType,
      designName,
      fabric,
      color,
      description,
      quantity: Number(quantity),
      budget: Number(budget),
      image,
      requiredByDate,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    setRequestType("");
    setRequiredByDate("");
    setQuantity("");
    setDesignName("");
    setFabric("");
    setColor("");
    setDescription("");
    setBudget("");
    setImage("");
    
    // Trigger Success notification
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 5000);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-serif text-rose-900 uppercase tracking-wide">
            Request a Saree
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Share your dream design or restock preference, and our artisans will craft it for you.
          </p>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Dynamic Success Alert Banner */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg text-center font-medium animate-fade-in">
            ✓ Your design request has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Main Form Fields Layout (Grid for 2 columns on big screens) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Request Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Request Type *</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all cursor-pointer"
              >
                <option value="">Select Request Type</option>
                <option value="custom">Custom Design</option>
                <option value="restock">Restock Request</option>
              </select>
            </div>

            {/* Design Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Design / Pattern Name *</label>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="e.g., Banarasi Floral Katan"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Required By Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Required By Date *</label>
              <input
                type="date"
                value={requiredByDate}
                onChange={(e) => setRequiredByDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all cursor-pointer"
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity Needed *</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Minimum 1"
                min="1"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Fabric */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Fabric Material *</label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g., Pure Georgette, Silk, Organza"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Color / Shade *</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Crimson Red with Gold Border"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Maximum Budget (₹) *</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter maximum target budget"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

            {/* Reference Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Paste an online image address (optional)"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all"
              />
            </div>

          </div>

          {/* Description - Takes full width row */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Specific Design Requirements / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about the border work, zari details, embroidery pattern, or heavy/light work preferences..."
              rows="4"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all resize-none"
            />
          </div>

          {/* Submit Action Area */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-rose-900 hover:bg-rose-950 text-white font-semibold text-sm uppercase tracking-widest py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Submit Request
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default RequestSaree;