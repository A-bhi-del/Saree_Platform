import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import FavouriteCard from "../components/Favourite";

function FavouritePage() {
  const { favourites, removeFavourites } = useFavourites();
  const { cartCount } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleGoToCart = () => {
    window.location.href = "/cart";
  };

  if (favourites.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[60vh] font-serif transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
        }`}
      >
        <div className="text-4xl mb-3">❤️</div>
        <h2
          className={`text-xl font-semibold ${
            isDark ? "text-slate-200" : "text-gray-700"
          }`}
        >
          Your Wishlist is Empty
        </h2>
        <p
          className={`text-sm mt-1 mb-6 ${
            isDark ? "text-slate-500" : "text-gray-400"
          }`}
        >
          Explore our exclusive collection and save your favorite sarees here.
        </p>

        {/* Refresh & Navigate to Cart */}
        <button
          onClick={handleGoToCart}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer ${
            isDark
              ? "bg-rose-700 hover:bg-rose-600 text-white"
              : "bg-rose-900 hover:bg-rose-950 text-white"
          }`}
        >
          <span>🛒 View Shopping Cart ({cartCount})</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950" : "bg-gray-50"
      }`}
    >
      {/* Page Header Container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div className="text-center md:text-left">
          <h1
            className={`text-3xl font-bold font-serif uppercase tracking-wider ${
              isDark ? "text-rose-400" : "text-rose-900"
            }`}
          >
            My Saved Wishlist
          </h1>
          <p
            className={`text-xs uppercase tracking-widest mt-1 ${
              isDark ? "text-slate-400" : "text-gray-500"
            }`}
          >
            Your handpicked traditional collection
          </p>
          <div className="h-0.5 w-16 bg-amber-500 mt-2 mx-auto md:mx-0"></div>
        </div>

        {/* 🚀 Button triggering full page load to /cart */}
        <button
          onClick={handleGoToCart}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ${
            isDark
              ? "bg-rose-700 hover:bg-rose-600 text-white"
              : "bg-rose-900 hover:bg-rose-950 text-white"
          }`}
        >
          <span>🛒 Go To Cart</span>
          {cartCount > 0 && (
            <span className="bg-amber-500 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full ml-1">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favourites.map((favourite, index) => (
          <FavouriteCard
            key={favourite._id || favourite.id || index}
            favourite={favourite}
            isDark={isDark}
            removeFavourites={removeFavourites}
          />
        ))}
      </div>
    </div>
  );
}

export default FavouritePage;