import API from "./axios";

/**
 * Create a new review for a saree
 * @param {string} sareeId - The saree ID
 * @param {FormData} formData - Form data containing rating, title, comment, and images
 * @returns {Promise} API response with review data
 */
export const createReview = async (sareeId, formData) => {
  const response = await API.post(`/sarees/${sareeId}/reviews`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response;
};

/**
 * Get reviews for a saree with filters
 * @param {string} sareeId - The saree ID
 * @param {Object} params - Query parameters (page, limit, sort, rating, verifiedPurchase, withImages)
 * @returns {Promise} API response with reviews and pagination
 */
export const getReviews = async (sareeId, params = {}) => {
  const response = await API.get(`/sarees/${sareeId}/reviews`, { params });
  return response;
};

/**
 * Get rating statistics for a saree
 * @param {string} sareeId - The saree ID
 * @returns {Promise} API response with rating stats
 */
export const getRatingStats = async (sareeId) => {
  const response = await API.get(`/sarees/${sareeId}/reviews/stats`);
  return response;
};

/**
 * Get current user's reviews
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} API response with user's reviews
 */
export const getUserReviews = async (params = {}) => {
  const response = await API.get(`/reviews/me`, { params });
  return response;
};

/**
 * Update a review
 * @param {string} reviewId - The review ID
 * @param {Object} data - Update data (rating, title, comment)
 * @returns {Promise} API response with updated review
 */
export const updateReview = async (reviewId, data) => {
  const response = await API.patch(`/reviews/${reviewId}`, data);
  return response;
};

/**
 * Delete a review
 * @param {string} reviewId - The review ID
 * @returns {Promise} API response
 */
export const deleteReview = async (reviewId) => {
  const response = await API.delete(`/reviews/${reviewId}`);
  return response;
};

/**
 * Toggle helpful vote on a review
 * @param {string} reviewId - The review ID
 * @param {boolean} voted - Current vote status
 * @returns {Promise} API response
 */
export const toggleHelpfulVote = async (reviewId, voted) => {
  if (voted) {
    const response = await API.delete(`/reviews/${reviewId}/helpful`);
    return response;
  } else {
    const response = await API.put(`/reviews/${reviewId}/helpful`);
    return response;
  }
};

/**
 * Moderate a review (admin only)
 * @param {string} reviewId - The review ID
 * @param {Object} data - Moderation data (moderationStatus, moderationReason)
 * @returns {Promise} API response
 */
export const moderateReview = async (reviewId, data) => {
  const response = await API.patch(`/admin/reviews/${reviewId}/moderation`, data);
  return response;
};

/**
 * Reconcile rating statistics for a saree (admin only)
 * @param {string} sareeId - The saree ID
 * @returns {Promise} API response
 */
export const reconcileSareeStats = async (sareeId) => {
  const response = await API.post(`/admin/reviews/reconcile-stats/${sareeId}`);
  return response;
};

/**
 * Reconcile all rating statistics (admin only)
 * @returns {Promise} API response
 */
export const reconcileAllStats = async () => {
  const response = await API.post(`/admin/reviews/reconcile-stats`);
  return response;
};
