import React, { useState } from "react";
import RatingStars from "./RatingStars";

/**
 * ReviewCard component - Display a single review
 * @param {Object} review - Review data
 * @param {boolean} canEdit - Whether current user can edit this review
 * @param {Function} onEdit - Callback for edit action
 * @param {Function} onDelete - Callback for delete action
 * @param {Function} onHelpfulVote - Callback for helpful vote
 * @param {boolean} userVoted - Whether current user has voted
 * @param {boolean} isAuthenticated - Whether user is logged in
 */
const ReviewCard = ({
  review,
  canEdit = false,
  onEdit,
  onDelete,
  onHelpfulVote,
  userVoted = false,
  isAuthenticated = false,
  isDark = false
}) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    user,
    rating,
    title,
    comment,
    images = [],
    isVerifiedPurchase,
    helpfulCount = 0,
    createdAt
  } = review;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const isLongComment = comment.length > 300;
  const displayComment = showFullComment || !isLongComment
    ? comment
    : comment.substring(0, 300) + "...";

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  return (
    <>
      <div className={`p-6 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {user?.profileImage?.url ? (
              <img
                src={user.profileImage.url}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
              }`}>
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  {user?.name || "Anonymous"}
                </span>
                {isVerifiedPurchase && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                    ✓ Verified Purchase
                  </span>
                )}
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {formattedDate}
              </div>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={rating} size="sm" />
        </div>

        {/* Title */}
        {title && (
          <h4 className={`font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            {title}
          </h4>
        )}

        {/* Comment */}
        <p className={`mb-4 whitespace-pre-wrap ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          {displayComment}
        </p>
        {isLongComment && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            {showFullComment ? "Show less" : "Read more"}
          </button>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity"
              >
                <img
                  src={image.url}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Helpful Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onHelpfulVote}
            disabled={!isAuthenticated || canEdit}
            className={`
              flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-1.5 transition-colors
              ${userVoted
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : isDark
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
              }
              ${(!isAuthenticated || canEdit) && "opacity-50 cursor-not-allowed"}
            `}
          >
            <svg
              className="w-4 h-4"
              fill={userVoted ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            Helpful {helpfulCount > 0 && `(${helpfulCount})`}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={images[selectedImageIndex]?.url}
              alt={`Review image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full ${
                      index === selectedImageIndex ? "bg-white" : "bg-gray-500"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;
