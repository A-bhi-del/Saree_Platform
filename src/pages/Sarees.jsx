import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useFavourites } from "../context/FavouriteContext";
import { useSaree } from "../context/SareeContext";

function Sarees() {
  const { addFavourites } = useFavourites();
  const { sarees, deleteSaree } = useSaree();
  const [searchName, setSearchName] = useState("");
  const [searchColor, setSearchColor] = useState("");
  const [searchFabric, setSearchFabric] = useState("");
  const [searchMinimumPrice, setSearchMinimumPrice] = useState("");
  const [searchMaximumPrice, setSearchMaximumPrice] = useState("");

  const filterSarees = sarees.filter((saree) => {
    const matchName =
      !searchName ||
      saree.name.toLowerCase().includes(searchName.toLowerCase());
    const matchColor =
      !searchColor || saree.color.toLowerCase() === searchColor.toLowerCase();
    const matchFabric =
      !searchFabric ||
      saree.fabric.toLowerCase() === searchFabric.toLowerCase();
    const matchMinimumPrice =
      !searchMinimumPrice || saree.price >= Number(searchMinimumPrice);
    const matchMaximumPrice =
      !searchMaximumPrice || saree.price <= Number(searchMaximumPrice);

    return (
      matchName &&
      matchColor &&
      matchFabric &&
      matchMinimumPrice &&
      matchMaximumPrice
    );
  });

  const { role } = useAuth();

  if (sarees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 font-serif">
        <h2 className="text-2xl font-semibold">No Sarees Available At The Moment</h2>
        <p className="text-sm mt-2">Please check back later or contact admin.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-8">
      
      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-rose-900 font-serif uppercase tracking-wider">Our Exclusive Collection</h1>
        <div className="h-0.5 w-24 bg-amber-500 mx-auto mt-2"></div>
      </div>

      {/* Premium Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Filter Catalog</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800"
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Color"
            value={searchColor}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800"
            onChange={(e) => setSearchColor(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Fabric"
            value={searchFabric}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800"
            onChange={(e) => setSearchFabric(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={searchMinimumPrice}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800"
            onChange={(e) => setSearchMinimumPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={searchMaximumPrice}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800"
            onChange={(e) => setSearchMaximumPrice(e.target.value)}
          />
        </div>
        
        {/* Clear Filter Button Area */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSearchName("");
              setSearchColor("");
              setSearchFabric("");
              setSearchMinimumPrice("");
              setSearchMaximumPrice("");
            }}
            className="text-xs font-semibold text-rose-900 hover:text-rose-950 underline underline-offset-4 cursor-pointer transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Saree Grid Section */}
      <div>
        {filterSarees.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <h2 className="text-xl text-gray-500 font-medium">No Sarees Match Your Filters</h2>
            <p className="text-sm text-gray-400 mt-1">Try resetting or tweaking the filter inputs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filterSarees.map((saree) => (
              <div 
                key={saree.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col group transition-all duration-300"
              >
                {/* Product Image Box */}
                <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                  <img 
                    src={saree.image} 
                    alt={saree.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Stock Status Badge */}
                  {saree.stock < 5 && (
                    <span className="absolute top-3 left-3 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                      Low Stock ({saree.stock})
                    </span>
                  )}
                  {/* Fabric Tag overlay */}
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded backdrop-blur-sm">
                    {saree.fabric}
                  </span>
                </div>

                {/* Product Details Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base font-semibold text-gray-800 font-serif line-clamp-1">{saree.name}</h3>
                    <span className="text-base font-bold text-rose-900">₹{saree.price}</span>
                  </div>
                  
                  {/* Color Details */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs text-gray-400">Color:</span>
                    <span className="text-xs font-medium text-gray-600 capitalize">{saree.color}</span>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">
                    {saree.description || "Beautifully crafted authentic traditional saree designed to match your elegance perfectly."}
                  </p>

                  {/* Actions Area */}
                  <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                    {role === "customer" && (
                      <button 
                        onClick={() => addFavourites(saree)}
                        className="w-full flex items-center justify-center gap-2 border border-rose-900 text-rose-900 hover:bg-rose-50 px-4 py-2 text-xs font-semibold rounded transition-colors duration-200"
                      >
                        ❤️ Add to Favourites
                      </button>
                    )}
                    
                    {role === "admin" && (
                      <button 
                        onClick={() => deleteSaree(saree.id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 text-xs font-semibold rounded transition-colors duration-200"
                      >
                        Delete Saree
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sarees;