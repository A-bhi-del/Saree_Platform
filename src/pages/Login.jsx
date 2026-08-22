import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSaree } from "../context/SareeContext";
import { useSale } from "../context/SaleContext";
import { useRequest } from "../context/RequestContext";
import { useFavourites } from "../context/FavouriteContext";
import { useNotification } from "../context/NotificationContext";
import { loginUser } from "../api/authApi";

function Login() {
  const { role, setUser } = useAuth();
  const { refreshSale } = useSale();
  const {fetchRequests} = useRequest();
  const {fetchNotifications} = useNotification();
  const {fetchFavourites} = useFavourites();
  const { getSarees } = useSaree();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const isAdmin = role === "admin";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setToast("");

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
        role: role || "customer",
      });

      const user = response.data.message.user;
      setUser(user);

      if (!user) {
        setError("Invalid response");
        return;
      }

      if (!user) {
        setError("Invalid response structure from server!");
        return;
      }

      await getSarees();
      await refreshSale();
      await fetchRequests();
      await fetchFavourites();
      await fetchNotifications();

      if (user?.role === "admin" || isAdmin) {
        setToast("Login successful! Redirecting to Admin Panel...");
        setTimeout(() => navigate("/admin"), 1200);
      } else if (user?.role === "customer") {
        setToast("Login successful! Redirecting to Customer Panel...");
        setTimeout(() => navigate("/customer"), 1200);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid credentials. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && typeof toast === "string" && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl bg-emerald-600 text-white font-medium text-sm border border-emerald-400/40 animate-bounce">
          <span className="bg-white/20 p-1 rounded-full text-xs">✓</span>
          <span>{toast}</span>
        </div>
      )}

      <div
        className={`min-h-[calc(100vh-70px)] flex items-center justify-center p-4 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-rose-50 via-white to-amber-50/30"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl border p-6 md:p-8 relative overflow-hidden transition-all duration-300 ${
            isDark
              ? "bg-slate-900/90 border-slate-800 shadow-2xl shadow-black/50 backdrop-blur-md"
              : "bg-white/90 border-gray-100 shadow-xl shadow-gray-200/50 backdrop-blur-md"
          }`}
        >
          {/* Top Line Accent */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
              isAdmin
                ? "from-amber-600 to-yellow-400"
                : "from-rose-600 to-amber-500"
            }`}
          ></div>

          {/* Header */}
          <div className="text-center mb-6">
            <span
              className={`inline-block text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-2 ${
                isAdmin
                  ? isDark
                    ? "bg-amber-950/80 text-amber-400 border border-amber-800/50"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  : isDark
                    ? "bg-rose-950/80 text-rose-400 border border-rose-800/50"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {isAdmin ? "⚙️ Admin Portal" : "🛍️ Welcome Back"}
            </span>

            <h2
              className={`text-2xl font-bold font-serif ${
                isDark ? "text-slate-100" : "text-gray-900"
              }`}
            >
              Sign In to Account
            </h2>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              Enter your email and password to access your dashboard
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className={`block text-xs font-semibold mb-1 ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDark
                    ? "bg-slate-950/60 border-slate-800 text-slate-100 focus:border-rose-500"
                    : "bg-gray-50/50 border-gray-200 text-gray-900 focus:border-rose-800"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-semibold mb-1 ${
                  isDark ? "text-slate-300" : "text-gray-700"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDark
                    ? "bg-slate-950/60 border-slate-800 text-slate-100 focus:border-rose-500"
                    : "bg-gray-50/50 border-gray-200 text-gray-900 focus:border-rose-800"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 mt-2 rounded-xl text-sm font-bold shadow-md transition-all ${
                isAdmin
                  ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:opacity-90"
                  : "bg-gradient-to-r from-rose-900 to-rose-800 text-white hover:opacity-90"
              } disabled:opacity-50`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register Link & Navigation */}
          <div className="mt-6 text-center space-y-3 pt-4 border-t border-slate-800/20">
            <p
              className={`text-xs ${
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className={`font-bold hover:underline transition-colors ${
                  isAdmin
                    ? isDark
                      ? "text-amber-400"
                      : "text-amber-700"
                    : isDark
                      ? "text-rose-400"
                      : "text-rose-900"
                }`}
              >
                Create New Account
              </Link>
            </p>

            <div>
              <Link
                to="/"
                className={`text-[11px] font-medium hover:underline ${
                  isDark ? "text-slate-500" : "text-gray-400"
                }`}
              >
                ← Back to Role Selection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
