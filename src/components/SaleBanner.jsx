import { useState, useEffect } from "react";
import BannerTimer from "./BannerTimer";

function SalesBanner({ sale, isDark }) {
  // Filter active sales
  const activeSales = Array.isArray(sale) 
    ? sale.filter((s) => {
        const now = new Date();
        const startDate = s.startDate ? new Date(s.startDate) : null;
        const endDate = s.endDate ? new Date(s.endDate) : null;

        if (startDate && now < startDate) return false;
        if (endDate && now > endDate) return false;

        return true;
      }) 
    : [];

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (currentBannerIndex >= activeSales.length) {
      setCurrentBannerIndex(0);
    }
  }, [activeSales.length, currentBannerIndex]);

  // Carousel Autoplay
  useEffect(() => {
    if (activeSales.length <= 1) return;

    const autoplay = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev === activeSales.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(autoplay);
  }, [activeSales.length]);

  if (activeSales.length === 0) return null;

  const currentBanner = activeSales[currentBannerIndex];

  console.log(currentBanner?.admin);

  const nextBanner = (e) => {
    e.stopPropagation();
    setCurrentBannerIndex((prev) => (prev === activeSales.length - 1 ? 0 : prev + 1));
  };

  const prevBanner = (e) => {
    e.stopPropagation();
    setCurrentBannerIndex((prev) => (prev === 0 ? activeSales.length - 1 : prev - 1));
  };

  return (
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
          {/* Profile Image of the Shop / Admin */}
          <div className={`h-16 w-16 rounded-full flex-shrink-0 flex items-center justify-center text-3xl shadow-inner overflow-hidden border ${
            isDark ? "bg-slate-800 border-slate-700" : "bg-white/10 border-white/20"
          }`}>
            {currentBanner?.admin?.profileImage ? (
              <img 
                src={currentBanner.admin.profileImage} 
                alt={currentBanner.admin.shopName || "Boutique"} 
                className="w-full h-full object-cover" 
              />
            ) : (
              "🎉"
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-widest animate-pulse ${
                isDark ? "bg-amber-600 text-slate-950" : "bg-amber-500 text-rose-950"
              }`}>
                Live Event {activeSales.length > 1 && `(${currentBannerIndex + 1}/${activeSales.length})`}
              </span>
              
              <span className={`font-semibold text-xs tracking-wider ${isDark ? "text-amber-400" : "text-amber-300"}`}>
                {currentBanner?.admin?.shopName ? `By ${currentBanner.admin.shopName}` : "Limited Time Offer"}
              </span>
            </div>

            <h2 className={`text-xl md:text-2xl font-serif font-bold tracking-wide mt-1 ${isDark ? "text-slate-100" : "text-white"}`}>
              {currentBanner?.title || currentBanner?.saleName}
            </h2>

            <p className={`text-xs mt-1 max-w-xl font-medium ${isDark ? "text-slate-400" : "text-rose-100/80"}`}>
              {currentBanner?.description || "Exclusive discount active site-wide."}
            </p>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-between lg:justify-end w-full lg:w-auto border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-8 gap-6 ${
          isDark ? "border-slate-800" : "border-white/10"
        }`}>
          <div className="text-center sm:text-left lg:text-right">
            <span className={`text-[10px] uppercase tracking-widest block font-bold ${isDark ? "text-slate-400" : "text-rose-200"}`}>
              {currentBanner?.discountType === "flat" ? "Flat Off" : "Discount"}
            </span>
            <span className={`text-3xl md:text-4xl font-extrabold font-serif tracking-tight ${isDark ? "text-amber-500" : "text-amber-400"}`}>
              {currentBanner?.discountType === "flat" ? "₹" : ""}
              {currentBanner?.discountValue ?? currentBanner?.discount}
              {currentBanner?.discountType === "percentage" || !currentBanner?.discountType ? "% OFF" : " OFF"}
            </span>
          </div>
          
          {currentBanner?.endDate && (
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
  );
}

export default SalesBanner;