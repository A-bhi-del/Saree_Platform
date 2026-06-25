import { useFavourites } from "../context/FavouriteContext";
import { useTheme } from "../context/ThemeContext";

function FavouritePage() {
  const { favourites, removeFavourites } = useFavourites();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Empty State Layout
  if (favourites.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] font-serif transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-400" : "bg-gray-50 text-gray-500"
      }`}>
        <div className="text-4xl mb-3">❤️</div>
        <h2 className={`text-xl font-semibold ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          Your Wishlist is Empty
        </h2>
        <p className={`text-sm mt-1 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
          Explore our exclusive collection and save your favorite sarees here.
        </p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      
      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className={`text-3xl font-bold font-serif uppercase tracking-wider ${
          isDark ? "text-rose-400" : "text-rose-900"
        }`}>
          My Saved Wishlist
        </h1>
        <p className={`text-xs uppercase tracking-widest mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          Your handpicked traditional collection
        </p>
        <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-2"></div>
      </div>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favourites.map((favourite) => (
          <div 
            key={favourite.id} 
            className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md border flex flex-col group transition-all duration-300 ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
            }`}
          >
            
            {/* Product Image Box */}
            <div className={`relative overflow-hidden aspect-[3/4] ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
              {favourite.image && (
                <img 
                  src={favourite.image} 
                  alt={favourite.name} 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              )}
              
              {/* Low Stock Badge */}
              {favourite.stock < 5 && (
                <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm border ${
                  isDark 
                    ? "bg-red-950/50 text-red-400 border-red-900/60" 
                    : "bg-red-50 text-red-600 border-red-200"
                }`}>
                  Low Stock ({favourite.stock})
                </span>
              )}

              {/* Fabric Tag overlay */}
              <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                {favourite.fabric}
              </span>
            </div>

            {/* Product Details Content */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-1 gap-2">
                <h3 className={`text-base font-semibold font-serif line-clamp-1 ${
                  isDark ? "text-slate-200" : "text-gray-800"
                }`}>
                  {favourite.name}
                </h3>
                <span className={`text-base font-bold whitespace-nowrap ${
                  isDark ? "text-rose-400" : "text-rose-900"
                }`}>
                  ₹{favourite.price}
                </span>
              </div>
              
              {/* Color Details */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`text-xs ${isDark ? "text-slate-500" : "text-gray-400"}`}>Color:</span>
                <span className={`text-xs font-medium capitalize ${isDark ? "text-slate-300" : "text-gray-600"}`}>
                  {favourite.color}
                </span>
              </div>

              <p className={`text-xs line-clamp-2 mb-4 flex-grow ${isDark ? "text-slate-400" : "text-gray-500"}`}>
                {favourite.description || "No specific details available for this handloom piece."}
              </p>

              {/* Action Buttons Area */}
              <div className={`mt-auto pt-3 border-t flex items-center justify-between gap-2 ${
                isDark ? "border-slate-800" : "border-gray-50"
              }`}>
                <button 
                  onClick={() => removeFavourites(favourite.id)}
                  className={`w-full flex items-center justify-center gap-2 border px-4 py-2 text-xs font-semibold rounded-lg transition-colors duration-200 cursor-pointer ${
                    isDark 
                      ? "border-red-900/60 text-red-400 hover:bg-red-950/40" 
                      : "border-red-200 text-red-600 hover:bg-red-50"
                  }`}
                >
                  ✕ Remove Item
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default FavouritePage;