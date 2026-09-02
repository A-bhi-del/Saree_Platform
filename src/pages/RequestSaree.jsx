import { useState } from "react";
import { useRequest } from "../context/RequestContext";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function RequestSaree() {
  const { createRequest } = useRequest();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [adminId, setAdminId] = useState("");
  const [sareeId, setSareeId] = useState("");
  const [requestType, setRequestType] = useState("");
  const [requiredByDate, setRequiredByDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [designName, setDesignName] = useState("");
  const [fabric, setFabric] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  // Local File Upload States (Max Limit: 3 Images)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const isDark = theme === "dark";

  // Handle local image file selection with a strict 3-image limit
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 3) {
      setErrorMsg("Maximum limit is 3 reference images per request.");
      return;
    }

    setErrorMsg("");
    const fileObjects = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...fileObjects]);
  };

  // Remove a selected image file and revoke object URL
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].previewUrl);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (
      !adminId ||
      !sareeId ||
      !requestType ||
      !designName ||
      !fabric ||
      !quantity ||
      !color ||
      !budget
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (selectedFiles.length === 0) {
      setErrorMsg("At least one reference image is required.");
      return;
    }

    try {
      setLoading(true);

      // Create FormData instance for Multer (req.body + req.files)
      const formData = new FormData();
      formData.append("admin", adminId.trim());
      formData.append("saree", sareeId.trim());
      formData.append("requestType", requestType);
      formData.append("designName", designName.trim());
      formData.append("fabric", fabric.trim());
      formData.append("color", color.trim());
      formData.append("quantity", String(quantity));
      formData.append("budget", String(budget));

      if (description.trim()) {
        formData.append("description", description.trim());
      }
      if (requiredByDate) {
        formData.append("requiredByDate", requiredByDate);
      }

      // Append raw files under "images" field for req.files array
      selectedFiles.forEach((fileObj) => {
        formData.append("images", fileObj.file);
      });

      // Submit via Request Context
      await createRequest(formData);

      // Revoke preview memory URLs
      selectedFiles.forEach((fileObj) => URL.revokeObjectURL(fileObj.previewUrl));

      setAdminId("");
      setSareeId("");
      setRequestType("");
      setRequiredByDate("");
      setQuantity("");
      setDesignName("");
      setFabric("");
      setColor("");
      setDescription("");
      setBudget("");
      setSelectedFiles([]);

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 1000);
      navigate("/customer");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto rounded-2xl shadow-sm border p-6 md:p-10 transition-colors duration-300 ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}
      >
        <div className="text-center mb-8">
          <h2
            className={`text-3xl font-bold font-serif uppercase tracking-wide ${
              isDark ? "text-rose-400" : "text-rose-900"
            }`}
          >
            Request a Saree
          </h2>
          <p
            className={`text-sm mt-2 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Share your dream design or restock preference, and our artisans will
            craft it for you.
          </p>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div
            className={`mb-6 p-4 border text-sm rounded-lg font-medium text-center ${
              isDark
                ? "bg-red-950/40 border-red-900/40 text-red-400"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            className={`mb-6 p-4 border text-sm rounded-lg text-center font-medium animate-fade-in ${
              isDark
                ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-400"
                : "bg-emerald-50 border border-emerald-200 text-emerald-800"
            }`}
          >
            ✓ Your design request has been submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Admin ID */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Admin ID *
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="24-character ObjectId"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Saree ID */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Saree Reference ID *
              </label>
              <input
                type="text"
                value={sareeId}
                onChange={(e) => setSareeId(e.target.value)}
                placeholder="24-character ObjectId"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Request Type */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Request Type *
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-200 focus:border-rose-500"
                    : "bg-gray-50 border-gray-200 text-gray-700 focus:border-rose-800"
                }`}
              >
                <option value="">Select Request Type</option>
                <option value="custom">Custom Design</option>
                <option value="bulk">Bulk Order</option>
                <option value="normal">Normal Request</option>
              </select>
            </div>

            {/* Design Name */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Design / Pattern Name *
              </label>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="e.g., Banarasi Floral Katan"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Required By Date */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Required By Date
              </label>
              <input
                type="date"
                value={requiredByDate}
                onChange={(e) => setRequiredByDate(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100 scheme-dark"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Quantity Needed *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Minimum 1"
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Fabric */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Fabric Material *
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                placeholder="e.g., Pure Georgette, Silk, Organza"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Color */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Color / Shade *
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Crimson Red with Gold Border"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Budget */}
            <div className="flex flex-col gap-1.5">
              <label
                className={`text-xs font-semibold uppercase tracking-wider ${
                  isDark ? "text-slate-400" : "text-gray-600"
                }`}
              >
                Maximum Budget (₹) *
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Enter maximum target budget"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                  isDark
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-gray-50 border-gray-200 text-gray-900"
                }`}
              />
            </div>

            {/* Reference Image Upload Area (Max 3) */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <div className="flex justify-between items-center">
                <label
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Reference Images * (Max 3)
                </label>
                <span className="text-xs text-amber-500 font-semibold">
                  {selectedFiles.length} / 3 Selected
                </span>
              </div>

              {/* Drag & Drop File Box */}
              <label
                className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  selectedFiles.length >= 3
                    ? "opacity-50 cursor-not-allowed"
                    : isDark
                    ? "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-2 pb-3">
                  <span className="text-2xl mb-1">📸</span>
                  <p className="text-xs font-semibold">
                    Click to browse or drop reference images here
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
                  disabled={selectedFiles.length >= 3 || loading}
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
                        disabled={loading}
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
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Description / Notes
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide extra information or customization instructions..."
              className={`w-full px-4 py-2.5 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all ${
                isDark
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${
              isDark
                ? "bg-rose-800 hover:bg-rose-700 text-white"
                : "bg-rose-900 hover:bg-rose-950 text-white"
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Submitting Request...
              </>
            ) : (
              "Submit Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestSaree;