import React from "react";
import RatingStars from "./RatingStars";
import RatingDistribution from "./RatingDistribution";

/**
 * ProductRatingSummary component - Display overall rating and distribution
 * @param {Object} stats - Rating statistics object
 * @param {Function} onFilterRating - Callback when filtering by rating
 * @param {Function} onWriteReview - Callback when write review button is clicked
 */
const ProductRatingSummary = ({
  stats = {},
  onFilterRating,
  onWriteReview,
  isDark = false,
  userRole = null
}) => {
  const {
    averageRating = 0,
    totalReviews = 0,
    ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    verifiedReviewCount = 0
  } = stats;

  const hasReviews = totalReviews > 0;

  return (
    <div className={`p-6 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
        Customer Reviews
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Overall Rating */}
        <div className="flex flex-col items-center justify-center">
          {hasReviews ? (
            <>
              <div className={`text-5xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {averageRating.toFixed(1)}
              </div>
              <RatingStars rating={averageRating} size="lg" />
              <div className={`mt-3 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </div>
              {verifiedReviewCount > 0 && (
                <div className={`mt-1 text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  {verifiedReviewCount} verified purchase{verifiedReviewCount !== 1 ? "s" : ""}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className={`text-lg font-medium mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                No reviews yet
              </div>
              <div className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Be the first to review this product
              </div>
            </div>
          )}

          {onWriteReview && userRole === "customer" && (
            <button
              onClick={onWriteReview}
              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Right: Rating Distribution */}
        {hasReviews && (
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Rating Distribution
            </h3>
            <RatingDistribution
              distribution={ratingDistribution}
              totalReviews={totalReviews}
              onFilterRating={onFilterRating}
              isDark={isDark}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRatingSummary;
