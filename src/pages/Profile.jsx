import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { theme } = useTheme();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <p className="animate-pulse font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <p>User details not found.</p>
      </div>
    );
  }

  // Handle arrays or numeric counts safely
  const followersCount = Array.isArray(user.followers)
    ? user.followers.length
    : user.followers || 0;
  const followingCount = Array.isArray(user.following)
    ? user.following.length
    : user.following || 0;

  return (
    <div
      className={`min-h-[calc(100vh-80px)] p-6 md:p-12 transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`max-w-2xl mx-auto rounded-2xl p-6 md:p-8 shadow-xl border ${
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
        }`}
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200 dark:border-slate-700">
          <div className="relative">
            <img
              src={
                user.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-rose-500/20 shadow-md"
            />
            {user.isVerified && (
              <span
                className="absolute bottom-0 right-0 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow"
                title="Verified User"
              >
                ✓
              </span>
            )}
          </div>

          <div className="text-center sm:text-left flex-grow">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold font-serif">{user.name}</h2>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  user.role === "admin"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                }`}
              >
                {user.role}
              </span>
            </div>
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {user.email}
            </p>

            {/* Followers & Following Bar with Navigation Links */}
            <div className="flex items-center justify-center sm:justify-start gap-6 mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/50">
              <Link
                to="/admin-followers"
                className="text-center sm:text-left hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <span className="font-bold text-base block sm:inline mr-1 group-hover:text-rose-500 transition-colors">
                  {followersCount}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium group-hover:underline">
                  Followers
                </span>
              </Link>
              
              <Link
                to="/admin-followings"
                className="text-center sm:text-left hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <span className="font-bold text-base block sm:inline mr-1 group-hover:text-rose-500 transition-colors">
                  {followingCount}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-400 font-medium group-hover:underline">
                  Following
                </span>
              </Link>
            </div>
          </div>

          <Link
            to="/edit-profile"
            className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors shadow ${
              theme === "dark"
                ? "bg-rose-700 hover:bg-rose-600 text-white"
                : "bg-rose-900 hover:bg-rose-950 text-white"
            }`}
          >
            Edit Profile
          </Link>
        </div>

        {/* Details Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Admin-only Shop Name display */}
          {user.role === "admin" && (
            <div
              className={`p-4 rounded-xl border col-span-1 md:col-span-2 ${
                theme === "dark"
                  ? "bg-slate-800/50 border-amber-500/30"
                  : "bg-amber-50/50 border-amber-200"
              }`}
            >
              <span className="text-xs uppercase font-bold text-amber-600 dark:text-amber-400">
                Shop Name
              </span>
              <p className="text-base font-semibold mt-0.5">
                {user.shopName || "N/A"}
              </p>
            </div>
          )}

          <div
            className={`p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-slate-800/40 border-slate-700"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <span className="text-xs uppercase font-bold text-gray-400">
              Phone
            </span>
            <p className="font-medium mt-0.5">
              {user.phone || "Not specified"}
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              theme === "dark"
                ? "bg-slate-800/40 border-slate-700"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            <span className="text-xs uppercase font-bold text-gray-400">
              Address
            </span>
            <p className="font-medium mt-0.5">
              {user.address || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;