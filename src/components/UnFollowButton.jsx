import { useState } from "react";
import { unfollowAdmin } from "../api/friendsSystem";
import { useTheme } from "../context/ThemeContext";

/**
 * Reusable Unfollow Button Component
 *
 * @param {string} adminId - The MongoDB ID of the admin/user to unfollow
 * @param {function} onUnfollowSuccess - Optional callback triggered after successful API call: (adminId, response) => {}
 * @param {string} size - Button size variant: "sm" | "md" | "lg" (default: "md")
 * @param {string} label - Button text label (default: "Unfollow")
 */
function UnfollowButton({
  adminId,
  onUnfollowSuccess,
  size = "md",
  label = "Unfollow",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(false);

  const handleUnfollow = async (e) => {
    if (e) e.stopPropagation();

    if (!adminId || loading) return;

    setLoading(true);

    try {
      const response = await unfollowAdmin(adminId);

      if (onUnfollowSuccess) {
        onUnfollowSuccess(adminId, response);
      }
    } catch (error) {
      console.error("Failed to unfollow admin:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Size Classes
  const sizeClasses =
    {
      sm: "px-3 py-1 text-[11px]",
      md: "px-4 py-1.5 text-xs",
      lg: "px-5 py-2 text-sm",
    }[size] || "px-4 py-1.5 text-xs";

  return (
    <button
      onClick={handleUnfollow}
      disabled={loading}
      className={`font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-60 ${sizeClasses} ${
        isDark
          ? "border-red-900/60 text-red-400 hover:bg-red-950/40"
          : "border-red-200 text-red-600 hover:bg-red-50"
      }`}
    >
      {loading ? (
        <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        label
      )}
    </button>
  );
}

export default UnfollowButton;