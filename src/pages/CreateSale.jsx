import { useState } from "react";
import { useSale } from "../context/SaleContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function CreateSale({ isOpen, onClose }) {
  const { addSale } = useSale();
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [saleName, setSaleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState(""); 

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!saleName || !discount || startDate > endDate) {
      alert("Please check all fields. Start date cannot be after end date!");
      return;
    }

    addSale({
      id: Date.now(),
      saleName,
      startDate,
      endDate,
      discount: Number(discount),
      description,
      createdAt: new Date().toISOString(),
      active: true,
    });

    setSaleName("");
    setStartDate(""); 
    setEndDate("");
    setDiscount("");
    setDescription("");

    onClose(); 
    navigate("/sale-page");
  }

  // Dark/Light helper styles
  const isDark = theme === "dark";
  const bgMain = isDark ? "bg-slate-900" : "bg-white";
  const borderCol = isDark ? "border-slate-700" : "border-gray-200";
  const inputBg = isDark ? "bg-slate-800 text-slate-100" : "bg-gray-50 text-gray-900";
  const labelText = isDark ? "text-slate-400" : "text-gray-600";
  const textColor = isDark ? "text-slate-100" : "text-gray-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Modal Box */}
      <div className={`w-full max-w-lg rounded-2xl shadow-xl border overflow-hidden transform transition-all scale-100 ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
      }`}>
        
        {/* Modal Header */}
        <div className="bg-rose-900 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-serif text-white tracking-wide">
              🎉 Create New Sale Event
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">Launch a store-wide promotional discount</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl font-bold cursor-pointer transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Sale Name */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${labelText}`}>Sale Name *</label>
            <input
              type="text"
              placeholder="e.g., Festive Diwali Dhamaka"
              value={saleName}
              onChange={(e) => setSaleName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-medium ${inputBg} ${borderCol}`}
            />
          </div>

          {/* Discount Field */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${labelText}`}>Discount Percentage (%) *</label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="e.g., 20"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all font-medium ${inputBg} ${borderCol}`}
            />
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${labelText}`}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium ${inputBg} ${borderCol}`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${labelText}`}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium ${inputBg} ${borderCol}`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${labelText}`}>Sale Description</label>
            <textarea
              placeholder="Describe the campaign terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className={`w-full px-4 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all resize-none font-medium ${inputBg} ${borderCol}`}
            />
          </div>

          {/* Action Buttons Footer */}
          <div className={`flex justify-end gap-3 pt-3 border-t mt-6 ${isDark ? "border-slate-800" : "border-gray-100"}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-900 hover:bg-rose-950 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              📣 Add Sale Event
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateSale;