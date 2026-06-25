import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "customer") return <Navigate to="/customer" replace />;

  return (
    <div className={`min-h-[calc(100vh-70px)] flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" 
        : "bg-gradient-to-br from-rose-50 via-white to-amber-50/30"
    }`}>
      <div className={`w-full max-w-md rounded-2xl border p-8 md:p-10 relative overflow-hidden transition-all duration-300 ${
        isDark 
          ? "bg-slate-900 border-slate-800 shadow-2xl shadow-black/40" 
          : "bg-white border-gray-100 shadow-xl shadow-gray-200/50"
      }`}>
        
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-900 to-amber-500"></div>

        {/* Branding & Logo Area */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold font-serif uppercase tracking-widest ${
            isDark ? "text-rose-400" : "text-rose-900"
          }`}>
            Saree-Store
          </h1>
          <p className={`text-xs font-medium uppercase tracking-wider mt-1 ${isDark ? "text-slate-500" : "text-gray-400"}`}>
            Boutique Hub Management
          </p>
          <div className="h-0.5 w-12 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Informative Subtext */}
        <div className="text-center mb-8">
          <h2 className={`text-lg font-semibold font-serif ${isDark ? "text-slate-200" : "text-gray-800"}`}>
            Welcome Back Portal
          </h2>
          <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            Please select your operational role to enter the dashboard system.
          </p>
        </div>

        {/* Action Buttons Container */}
        <div className="space-y-4">
          
          {/* Customer Login Option Card */}
          <button
            onClick={() => {
              setRole("customer");
              navigate("/customer");
            }}
            className={`w-full group text-left border p-4 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm ${
              isDark 
                ? "border-slate-800 hover:border-rose-500 hover:bg-rose-950/20" 
                : "border-gray-200 hover:border-rose-900 hover:bg-rose-50/30"
            }`}
          >
            <div>
              <span className={`block text-sm font-bold transition-colors ${
                isDark ? "text-slate-200 group-hover:text-rose-400" : "text-gray-800 group-hover:text-rose-900"
              }`}>
                Enter as Customer
              </span>
              <span className={`block text-xs mt-0.5 transition-colors ${
                isDark ? "text-slate-500 group-hover:text-slate-400" : "text-gray-400 group-hover:text-gray-500"
              }`}>
                Browse collection, request designs & favorites
              </span>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isDark 
                ? "bg-rose-950/60 text-rose-400 group-hover:bg-rose-500 group-hover:text-white" 
                : "bg-rose-50 text-rose-900 group-hover:bg-rose-900 group-hover:text-white"
            }`}>
              🛍️
            </div>
          </button>

          {/* Admin Login Option Card */}
          <button
            onClick={() => {
              setRole("admin");
              navigate("/admin");
            }}
            className={`w-full group text-left border p-4 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm ${
              isDark 
                ? "border-slate-800 hover:border-amber-500 hover:bg-amber-950/20" 
                : "border-gray-200 hover:border-amber-600 hover:bg-amber-50/20"
            }`}
          >
            <div>
              <span className={`block text-sm font-bold transition-colors ${
                isDark ? "text-slate-200 group-hover:text-amber-400" : "text-gray-800 group-hover:text-amber-700"
              }`}>
                Access Admin Terminal
              </span>
              <span className={`block text-xs mt-0.5 transition-colors ${
                isDark ? "text-slate-500 group-hover:text-slate-400" : "text-gray-400 group-hover:text-gray-500"
              }`}>
                Manage sarees inventory & approve requests
              </span>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isDark 
                ? "bg-amber-950/60 text-amber-400 group-hover:bg-amber-500 group-hover:text-white" 
                : "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
            }`}>
              ⚙️
            </div>
          </button>

        </div>

        {/* Minimalist Footer */}
        <div className={`mt-8 pt-5 border-t text-center text-[11px] ${
          isDark ? "border-slate-800 text-slate-500" : "border-gray-100 text-gray-400"
        }`}>
          Secure Store Operations &copy; {new Date().getFullYear()} ZariSaree Inc.
        </div>

      </div>
    </div>
  );
}

export default Login;