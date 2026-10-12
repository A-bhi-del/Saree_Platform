import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import { getUserReviews, updateReview, deleteReview } from "../api/reviewApi";

function MyReviews() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [page, setPage] = useState(1);

  const isDark = theme === "dark";

  useEffect(() => {
    fetchUserReviews();
  }, [page]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserReviews({ page, limit: 10 });
      setReviews(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (formData, data) => {
    try {
      await updateReview(editingReview._id, data);
      setEditingReview(null);
      fetchUserReviews();
      alert("Review updated successfully!");
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
      fetchUserReviews();
      alert("Review deleted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const handleViewProduct = (sareeId) => {
    navigate(`/saree/${sareeId}`);
  };

  if (loading && reviews.length === 0) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto"></div>
          <p
            className={`mt-4 text-sm ${
              isDark ? "text-slate-400" : "text-gray-600"
            }`}
          >
            Loading your reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            My Reviews
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Manage your product reviews and ratings
          </p>
        </div>

        {/* Edit Form */}
        {editingReview && (
          <div className="mb-8">
            <ReviewForm
              initialData={editingReview}
              onSubmit={handleUpdateReview}
              onCancel={() => setEditingReview(null)}
              isDark={isDark}
            />
          </div>
        )}

        {/* Reviews List */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchUserReviews}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div
            className={`text-center py-12 rounded-lg border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <p className={`text-lg mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              You haven't written any reviews yet.
            </p>
            <button
              onClick={() => navigate("/sarees")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className={`p-6 rounded-lg border ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Product Info */}
                {review.saree && (
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <img
                      src={review.saree.images?.[0]?.url || "https://placehold.co/80x80"}
                      alt={review.saree.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3
                        className={`font-semibold mb-1 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {review.saree.name}
                      </h3>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {review.saree.category} • ₹{review.saree.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewProduct(review.saree._id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Product
                    </button>
                  </div>
                )}

                {/* Review Card */}
                <ReviewCard
                  review={review}
                  canEdit={true}
                  onEdit={() => setEditingReview(review)}
                  onDelete={() => handleDeleteReview(review._id)}
                  isAuthenticated={true}
                  isDark={isDark}
                />
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${
                      page === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                >
                  Previous
                </button>

                <span className={`px-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Page {page} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.totalPages}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors
                    ${
                      page === pagination.totalPages
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
        )}
      </div>
    </div>
  );
}

export default MyReviews;
