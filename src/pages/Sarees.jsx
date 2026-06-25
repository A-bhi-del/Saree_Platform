import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSaree } from "../context/SareeContext";
import { useSale } from "../context/SaleContext"; 
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../context/FavouriteContext";
import { useTheme } from "../context/ThemeContext";

function BannerTimer({ endDate, onExpire, isDark }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!endDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      
      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const initialTime = calculateTimeLeft();
    if (!initialTime) {
      if (onExpire) onExpire();
      return;
    }
    setTimeLeft(initialTime);

    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (!time) {
        clearInterval(timer);
        if (onExpire) onExpire();
      } else {
        setTimeLeft(time);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  return (
    <div className={`flex items-center gap-2 p-2.5 rounded-xl border shadow-inner w-max mx-auto sm:mx-0 ${
      isDark ? "bg-slate-900/80 border-slate-800" : "bg-black/30 border-white/10"
    }`}>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className={`text-base font-bold font-serif leading-tight ${isDark ? "text-amber-400" : "text-amber-300"}`}>
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className={`text-[8px] uppercase tracking-wider font-bold ${isDark ? "text-slate-400" : "text-rose-200/60"}`}>Days</span>
      </div>
      <span className={`font-bold text-xs bottom-0.5 relative ${isDark ? "text-amber-500" : "text-amber-400"}`}>:</span>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className={`text-base font-bold font-serif leading-tight ${isDark ? "text-amber-400" : "text-amber-300"}`}>
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className={`text-[8px] uppercase tracking-wider font-bold ${isDark ? "text-slate-400" : "text-rose-200/60"}`}>Hrs</span>
      </div>
      <span className={`font-bold text-xs bottom-0.5 relative ${isDark ? "text-amber-500" : "text-amber-400"}`}>:</span>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className={`text-base font-bold font-serif leading-tight ${isDark ? "text-amber-400" : "text-amber-300"}`}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className={`text-[8px] uppercase tracking-wider font-bold ${isDark ? "text-slate-400" : "text-rose-200/60"}`}>Min</span>
      </div>
      <span className={`font-bold text-xs bottom-0.5 relative ${isDark ? "text-amber-500" : "text-amber-400"}`}>:</span>
      <div className="flex flex-col items-center min-w-[42px]">
        <span className={`text-lg font-bold font-serif leading-tight animate-pulse ${isDark ? "text-rose-400" : "text-rose-300"}`}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className={`text-[8px] uppercase tracking-wider font-bold ${isDark ? "text-slate-400" : "text-rose-200/60"}`}>Sec</span>
      </div>
    </div>
  );
}

function Sarees() {
  const { theme } = useTheme(); 
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

  const isDark = theme === "dark";

  // Active sales ko properly track karein
  const activeSales = sale?.filter((s) => s.active === true) || [];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Jab activeSales badle (jaise async database fetch ke baad), check karein index bounds se bahar na ho
  useEffect(() => {
    if (currentBannerIndex >= activeSales.length) {
      setCurrentBannerIndex(0);
    }
  }, [activeSales.length, currentBannerIndex]);

  // 🔄 Automatic Banner Autoplay Logic (Har 5 Second me automatically badlega)
  useEffect(() => {
    if (activeSales.length <= 1) return;

    const autoplay = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev === activeSales.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(autoplay);
  }, [activeSales.length]);

  const currentBanner = activeSales[currentBannerIndex];

  // Functional Updates lagaye taaki stale state ka bug na aaye
  const nextBanner = (e) => {
    e.stopPropagation(); // Event bubble out na ho
    setCurrentBannerIndex((prev) => (prev === activeSales.length - 1 ? 0 : prev + 1));
  };

  const prevBanner = (e) => {
    e.stopPropagation();
    setCurrentBannerIndex((prev) => (prev === 0 ? activeSales.length - 1 : prev - 1));
  };

  const filterSarees = sarees.filter((saree) => {
    const matchName = !searchName || saree.name.toLowerCase().includes(searchName.toLowerCase());
    const matchColor = !searchColor || saree.color.toLowerCase() === searchColor.toLowerCase();
    const matchFabric = !searchFabric || saree.fabric.toLowerCase() === searchFabric.toLowerCase();
    const matchMinimumPrice = !searchMinimumPrice || saree.price >= Number(searchMinimumPrice);
    const matchMaximumPrice = !searchMaximumPrice || saree.price <= Number(searchMaximumPrice);

    return matchName && matchColor && matchFabric && matchMinimumPrice && matchMaximumPrice;
  });

  const sortedSarees = [...filterSarees].sort((a, b) => {
    if (sortBy === "priceLowToHigh") return a.price - b.price;
    if (sortBy === "priceHighToLow") return b.price - a.price;
    if (sortBy === "newest") return b.id - a.id;
    return 0;
  });

  return (
    <div className={`min-h-screen px-4 md:px-12 py-8 transition-all duration-300 ${
      isDark ? "bg-slate-950" : "bg-gray-50"
    }`}>
      
      {/* Sales Carousel Banner */}
      {activeSales.length > 0 && currentBanner && (
        <div className="relative mb-10 group/banner">
          <div className={`relative overflow-hidden text-white rounded-2xl shadow-md p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[160px] border ${
            isDark 
              ? "bg-gradient-to-r from-slate-900 via-purple-950 to-slate-950 border-slate-800" 
              : "bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 border-amber-500/20"
          }`}>
            <div className="absolute right-0 top-0 text-9xl opacity-5 font-serif select-none pointer-events-none transform translate-x-10 -translate-y-5">
              ✨
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto dynamic-banner-fade">
              <div className={`h-16 w-16 rounded-full flex-shrink-0 flex items-center justify-center text-3xl shadow-inner animate-bounce duration-1000 ${
                isDark ? "bg-slate-800" : "bg-white/10"
              }`}>
                🎉
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest animate-pulse ${
                    isDark ? "bg-amber-600 text-slate-950" : "bg-amber-500 text-rose-950"
                  }`}>
                    Live Event {activeSales.length > 1 && `(${currentBannerIndex + 1}/${activeSales.length})`}
                  </span>
                  <span className={`font-semibold text-xs tracking-wider ${isDark ? "text-amber-400" : "text-amber-300"}`}>
                    Limited Time Boutique Offer
                  </span>
                </div>
                <h2 className={`text-xl md:text-2xl font-serif font-bold tracking-wide mt-1 ${isDark ? "text-slate-100" : "text-white"}`}>
                  {currentBanner.saleName}
                </h2>
                <p className={`text-xs mt-1 max-w-xl font-medium ${isDark ? "text-slate-400" : "text-rose-100/80"}`}>
                  {currentBanner.description || currentBanner.discription || "Exclusive discount active site-wide."}
                </p>
              </div>
            </div>

            <div className={`flex flex-col sm:flex-row items-center justify-between lg:justify-end w-full lg:w-auto border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-8 gap-6 ${
              isDark ? "border-slate-800" : "border-white/10"
            }`}>
              <div className="text-center sm:text-left lg:text-right">
                <span className={`text-[10px] uppercase tracking-widest block font-bold ${isDark ? "text-slate-400" : "text-rose-200"}`}>Flat Discount</span>
                <span className={`text-3xl md:text-4xl font-extrabold font-serif tracking-tight ${isDark ? "text-amber-500" : "text-amber-400"}`}>
                  {currentBanner.discount}% OFF
                </span>
              </div>
              
              {currentBanner.endDate && (
                <BannerTimer 
                  endDate={currentBanner.endDate} 
                  onExpire={() => setCurrentBannerIndex(0)}
                  isDark={isDark}
                />
              )}
            </div>
          </div>

          {activeSales.length > 1 && (
            <>
              {/* Opacity zero standard ko hatakar group hover logic ko clean kiya taaki humesha responsive click pakad sake */}
              <button onClick={prevBanner} className={`absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border flex items-center justify-center text-white text-sm backdrop-blur-sm cursor-pointer lg:opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 z-10 ${
                isDark ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700" : "bg-black/30 hover:bg-black/60 border-white/10"
              }`}>❮</button>
              <button onClick={nextBanner} className={`absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border flex items-center justify-center text-white text-sm backdrop-blur-sm cursor-pointer lg:opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 z-10 ${
                isDark ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700" : "bg-black/30 hover:bg-black/60 border-white/10"
              }`}>❯</button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {activeSales.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                      index === currentBannerIndex 
                        ? "w-4 bg-amber-400" 
                        : isDark ? "w-1.5 bg-slate-700 hover:bg-slate-500" : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Content Body */}
      {sarees.length === 0 ? (
        <div className={`flex flex-col items-center justify-center min-h-[30vh] font-serif ${isDark ? "text-slate-500" : "text-gray-500"}`}>
          <h2 className={`text-2xl font-semibold ${isDark ? "text-slate-300" : "text-gray-700"}`}>No Sarees Available At The Moment</h2>
          <p className={`text-sm mt-2 ${isDark ? "text-slate-500" : "text-gray-400"}`}>Please check back later or contact admin.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-10">
            <h1 className={`text-3xl font-bold font-serif uppercase tracking-wider ${isDark ? "text-rose-400" : "text-rose-900"}`}>Our Exclusive Collection</h1>
            <p className={`text-xs font-medium tracking-wide mt-1 ${isDark ? "text-slate-400" : "text-gray-400"}`}>Handwoven masterpieces curation crafted by generational heritage artisans</p>
            <div className={`h-0.5 w-16 mx-auto mt-3 ${isDark ? "bg-amber-600" : "bg-amber-500"}`}></div>
          </div>

          {/* Filter Layout */}
          <div className={`p-5 rounded-2xl border shadow-sm mb-10 transition-colors duration-300 ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
          }`}>
            <div className={`flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-gray-400"}`}>
              <span>🎛️ Filter & Sort Catalog</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <input type="text" placeholder="🔍 Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`} />
              <input type="text" placeholder="🎨 Search by Color" value={searchColor} onChange={(e) => setSearchColor(e.target.value)} className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`} />
              <input type="text" placeholder="🧵 Search by Fabric" value={searchFabric} onChange={(e) => setSearchFabric(e.target.value)} className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`} />
              <input type="number" placeholder="₹ Min Price" value={searchMinimumPrice} onChange={(e) => setSearchMinimumPrice(e.target.value)} className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`} />
              <input type="number" placeholder="₹ Max Price" value={searchMaximumPrice} onChange={(e) => setSearchMaximumPrice(e.target.value)} className={`w-full px-4 py-2.5 text-xs border rounded-xl focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"}`} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`w-full px-4 py-2.5 text-xs border rounded-xl font-semibold cursor-pointer focus:outline-none ${isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
                <option value="">Sort By</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => { setSearchName(""); setSearchColor(""); setSearchFabric(""); setSearchMinimumPrice(""); setSearchMaximumPrice(""); setSortBy(""); }} className={`text-xs font-semibold underline cursor-pointer ${isDark ? "text-rose-400 hover:text-rose-300" : "text-rose-900 hover:text-rose-950"}`}>Clear All Filters</button>
            </div>
          </div>

          {/* Saree Collection Grid */}
          <div>
            {sortedSarees.length === 0 ? (
              <div className={`text-center py-16 rounded-2xl border border-dashed transition-colors duration-300 ${
                isDark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-gray-200 text-gray-400"
              }`}>
                <h2 className="text-xl font-serif font-semibold">No Sarees Match Your Filters</h2>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {sortedSarees.map((saree) => {
                  const discountedPrice = Math.round(saree.price - (saree.price * saree.discountPercentage) / 100);
                  const hasDiscount = saree.discountPercentage > 0;

                  return (
                    <div key={saree.id} className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md border flex flex-col group transition-all duration-300 ${
                      isDark ? "bg-slate-900 border-slate-800/80" : "bg-white border-gray-100"
                    }`}>
                      <div className={`relative overflow-hidden aspect-[3/4] ${isDark ? "bg-slate-800" : "bg-gray-100"}`}>
                        <img src={saree.image} alt={saree.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {saree.stock < 5 && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border ${
                              isDark ? "bg-red-950/90 text-red-400 border-red-900/40" : "bg-red-50 text-red-600 border-red-100"
                            }`}>
                              Low Stock ({saree.stock})
                            </span>
                          )}
                          {hasDiscount && <span className="bg-amber-500 dark:bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">{saree.discountPercentage}% OFF</span>}
                        </div>
                        <span className={`absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-md ${
                          isDark ? "bg-slate-950/80 text-slate-200" : "bg-black/60 text-white"
                        }`}>{saree.fabric}</span>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <h3 className={`text-base font-bold font-serif line-clamp-1 flex-grow ${isDark ? "text-slate-100" : "text-gray-800"}`}>{saree.name}</h3>
                          <div className="flex flex-col text-right min-w-[80px]">
                            {hasDiscount ? (
                              <>
                                <span className={`text-[11px] line-through font-semibold ${isDark ? "text-slate-500" : "text-gray-400"}`}>₹{saree.price}</span>
                                <span className={`text-base font-extrabold leading-none ${isDark ? "text-rose-400" : "text-rose-900"}`}>₹{discountedPrice}</span>
                              </>
                            ) : (
                              <span className={`text-base font-extrabold ${isDark ? "text-rose-400" : "text-rose-900"}`}>₹{saree.price}</span>
                            )}
                          </div>
                        </div>
                        <p className={`text-xs line-clamp-2 mb-5 leading-relaxed flex-grow ${isDark ? "text-slate-400" : "text-gray-500"}`}>{saree.description || "Authentic traditional handloom work."}</p>
                        
                        <div className={`mt-auto pt-3 border-t ${isDark ? "border-slate-800/60" : "border-gray-50"}`}>
                          {role === "customer" && (
                            <button onClick={() => addFavourites(saree)} className={`w-full flex items-center justify-center gap-2 border px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer ${
                              isDark 
                                ? "border-rose-400 text-rose-400 hover:bg-rose-400 hover:text-slate-950" 
                                : "border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white"
                            }`}>❤️ Add to Favourites</button>
                          )}
                          {role === "admin" && (
                            <div className="w-full flex gap-3">
                              <button onClick={() => navigate(`/edit-saree/${saree.id}`)} className={`w-1/2 flex items-center justify-center border px-3 py-2 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
                                isDark ? "border-amber-900/50 text-amber-400 hover:bg-amber-950/30" : "border-amber-200 text-amber-700 hover:bg-amber-50"
                              }`}>📝 Edit</button>
                              <button onClick={() => deleteSaree(saree.id)} className={`w-1/2 flex items-center justify-center border px-3 py-2 text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer ${
                                isDark 
                                  ? "bg-red-950/40 hover:bg-red-900/30 text-red-400 border-red-900/40" 
                                  : "bg-red-50 hover:bg-red-100 text-red-600 border-red-100"
                              }`}>🗑️ Delete</button>
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
        </>
      )}
    </div>
  );
}

export default Sarees;