import { useState } from "react";
import { followAdmin } from "../api/friendsSystem";
import { useTheme } from "../context/ThemeContext";

/**
 * Reusable Follow / Unfollow Button Component
 *
 * @param {string} adminId - The MongoDB ID of the admin/user to follow/unfollow
 * @param {boolean} initialIsFollowing - Initial follow status (default: false)
 * @param {function} onStatusChange - Optional callback triggered when status changes: (newStatus) => {}
 * @param {string} size - Button size variant: "sm" | "md" | "lg" (default: "md")
 */
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

  const handleToggleFollow = async (e) => {
    // Prevent event bubbling if the button is inside a clickable card
    if (e) e.stopPropagation();

    if (!adminId || loading) return;

    // Optimistic UI update
    const previousState = isFollowing;
    const nextState = !previousState;

    setIsFollowing(nextState);
    setLoading(true);

    try {
      const response = await followAdmin(adminId);

      // Trigger optional callback with response or updated state
      if (onStatusChange) {
        onStatusChange(nextState, response);
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
      // Revert to previous state if API call fails
      setIsFollowing(previousState);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Size Classes
  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px]",
    md: "px-4 py-1.5 text-xs",
    lg: "px-5 py-2 text-sm",
  }[size] || "px-4 py-1.5 text-xs";

  // Dynamic Theme & State Classes
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
      disabled={loading}
      className={`font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 ${sizeClasses} ${getButtonStyles()}`}
    >
      {loading ? (
        <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
      ) : isFollowing ? (
        "Following"
      ) : (
        "+ Follow"
      )}
    </button>
  );
}

export default FollowButton;