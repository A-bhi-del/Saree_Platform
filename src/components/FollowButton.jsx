import { useState, useEffect } from "react";
import { followAdmin, isfollowing } from "../api/friendsSystem";
import { useTheme } from "../context/ThemeContext";

function FollowButton({
  adminId,
  initialIsFollowing = false,
  onStatusChange,
  size = "md",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkFollowStatus = async () => {
      if (!adminId) {
        setFetchingStatus(false);
        return;
      }

      try {
        setFetchingStatus(true);
        const res = await isfollowing(adminId);
        const status = typeof res?.data === "boolean" ? res.data : res?.data?.data;

        if (isMounted && typeof status === "boolean") {
          setIsFollowing(status);
        }
      } catch (error) {
        console.error("Failed to fetch follow status:", error);
      } finally {
        if (isMounted) setFetchingStatus(false);
      }
    };

    checkFollowStatus();

    return () => {
      isMounted = false;
    };
  }, [adminId]);

  const handleToggleFollow = async (e) => {
    if (e) e.stopPropagation();

    if (!adminId || loading || fetchingStatus) return;

    const previousState = isFollowing;
    const nextState = !previousState;

    setIsFollowing(nextState);
    setLoading(true);

    try {
      const response = await followAdmin(adminId);

      if (onStatusChange) {
        onStatusChange(nextState, response);
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
      setIsFollowing(previousState);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses =
    {
      sm: "px-2.5 py-1 text-[11px]",
      md: "px-4 py-1.5 text-xs",
      lg: "px-5 py-2 text-sm",
    }[size] || "px-4 py-1.5 text-xs";

  const getButtonStyles = () => {
    if (isFollowing) {
      return isDark
        ? "bg-slate-800 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border-slate-700 hover:border-red-900/60"
        : "bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-200";
    }

    return isDark
      ? "bg-rose-700 hover:bg-rose-600 text-white border-rose-600"
      : "bg-rose-900 hover:bg-rose-950 text-white border-rose-900";
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading || fetchingStatus}
      className={`font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 ${sizeClasses} ${getButtonStyles()}`}
    >
      {loading || fetchingStatus ? (
        <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
      ) : isFollowing ? (
        "Followed"
      ) : (
        "+ Follow"
      )}
    </button>
  );
}

export default FollowButton;