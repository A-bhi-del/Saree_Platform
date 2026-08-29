import { useEffect, useState } from "react";
import { getfollowings } from "../api/friendsSystem";
import { useTheme } from "../context/ThemeContext";
import UnfollowButton from "../components/UnFollowButton";

function Followings() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [followingsList, setFollowingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        setLoading(true);
        const res = await getfollowings();

        const list = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];

        setFollowingsList(list);
      } catch (err) {
        console.error("Error fetching followings:", err);
        setError("Failed to load followings.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowings();
  }, []);

  // Callback handler to remove unfollowed user from state
  const handleRemoveFromList = (unfollowedId) => {
    setFollowingsList((prev) =>
      prev.filter((user) => user._id !== unfollowedId)
    );
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-slate-300" : "bg-gray-50 text-gray-700"
        }`}
      >
        <p className="animate-pulse text-sm font-medium">Loading followings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          isDark ? "bg-slate-950 text-red-400" : "bg-gray-50 text-red-600"
        }`}
      >
        <p className="text-sm font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen px-4 md:px-12 py-10 transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`max-w-xl mx-auto rounded-2xl p-6 md:p-8 shadow-xl border ${
          isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className={`text-2xl font-bold font-serif uppercase tracking-wider ${
              isDark ? "text-rose-400" : "text-rose-900"
            }`}
          >
            Following ({followingsList.length})
          </h2>
          <div className="h-0.5 w-16 bg-amber-500 mx-auto mt-2"></div>
        </div>

        {/* Followings List */}
        {followingsList.length === 0 ? (
          <p
            className={`text-sm text-center py-8 ${
              isDark ? "text-slate-500" : "text-gray-400"
            }`}
          >
            You are not following anyone yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {followingsList.map((user) => {
              const { _id, name, email, profileImage } = user;

              return (
                <li
                  key={_id}
                  className={`flex items-center justify-between p-4 border rounded-xl transition-colors duration-200 ${
                    isDark
                      ? "bg-slate-800/60 border-slate-700/80"
                      : "bg-gray-50/80 border-gray-200/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          name || "User"
                        )}`
                      }
                      alt={name}
                      className={`w-11 h-11 rounded-full object-cover border-2 ${
                        isDark ? "border-slate-700" : "border-gray-200"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span
                        className={`font-semibold text-sm ${
                          isDark ? "text-slate-100" : "text-gray-800"
                        }`}
                      >
                        {name}
                      </span>
                      <span
                        className={`text-xs ${
                          isDark ? "text-slate-400" : "text-gray-500"
                        }`}
                      >
                        {email}
                      </span>
                    </div>
                  </div>

                  <UnfollowButton
                    adminId={_id}
                    onUnfollowSuccess={handleRemoveFromList}
                    size="md"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Followings;