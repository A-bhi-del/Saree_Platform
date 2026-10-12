import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import { getReviews, updateReview, deleteReview, toggleHelpfulVote } from "../api/reviewApi";
import { useAuth } from "../context/AuthContext";

/**
 * ReviewList component - Display paginated, filterable list of reviews
 * @param {string} sareeId - The saree ID
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when filters change
 */
const ReviewList = ({ sareeId, filters = {}, onFilterChange, isDark = false }) => {
  const { user, userId } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReviews(sareeId, filters);
      setReviews(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sareeId, filters]);

  const handleUpdateReview = async (formData, data) => {
    try {
      await updateReview(editingReview._id, data);
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const handleHelpfulVote = async (reviewId) => {
    if (!user) {
      alert("Please log in to vote");
      return;
    }

    try {
      const voted = userVotes.has(reviewId);
      const response = await toggleHelpfulVote(reviewId, voted);
      
      // Update local vote state
      const newVotes = new Set(userVotes);
      if (response.data.data.voted) {
        newVotes.add(reviewId);
      } else {
        newVotes.delete(reviewId);
      }
      setUserVotes(newVotes);

      // Update review in list
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? { ...review, helpfulCount: response.data.data.helpfulCount }
            : review
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to vote");
    }
  };

  const handlePageChange = (newPage) => {
    onFilterChange({ ...filters, page: newPage });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Loading reviews...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchReviews}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        <p className="text-lg">No reviews found.</p>
        {Object.keys(filters).length > 1 && (
          <button
            onClick={() => onFilterChange({ page: 1, limit: 10 })}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Edit Form */}
      {editingReview && (
        <ReviewForm
          initialData={editingReview}
          onSubmit={handleUpdateReview}
          onCancel={() => setEditingReview(null)}
          isDark={isDark}
        />
      )}

      {/* Reviews */}
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          canEdit={userId === review.user?._id}
          onEdit={() => setEditingReview(review)}
          onDelete={() => handleDeleteReview(review._id)}
          onHelpfulVote={() => handleHelpfulVote(review._id)}
          userVoted={userVotes.has(review._id)}
          isAuthenticated={!!user}
          isDark={isDark}
        />
      ))}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${pagination.currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            Previous
          </button>

          <span className={`px-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${pagination.currentPage === pagination.totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
