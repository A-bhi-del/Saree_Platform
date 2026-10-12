import React from "react";

/**
 * ReviewSortAndFilter component - Controls for sorting and filtering reviews
 * @param {Object} filters - Current filter values
 * @param {Function} onChange - Callback when filters change
 */
const ReviewSortAndFilter = ({ filters = {}, onChange, isDark = false }) => {
  const { sort = "newest", rating, verifiedPurchase, withImages } = filters;

  const handleSortChange = (e) => {
    onChange({ ...filters, sort: e.target.value, page: 1 });
  };

  const handleRatingFilter = (e) => {
    const value = e.target.value;
    onChange({
      ...filters,
      rating: value ? parseInt(value) : undefined,
      page: 1
    });
  };

  const handleVerifiedFilter = (e) => {
    const value = e.target.checked;
    onChange({
      ...filters,
      verifiedPurchase: value || undefined,
      page: 1
    });
  };

  const handleImagesFilter = (e) => {
    const value = e.target.checked;
    onChange({
      ...filters,
      withImages: value || undefined,
      page: 1
    });
  };

  const handleClearFilters = () => {
    onChange({ page: 1, limit: filters.limit || 10, sort: "newest" });
  };

  const hasActiveFilters = rating || verifiedPurchase || withImages;

  return (
    <div className={`p-4 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-reviews" className={`text-sm font-medium whitespace-nowrap ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Sort by:
          </label>
          <select
            id="sort-reviews"
            value={sort}
            onChange={handleSortChange}
            className={`
              px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          >
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="filter-rating" className={`text-sm font-medium whitespace-nowrap ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Rating:
          </label>
          <select
            id="filter-rating"
            value={rating || ""}
            onChange={handleRatingFilter}
            className={`
              px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
              ${isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}
            `}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedPurchase || false}
              onChange={handleVerifiedFilter}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Verified Purchases
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={withImages || false}
              onChange={handleImagesFilter}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              With Images
            </span>
          </label>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewSortAndFilter;
