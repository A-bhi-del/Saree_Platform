import React from "react";

/**
 * RatingDistribution component - Display rating breakdown by star count
 * @param {Object} distribution - Object with keys 1-5 and count values
 * @param {number} totalReviews - Total number of reviews
 * @param {Function} onFilterRating - Callback when a rating bar is clicked
 */
const RatingDistribution = ({
  distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  totalReviews = 0,
  onFilterRating,
  isDark = false
}) => {
  const ratings = [5, 4, 3, 2, 1]; // Display in descending order

  const getPercentage = (count) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="space-y-2">
      {ratings.map((rating) => {
        const count = distribution[rating] || 0;
        const percentage = getPercentage(count);

        return (
          <button
            key={rating}
            onClick={() => onFilterRating && onFilterRating(rating)}
            className={`
              flex items-center gap-3 w-full text-left
              ${onFilterRating ? "hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" : "cursor-default"}
              p-2 rounded transition-colors
            `}
            disabled={!onFilterRating}
          >
            <span className={`text-sm font-medium w-8 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              {rating} ★
            </span>
            <div className="flex-1 relative">
              <div className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <span className={`text-sm w-12 text-right ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {percentage}%
            </span>
            <span className={`text-sm w-12 text-right ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              ({count})
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RatingDistribution;
