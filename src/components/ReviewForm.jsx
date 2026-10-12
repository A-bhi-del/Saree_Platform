import React, { useState, useRef } from "react";
import RatingStars from "./RatingStars";

/**
 * ReviewForm component - Form for creating or editing a review
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onCancel - Callback when cancel is clicked
 * @param {Object} initialData - Initial form data for editing
 * @param {boolean} isSubmitting - Whether form is currently submitting
 */
const ReviewForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isSubmitting = false,
  isDark = false
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || "");
  const [comment, setComment] = useState(initialData?.comment || "");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const isEditMode = !!initialData;
  const maxImages = 5;
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = "Please select a rating";
    }

    if (comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters";
    }

    if (comment.trim().length > 2000) {
      newErrors.comment = "Comment cannot exceed 2000 characters";
    }

    if (title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (images.length > maxImages) {
      newErrors.images = `Maximum ${maxImages} images allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const newPreviews = [];
    const newErrors = {};

    if (images.length + files.length > maxImages) {
      newErrors.images = `Maximum ${maxImages} images allowed`;
      setErrors(newErrors);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        newErrors.images = "Only image files are allowed";
        continue;
      }

      if (file.size > maxImageSize) {
        newErrors.images = "Each image must be less than 5MB";
        continue;
      }

      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages([...images, ...validFiles]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setErrors(newErrors);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);

    setImages(newImages);
    setImagePreviews(newPreviews);
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("title", title.trim());
    formData.append("comment", comment.trim());

    if (!isEditMode) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    onSubmit(formData, { rating, title: title.trim(), comment: comment.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <h3 className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
        {isEditMode ? "Edit Your Review" : "Write a Review"}
      </h3>

      {/* Rating */}
      <div className="mb-6">
        <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Rating <span className="text-red-500">*</span>
        </label>
        <RatingStars
          rating={rating}
          interactive={true}
          onChange={setRating}
          size="lg"
        />
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="review-title" className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Review Title (Optional)
        </label>
        <input
          id="review-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className={`
            w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"}
          `}
        />
        <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {title.length}/100 characters
        </div>
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="review-comment" className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          rows={6}
          maxLength={2000}
          className={`
            w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
            ${isDark ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"}
          `}
        />
        <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {comment.length}/2000 characters (minimum 10)
        </div>
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
        )}
      </div>

      {/* Images (only for new reviews) */}
      {!isEditMode && (
        <div className="mb-6">
          <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Add Images (Optional)
          </label>
          <div className="space-y-3">
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`
                  w-full py-3 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors
                  ${isDark ? "border-gray-600 text-gray-400 hover:text-blue-400" : "border-gray-300 text-gray-600 hover:text-blue-600"}
                `}
              >
                + Add Images ({images.length}/{maxImages})
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Maximum 5 images, each up to 5MB
            </p>
          </div>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            flex-1 py-3 rounded-lg font-semibold transition-colors
            ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            } text-white
          `}
        >
          {isSubmitting ? "Submitting..." : isEditMode ? "Update Review" : "Submit Review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`
            px-6 py-3 rounded-lg font-semibold transition-colors
            ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"}
            ${isSubmitting && "opacity-50 cursor-not-allowed"}
          `}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
