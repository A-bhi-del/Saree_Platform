import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSaree } from "../context/SareeContext";
import { useSale } from "../context/SaleContext"; 
import { useNavigate, Link } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";

function BannerTimer({ endDate, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      
      if (difference <= 0) {
        if (onExpire) onExpire();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 bg-black/30 p-2.5 rounded-xl border border-white/10 shadow-inner w-max mx-auto sm:mx-0">
      <div className="flex flex-col items-center min-w-[42px]">
        <span className="text-base font-bold font-serif text-amber-300 leading-tight">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[8px] uppercase tracking-wider text-rose-200/60 font-bold">Days</span>
      </div>
      <span className="text-amber-400 font-bold text-xs bottom-0.5 relative">:</span>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className="text-base font-bold font-serif text-amber-300 leading-tight">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[8px] uppercase tracking-wider text-rose-200/60 font-bold">Hrs</span>
      </div>
      <span className="text-amber-400 font-bold text-xs bottom-0.5 relative">:</span>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className="text-base font-bold font-serif text-amber-300 leading-tight">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[8px] uppercase tracking-wider text-rose-200/60 font-bold">Min</span>
      </div>
      <span className="text-amber-400 font-bold text-xs bottom-0.5 relative">:</span>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className="text-lg font-bold font-serif text-rose-300 leading-tight animate-pulse">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[8px] uppercase tracking-wider text-rose-200/60 font-bold">Sec</span>
      </div>
    </div>
  );
}

function Sarees() {
  const { addFavourites } = useFavourites();
  const { sarees, deleteSaree } = useSaree();
  const { sale } = useSale(); 
  
  const [searchName, setSearchName] = useState("");
  const [searchColor, setSearchColor] = useState("");
  const [searchFabric, setSearchFabric] = useState("");
  const [searchMinimumPrice, setSearchMinimumPrice] = useState("");
  const [searchMaximumPrice, setSearchMaximumPrice] = useState("");
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();
  const { role } = useAuth();

  const activeSales = sale?.filter((s) => s.active === true) || [];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev === activeSales.length - 1 ? 0 : prev + 1));
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev === 0 ? activeSales.length - 1 : prev - 1));
  };

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

  const sortedSarees = [...filterSarees].sort((a, b) => {
    if (sortBy === "priceLowToHigh") return a.price - b.price;
    if (sortBy === "priceHighToLow") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  });

  if (sarees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 font-serif">
        <h2 className="text-2xl font-semibold text-gray-700">
          No Sarees Available At The Moment
        </h2>
        <p className="text-sm mt-2 text-gray-400">
          Please check back later or contact admin.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-8 transition-all">
      
      {activeSales.length > 0 && (
        <div className="relative mb-10 group/banner">
          {/* Main Slider Window */}
          <div className="relative overflow-hidden bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white rounded-2xl shadow-md border border-amber-500/20 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[160px]">
            
            {/* Subtle design element backdrop */}
            <div className="absolute right-0 top-0 text-9xl opacity-5 font-serif select-none pointer-events-none transform translate-x-10 -translate-y-5">
              ✨
            </div>
            
            {/* Left Content Area */}
            <div className="flex items-center gap-4 w-full lg:w-auto dynamic-banner-fade">
              <div className="h-16 w-16 bg-white/10 rounded-full flex-shrink-0 flex items-center justify-center text-3xl shadow-inner animate-bounce duration-1000">
                🎉
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-rose-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest animate-pulse">
                    Live Event {activeSales.length > 1 && `(${currentBannerIndex + 1}/${activeSales.length})`}
                  </span>
                  <span className="text-amber-300 font-semibold text-xs tracking-wider">
                    Limited Time Boutique Offer
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif font-bold tracking-wide mt-1 text-white">
                  {activeSales[currentBannerIndex].saleName}
                </h2>
                <p className="text-xs text-rose-100/80 mt-1 max-w-xl font-medium">
                  {activeSales[currentBannerIndex].description || activeSales[currentBannerIndex].discription || "Exclusive handloom cluster discount active site-wide."}
                </p>
              </div>
            </div>

            {/* Right side analytics & Dedicated Timer Component */}
            <div className="flex flex-col sm:flex-row items-center justify-between lg:justify-end w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-8 gap-6">
              <div className="text-center sm:text-left lg:text-right">
                <span className="text-[10px] text-rose-200 uppercase tracking-widest block font-bold">Flat Discount</span>
                <span className="text-3xl md:text-4xl font-extrabold text-amber-400 font-serif tracking-tight">
                  {activeSales[currentBannerIndex].discount}% OFF
                </span>
              </div>
              
              {activeSales[currentBannerIndex].endDate && (
                <BannerTimer 
                  endDate={activeSales[currentBannerIndex].endDate} 
                  onExpire={() => {
                    // Logic to jump to previous if a banner expires live
                    setCurrentBannerIndex(0);
                  }}
                />
              )}
            </div>
          </div>

          {/* Navigation Controls (Only show if multiple sales exist) */}
          {activeSales.length > 1 && (
            <>
              {/* Left Arrow */}
              <button 
                onClick={prevBanner}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white text-sm backdrop-blur-sm cursor-pointer opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 z-10"
              >
                ❮
              </button>
              {/* Right Arrow */}
              <button 
                onClick={nextBanner}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/60 border border-white/10 flex items-center justify-center text-white text-sm backdrop-blur-sm cursor-pointer opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 z-10"
              >
                ❯
              </button>

              {/* Slider Dots/Pagination */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {activeSales.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                      index === currentBannerIndex ? "w-4 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Page Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-rose-900 font-serif uppercase tracking-wider">
          Our Exclusive Collection
        </h1>
        <p className="text-xs text-gray-400 font-medium tracking-wide mt-1">
          Handwoven master-pieces curation crafted by generational heritage artisans
        </p>
        <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-3"></div>
      </div>

      {/* Filter Layout */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <span>🎛️ Filter & Sort Catalog</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs pointer-events-none text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all text-gray-700 font-medium"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs pointer-events-none text-gray-400">🎨</span>
            <input
              type="text"
              placeholder="Search by Color"
              value={searchColor}
              onChange={(e) => setSearchColor(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all text-gray-700 font-medium"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs pointer-events-none text-gray-400">🧵</span>
            <input
              type="text"
              placeholder="Search by Fabric"
              value={searchFabric}
              onChange={(e) => setSearchFabric(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all text-gray-700 font-medium"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs pointer-events-none text-gray-400">₹</span>
            <input
              type="number"
              placeholder="Min Price"
              value={searchMinimumPrice}
              onChange={(e) => setSearchMinimumPrice(e.target.value)}
              className="w-full pl-7 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all text-gray-700 font-medium"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs pointer-events-none text-gray-400">₹</span>
            <input
              type="number"
              placeholder="Max Price"
              value={searchMaximumPrice}
              onChange={(e) => setSearchMaximumPrice(e.target.value)}
              className="w-full pl-7 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all text-gray-700 font-medium"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-xs pointer-events-none text-gray-400">↕️</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-800 focus:border-rose-800 transition-all text-gray-600 font-semibold cursor-pointer appearance-none"
            >
              <option value="">Sort By</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setSearchName("");
              setSearchColor("");
              setSearchFabric("");
              setSearchMinimumPrice("");
              setSearchMaximumPrice("");
              setSortBy("");
            }}
            className="text-xs font-semibold text-rose-900 hover:text-rose-950 underline underline-offset-4 cursor-pointer transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Saree Collection Product Deck Grid */}
      <div>
        {sortedSarees.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <h2 className="text-xl text-gray-400 font-serif font-semibold">No Sarees Match Your Filters</h2>
            <p className="text-xs text-gray-400 mt-1">Try resetting or modifying your selected attributes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sortedSarees.map((saree) => {
              const discountedPrice = Math.round(
                saree.price - (saree.price * saree.discountPercentage) / 100
              );
              const hasDiscount = saree.discountPercentage > 0;

              return (
                <div
                  key={saree.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 flex flex-col group transition-all duration-300"
                >
                  {/* Photo Workspace Frame */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                    <img
                      src={saree.image}
                      alt={saree.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Dynamic Badges Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {saree.stock < 5 && (
                        <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                          Low Stock ({saree.stock})
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm w-max animate-pulse">
                          {saree.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {saree.fabric}
                    </span>
                  </div>

                  {/* Content Meta Frame */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="text-base font-bold text-gray-800 font-serif line-clamp-1 flex-grow">
                        {saree.name}
                      </h3>
                      
                      {/* Cost metrics element stack */}
                      <div className="flex flex-col text-right min-w-[80px] flex-shrink-0">
                        {hasDiscount ? (
                          <>
                            <span className="text-[11px] text-gray-400 line-through font-semibold">
                              ₹{saree.price}
                            </span>
                            <span className="text-base font-extrabold text-rose-900 leading-none">
                              ₹{discountedPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-base font-extrabold text-rose-900">
                            ₹{saree.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specifications lines */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Color:</span>
                      <span className="text-xs font-semibold text-gray-600 capitalize">
                        {saree.color}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-5 leading-relaxed flex-grow font-medium">
                      {saree.description || "Beautifully crafted authentic traditional handloom work tailored to enhance your luxury wardrobe."}
                    </p>

                    {/* Operational Action Footer */}
                    <div className="mt-auto pt-3 border-t border-gray-50">
                      {role === "customer" && (
                        <button
                          onClick={() => addFavourites(saree)}
                          className="w-full flex items-center justify-center gap-2 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer shadow-sm"
                        >
                          ❤️ Add to Favourites
                        </button>
                      )}

                      {role === "admin" && (
                        <div className="w-full flex gap-3">
                          <button
                            onClick={() => navigate(`/edit-saree/${saree.id}`)}
                            className="w-1/2 flex items-center justify-center gap-1.5 border border-amber-200 text-amber-700 hover:bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            📝 Edit
                          </button>
                          <button
                            onClick={() => deleteSaree(saree.id)}
                            className="w-1/2 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sarees;