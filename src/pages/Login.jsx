import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function Login() {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "customer") return <Navigate to="/customer" replace />;

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-rose-50 via-white to-amber-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-900 to-amber-500"></div>

        {/* Branding & Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-rose-900 uppercase tracking-widest">
            Saree-Store
          </h1>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
            Boutique Hub Management
          </p>
          <div className="h-0.5 w-12 bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* Informative Subtext */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-800 font-serif">Welcome Back Portal</h2>
          <p className="text-xs text-gray-500 mt-1">Please select your operational role to enter the dashboard system.</p>
        </div>

        {/* Action Buttons Container */}
        <div className="space-y-4">
          
          {/* Customer Login Option Card */}
          <button
            onClick={() => {
              setRole("customer");
              navigate("/customer");
            }}
            className="w-full group text-left border border-gray-200 hover:border-rose-900 p-4 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer hover:bg-rose-50/30 shadow-sm"
          >
            <div>
              <span className="block text-sm font-bold text-gray-800 group-hover:text-rose-900 transition-colors">
                Enter as Customer
              </span>
              <span className="block text-xs text-gray-400 group-hover:text-gray-500 mt-0.5">
                Browse collection, request designs & favorites
              </span>
            </div>
            <div className="w-8 h-8 bg-rose-50 group-hover:bg-rose-900 rounded-full flex items-center justify-center text-rose-900 group-hover:text-white transition-all">
              🛍️
            </div>
          </button>

          {/* Admin Login Option Card */}
          <button
            onClick={() => {
              setRole("admin");
              navigate("/admin");
            }}
            className="w-full group text-left border border-gray-200 hover:border-amber-600 p-4 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer hover:bg-amber-50/20 shadow-sm"
          >
            <div>
              <span className="block text-sm font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
                Access Admin Terminal
              </span>
              <span className="block text-xs text-gray-400 group-hover:text-gray-500 mt-0.5">
                Manage sarees inventory & approve requests
              </span>
            </div>
            <div className="w-8 h-8 bg-amber-50 group-hover:bg-amber-600 rounded-full flex items-center justify-center text-amber-600 group-hover:text-white transition-all">
              ⚙️
            </div>
          </button>

        </div>

        {/* Minimalist Footer */}
        <div className="mt-8 pt-5 border-t border-gray-100 text-center text-[11px] text-gray-400">
          Secure Store Operations &copy; {new Date().getFullYear()} ZariSaree Inc.
        </div>

      </div>
    </div>
  );
}

export default Login;