import { useState, useEffect } from "react";

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

export default BannerTimer;