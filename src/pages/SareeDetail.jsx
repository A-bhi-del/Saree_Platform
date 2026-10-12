import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { fetchSareeByIdApi, fetchRelatedSareeApi } from "../api/sareeApi";
import { addToCart } from "../api/cartSystem";
import { useFavourites } from "../context/FavouriteContext";
import { useCart } from "../context/CartContext";
import SareeCard from "../components/SareeCard";
import { useSaree } from "../context/SareeContext";
import ProductRatingSummary from "../components/ProductRatingSummary";
import ReviewSortAndFilter from "../components/ReviewSortAndFilter";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import { getRatingStats, createReview } from "../api/reviewApi";

function SareeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { role, user } = useAuth();
  const { addFavourites } = useFavourites();
  const { deleteSaree } = useSaree();
  const { fetchCart } = useCart();

  const [saree, setSaree] = useState(null);
  const [relatedSarees, setRelatedSarees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review states
  const [ratingStats, setRatingStats] = useState(null);
  const [reviewFilters, setReviewFilters] = useState({ page: 1, limit: 10, sort: "newest" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    fetchSareeDetails();
    fetchRelatedSarees();
    fetchRatingStats();
  }, [id]);

  const fetchSareeDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchSareeByIdApi(id);
      setSaree(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch saree details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedSarees = async () => {
    try {
      const response = await fetchRelatedSareeApi(id);
      setRelatedSarees(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch related sarees:", err);
    }
  };

  const fetchRatingStats = async () => {
    try {
      const response = await getRatingStats(id);
      setRatingStats(response.data.data);
    } catch (err) {
      console.error("Failed to fetch rating stats:", err);
    }
  };

  const handleSubmitReview = async (formData) => {
    try {
      setSubmittingReview(true);
      await createReview(id, formData);
      setShowReviewForm(false);
      fetchRatingStats(); // Refresh stats
      setReviewFilters({ ...reviewFilters }); // Trigger review list refresh
      alert("Review submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleFilterRating = (rating) => {
    setReviewFilters({ ...reviewFilters, rating, page: 1 });
  };

  const handleAddToCart = async () => {
    if (role !== "customer") {
      alert("Only customers can add items to cart");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart({
        sareeId: id,
        quantity: quantity,
      });
      // Refresh cart data
      await fetchCart();
      // Redirect to cart after adding
      navigate("/cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (role !== "customer") {
      alert("Only customers can purchase items");
      return;
    }

    try {
      setAddingToCart(true);
      await addToCart({
        sareeId: id,
        quantity: quantity,
      });
      // Refresh cart data
      await fetchCart();
      // Redirect to cart
      navigate("/cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process");
      setAddingToCart(false);
    }
  };

  if (loading) {
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
            Loading saree details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !saree) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          isDark ? "bg-slate-950" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-slate-300" : "text-gray-700"
            }`}
          >
            Saree Not Found
          </h2>
          <p
            className={`mb-4 ${isDark ? "text-slate-500" : "text-gray-500"}`}
          >
            {error || "The saree you're looking for doesn't exist"}
          </p>
          <button
            onClick={() => navigate("/sarees")}
            className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            Back to Sarees
          </button>
        </div>
      </div>
    );
  }

  const images =
    saree.images?.length > 0
      ? saree.images.map((img) => img.url)
      : ["https://placehold.co/600x800?text=No+Image"];

  const discountPercentage = saree.discountPercentage || 0;
  const discountedPrice = Math.round(
    saree.price - (saree.price * discountPercentage) / 100
  );
  const hasDiscount = discountPercentage > 0;
  const savings = saree.price - discountedPrice;

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigate("/sarees")}
              className={`hover:underline ${
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Sarees
            </button>
            <span className={isDark ? "text-slate-600" : "text-gray-400"}>
              /
            </span>
            <span className={isDark ? "text-slate-300" : "text-gray-800"}>
              {saree.name}
            </span>
          </nav>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className={`relative rounded-2xl overflow-hidden border ${
                isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="aspect-[3/4] relative">
                <img
                  src={images[selectedImage]}
                  alt={saree.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x800?text=Image+Error";
                  }}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {saree.stock < 5 && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded shadow-md ${
                        isDark
                          ? "bg-red-950/90 text-red-400"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      Only {saree.stock} left in stock
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? isDark
                          ? "border-rose-400"
                          : "border-rose-600"
                        : isDark
                        ? "border-slate-800 hover:border-slate-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${saree.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1
                className={`text-3xl font-bold font-serif mb-2 ${
                  isDark ? "text-slate-100" : "text-gray-900"
                }`}
              >
                {saree.name}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {saree.like || 0} ❤️ Likes
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className={`text-3xl font-bold ${
                    isDark ? "text-rose-400" : "text-rose-900"
                  }`}
                >
                  ₹{discountedPrice.toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <>
                    <span
                      className={`text-xl line-through ${
                        isDark ? "text-slate-500" : "text-gray-400"
                      }`}
                    >
                      ₹{saree.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-green-600 font-semibold">
                      Save ₹{savings.toLocaleString("en-IN")}
                    </span>
                  </>
                )}
              </div>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-gray-600"}`}>
                Inclusive of all taxes
              </p>
            </div>

            {/* Specifications */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDark
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold ${
                  isDark ? "text-slate-200" : "text-gray-800"
                }`}
              >
                Product Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Fabric
                  </p>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    {saree.fabric}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Color
                  </p>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    {saree.color}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Category
                  </p>
                  <p
                    className={`font-semibold ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    {saree.category}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-xs ${
                      isDark ? "text-slate-500" : "text-gray-500"
                    }`}
                  >
                    Availability
                  </p>
                  <p
                    className={`font-semibold ${
                      saree.isAvailable
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {saree.isAvailable ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {saree.description && (
              <div
                className={`p-4 rounded-xl border ${
                  isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-2 ${
                    isDark ? "text-slate-200" : "text-gray-800"
                  }`}
                >
                  About This Saree
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {saree.description}
                </p>
              </div>
            )}

            {/* Actions */}
            {role === "customer" && saree.isAvailable && (
              <div
                className={`p-4 rounded-xl border space-y-4 ${
                  isDark
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Quantity Selector */}
                <div>
                  <label
                    className={`text-sm font-semibold mb-2 block ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Quantity
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className={`w-10 h-10 rounded-lg border font-bold ${
                        isDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-gray-300 hover:bg-gray-100"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      −
                    </button>
                    <span
                      className={`w-12 text-center font-bold ${
                        isDark ? "text-slate-200" : "text-gray-800"
                      }`}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(saree.stock, quantity + 1))
                      }
                      disabled={quantity >= saree.stock}
                      className={`w-10 h-10 rounded-lg border font-bold ${
                        isDark
                          ? "border-slate-700 hover:bg-slate-800"
                          : "border-gray-300 hover:bg-gray-100"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                      isDark
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {addingToCart ? "Adding..." : "🛒 Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                    className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                      isDark
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-rose-900 hover:bg-rose-950 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {addingToCart ? "Processing..." : "⚡ Buy Now"}
                  </button>
                </div>

                {/* Add to Favourites */}
                <button
                  onClick={() => addFavourites(saree)}
                  className={`w-full py-3 rounded-lg font-bold border transition-colors ${
                    isDark
                      ? "border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-slate-950"
                      : "border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white"
                  }`}
                >
                  ❤️ Add to Favourites
                </button>
              </div>
            )}

            {/* Admin Actions */}
            {role === "admin" && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit-saree/${id}`)}
                  className={`flex-1 py-3 rounded-lg font-bold border transition-colors ${
                    isDark
                      ? "border-amber-600 text-amber-400 hover:bg-amber-950/30"
                      : "border-amber-500 text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  📝 Edit Saree
                </button>
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this saree?"
                      )
                    ) {
                      deleteSaree(id);
                      navigate("/sarees");
                    }
                  }}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
                    isDark
                      ? "bg-red-950/40 hover:bg-red-900/30 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                >
                  🗑️ Delete Saree
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div
          className={`p-6 rounded-xl border mb-12 ${
            isDark
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDark ? "text-slate-200" : "text-gray-800"
            }`}
          >
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <h3
                  className={`font-bold mb-1 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Free Delivery
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-500" : "text-gray-600"
                  }`}
                >
                  Free delivery on orders above ₹500
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">↩️</span>
              <div>
                <h3
                  className={`font-bold mb-1 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Easy Returns
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-500" : "text-gray-600"
                  }`}
                >
                  7-day return policy for all products
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3
                  className={`font-bold mb-1 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Quality Assured
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-slate-500" : "text-gray-600"
                  }`}
                >
                  100% authentic handwoven sarees
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12 space-y-8">
          {/* Rating Summary */}
          {ratingStats && (
            <ProductRatingSummary
              stats={ratingStats}
              onFilterRating={handleFilterRating}
              onWriteReview={() => setShowReviewForm(true)}
              isDark={isDark}
              userRole={role}
            />
          )}

          {/* Review Form */}
          {showReviewForm && role === "customer" && (
            <ReviewForm
              onSubmit={handleSubmitReview}
              onCancel={() => setShowReviewForm(false)}
              isSubmitting={submittingReview}
              isDark={isDark}
            />
          )}

          {/* Sort and Filter */}
          <ReviewSortAndFilter
            filters={reviewFilters}
            onChange={setReviewFilters}
            isDark={isDark}
          />

          {/* Review List */}
          <ReviewList
            sareeId={id}
            filters={reviewFilters}
            onFilterChange={setReviewFilters}
            isDark={isDark}
          />
        </div>

        {/* Related Products */}
        {relatedSarees.length > 0 && (
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-slate-200" : "text-gray-800"
              }`}
            >
              Similar Sarees You May Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedSarees.map((relatedSaree) => (
                <div
                  key={relatedSaree._id}
                  onClick={() => {
                    navigate(`/saree/${relatedSaree._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="cursor-pointer"
                >
                  <SareeCard
                    saree={relatedSaree}
                    isDark={isDark}
                    role={role}
                    addFavourites={addFavourites}
                    navigate={navigate}
                    deleteSaree={deleteSaree}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SareeDetail;
