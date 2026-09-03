import { useState } from "react";
import { Link } from "react-router-dom";
import { useRequest } from "../context/RequestContext";
import { useTheme } from "../context/ThemeContext";

function CustomerRequestCard({ request, isDark }) {
  const imageList =
    Array.isArray(request.images) && request.images.length > 0
      ? request.images.map((img) => (typeof img === "string" ? img : img.url))
      : request.image
      ? [request.image]
      : [];

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  return (
    <>
      <div
        className={`rounded-xl shadow-sm border p-5 flex flex-col sm:flex-row gap-5 items-start relative overflow-hidden hover:shadow-md transition-all ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}
      >
        {/* Left Column: Image Carousel / Gallery Box */}
        <div className="w-full sm:w-36 flex-shrink-0 flex flex-col gap-2">
          <div
            onClick={() => imageList.length > 0 && setShowPreviewModal(true)}
            className={`relative w-full h-44 sm:h-36 rounded-lg overflow-hidden border group cursor-pointer ${
              isDark
                ? "bg-slate-800 border-slate-700"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            {imageList.length > 0 ? (
              <>
                <img
                  src={imageList[activeImgIdx]}
                  alt={`${request.designName} thumbnail ${activeImgIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x500?text=Image+Load+Failed";
                  }}
                />

                {/* Multi-image indicators and arrows */}
                {imageList.length > 1 && (
                  <>
                    <span className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 backdrop-blur-xs">
                      📷 {activeImgIdx + 1}/{imageList.length}
                    </span>

                    <button
                      onClick={handlePrevImage}
                      className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-black/50 hover:bg-black/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    >
                      ❮
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-black/50 hover:bg-black/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    >
                      ❯
                    </button>
                  </>
                )}
              </>
            ) : (
              <div
                className={`w-full h-full flex flex-col items-center justify-center text-center p-2 text-[11px] ${
                  isDark
                    ? "bg-slate-800 text-slate-500"
                    : "bg-gray-50 text-gray-400"
                }`}
              >
                <span>No Image Uploaded</span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {imageList.length > 1 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {imageList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative w-9 h-9 rounded-md overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                    activeImgIdx === idx
                      ? isDark
                        ? "border-rose-400 opacity-100"
                        : "border-rose-900 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt="thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specification Details */}
        <div className="flex-grow space-y-2 w-full">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3
              className={`text-base font-bold font-serif ${
                isDark ? "text-slate-200" : "text-gray-800"
              }`}
            >
              {request.designName}
            </h3>

            {/* Status Pill */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                request.status === "pending"
                  ? isDark
                    ? "bg-amber-950/40 text-amber-400 border border-amber-900/50"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  : request.status === "accepted" || request.status === "approved"
                  ? isDark
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isDark
                  ? "bg-red-950/40 text-red-400 border border-red-900/50"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              • {request.status}
            </span>
          </div>

          {/* Sub-label attributes */}
          <div
            className={`text-xs flex flex-wrap gap-x-4 gap-y-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            <span>
              Type:{" "}
              <strong
                className={`capitalize ${
                  isDark ? "text-slate-200" : "text-gray-700"
                }`}
              >
                {request.requestType}
              </strong>
            </span>
            <span>
              Fabric:{" "}
              <strong
                className={`capitalize ${
                  isDark ? "text-slate-200" : "text-gray-700"
                }`}
              >
                {request.fabric}
              </strong>
            </span>
            <span>
              Color:{" "}
              <strong
                className={`capitalize ${
                  isDark ? "text-slate-200" : "text-gray-700"
                }`}
              >
                {request.color}
              </strong>
            </span>
          </div>

          <p
            className={`text-xs line-clamp-2 p-2 rounded italic ${
              isDark ? "bg-slate-800 text-slate-300" : "bg-gray-50 text-gray-600"
            }`}
          >
            "{request.description || "No description provided."}"
          </p>

          {/* Summary Row */}
          <div
            className={`pt-2 border-t flex justify-between items-center text-xs flex-wrap gap-2 ${
              isDark
                ? "border-slate-800 text-slate-400"
                : "border-gray-100 text-gray-500"
            }`}
          >
            <div>
              Qty:{" "}
              <span
                className={`font-bold ${
                  isDark ? "text-slate-200" : "text-gray-800"
                }`}
              >
                {request.quantity} Pcs
              </span>
            </div>
            <div>
              Budget:{" "}
              <span
                className={`font-bold ${
                  isDark ? "text-rose-400" : "text-rose-900"
                }`}
              >
                ₹{request.budget}
              </span>
            </div>
            <div className="text-[11px]">
              Needed By:{" "}
              <span
                className={`font-medium ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                {request.requiredByDate
                  ? new Date(request.requiredByDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Image Lightbox Modal */}
      {showPreviewModal && (
        <div
          onClick={() => setShowPreviewModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-lg w-full rounded-2xl p-4 border shadow-2xl ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-100"
                : "bg-white border-gray-100 text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-800 mb-3">
              <h4 className="font-serif font-bold text-sm">
                Reference Image ({activeImgIdx + 1}/{imageList.length})
              </h4>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-400 p-1.5 rounded-full font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-950">
              <img
                src={imageList[activeImgIdx]}
                alt="Full Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CustomerDashboard() {
  const { requests } = useRequest();
  const { theme } = useTheme();

  const totalRequests = requests.length;

  const totalacceptedRequests = requests.filter(
    (request) => request.status === "accepted" || request.status === "approved"
  ).length;

  const totalRejectedRequests = requests.filter(
    (request) => request.status === "rejected"
  ).length;

  const totalPendingRequests = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Title Header with Active Sales CTA */}
      <div
        className={`mb-10 border-b pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? "border-slate-800" : "border-gray-200"
        }`}
      >
        <div>
          <h1
            className={`text-2xl font-bold font-serif uppercase tracking-wide ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            My Account Dashboard
          </h1>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Track your custom weave orders, style updates, and restock tickets.
          </p>
        </div>

        <Link
          to="/all-active-sales"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white self-start md:self-auto"
        >
          <span>🔥 View All Active Sales</span>
          <span className="text-sm">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {/* Total Card */}
        <div
          className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-100"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          >
            Total Made
          </span>
          <span
            className={`text-3xl font-extrabold mt-2 ${
              isDark ? "text-slate-100" : "text-gray-800"
            }`}
          >
            {totalRequests}
          </span>
        </div>

        {/* Pending Card */}
        <div
          className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between border-l-4 border-l-amber-500 transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800/80"
              : "bg-white border-amber-100"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-amber-500" : "text-amber-600"
            }`}
          >
            In Review
          </span>
          <span
            className={`text-3xl font-extrabold mt-2 ${
              isDark ? "text-amber-400" : "text-amber-700"
            }`}
          >
            {totalPendingRequests}
          </span>
        </div>

        {/* Accepted Card */}
        <div
          className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between border-l-4 border-l-emerald-500 transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800/80"
              : "bg-white border-emerald-100"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-emerald-500" : "text-emerald-600"
            }`}
          >
            Accepted
          </span>
          <span
            className={`text-3xl font-extrabold mt-2 ${
              isDark ? "text-emerald-400" : "text-emerald-700"
            }`}
          >
            {totalacceptedRequests}
          </span>
        </div>

        {/* Rejected Card */}
        <div
          className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between border-l-4 border-l-red-500 transition-colors ${
            isDark
              ? "bg-slate-900 border-slate-800/80"
              : "bg-white border-red-100"
          }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            Declined
          </span>
          <span
            className={`text-3xl font-extrabold mt-2 ${
              isDark ? "text-red-400" : "text-red-700"
            }`}
          >
            {totalRejectedRequests}
          </span>
        </div>
      </div>

      {/* History Items Listing */}
      <div>
        <h2
          className={`text-lg font-bold font-serif uppercase tracking-wider mb-6 ${
            isDark ? "text-slate-100" : "text-gray-800"
          }`}
        >
          Request History Tracking
        </h2>

        {requests.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center p-12 rounded-2xl border text-center font-serif transition-colors duration-300 ${
              isDark
                ? "bg-slate-900 border-slate-800 text-slate-400"
                : "bg-white border-gray-100 text-gray-500"
            }`}
          >
            <div className="text-4xl mb-3">🛍️</div>
            <h2
              className={`text-xl font-semibold ${
                isDark ? "text-slate-200" : "text-gray-700"
              }`}
            >
              No Requests Found
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-slate-500" : "text-gray-400"
              }`}
            >
              You haven't submitted any custom design or restock requests yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <CustomerRequestCard
                key={request._id}
                request={request}
                isDark={isDark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerDashboard;