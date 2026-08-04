import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const { role } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const isAdmin = role === "admin";

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        {
          email: formData.email,
        },
      );

      setToast(response.data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: formData.email,
          otp,
        },
      );

      setIsOtpVerified(true);
      setToast(
        response.data.message || "Email verified! Complete registration below.",
      );
      setStep(3);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "OTP Verification failed.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!isOtpVerified) {
      setError("Please verify your email via OTP first!");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role || "customer",
      address: formData.address,
      phone: formData.phone,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload,
      );

      setToast(
        response.data.message ||
          "Registered successfully! Redirecting to login...",
      );
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/customer");
        }
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl bg-emerald-600 text-white font-medium text-sm border border-emerald-400/40 animate-bounce">
          <span className="bg-white/20 p-1 rounded-full text-xs">✓</span>
          <span>{toast}</span>
        </div>
      )}

      <div
        className={`min-h-[calc(100vh-70px)] flex items-center justify-center p-4 py-10 transition-colors duration-300 ${
          isDark
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
            : "bg-gradient-to-br from-rose-50 via-white to-amber-50/30"
        }`}
      >
        <div
          className={`w-full max-w-lg rounded-2xl border p-6 md:p-8 relative overflow-hidden transition-all duration-300 ${
            isDark
              ? "bg-slate-900/90 border-slate-800 shadow-2xl shadow-black/50 backdrop-blur-md"
              : "bg-white/90 border-gray-100 shadow-xl shadow-gray-200/50 backdrop-blur-md"
          }`}
        >
          {/* Top Line */}
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
              {isAdmin ? "⚙️ Operational Portal" : "🛍️ Boutique Access"}
            </span>

            <h2
              className={`text-2xl font-bold font-serif ${
                isDark ? "text-slate-100" : "text-gray-900"
              }`}
            >
              {isAdmin ? "Admin Account Setup" : "Customer Registration"}
            </h2>
            <p
              className={`text-xs mt-1 ${
                isDark ? "text-slate-400" : "text-gray-500"
              }`}
            >
              {step === 1 && "Step 1: Enter your email address"}
              {step === 2 && "Step 2: Enter code sent to your inbox"}
              {step === 3 && "Step 3: Fill personal & access details"}
            </p>
          </div>

          {/* Dynamic Error Alert with Direct Login Button */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-medium space-y-2">
              <div>⚠️ {error}</div>
              {/* If user is already registered or error suggests existing account */}
              {(error.toLowerCase().includes("registered") ||
                error.toLowerCase().includes("exists")) && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors"
                >
                  Click here to Login Now →
                </button>
              )}
            </div>
          )}

          {/* STEP 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
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
                  placeholder="John@example.com"
                  value={formData.email}
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
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${
                  isAdmin
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950"
                    : "bg-gradient-to-r from-rose-900 to-rose-800 text-white"
                } disabled:opacity-50`}
              >
                {loading ? "Sending OTP..." : "Send Verification OTP"}
              </button>

              {/* DIRECT LOGIN OPTION AT STEP 1 */}
              <div className="pt-2 text-center border-t border-slate-800/40">
                <span
                  className={`text-xs ${
                    isDark ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className={`text-xs font-bold underline transition-colors ${
                    isAdmin
                      ? isDark
                        ? "text-amber-400 hover:text-amber-300"
                        : "text-amber-700 hover:text-amber-800"
                      : isDark
                        ? "text-rose-400 hover:text-rose-300"
                        : "text-rose-900 hover:text-rose-950"
                  }`}
                >
                  Sign In Directly →
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Enter Verification Code (OTP)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    setError("");
                    setOtp(e.target.value);
                  }}
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
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${
                  isAdmin
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950"
                    : "bg-gradient-to-r from-rose-900 to-rose-800 text-white"
                } disabled:opacity-50`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-slate-400 hover:underline"
              >
                Change Email Address
              </button>
            </form>
          )}

          {/* STEP 3: Register Form */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark
                      ? "bg-slate-950/60 border-slate-800 text-slate-100"
                      : "bg-gray-50/50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-xs font-semibold mb-1 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Email (Verified)
                  </label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={formData.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold mb-1 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-950/60 border-slate-800 text-slate-100"
                        : "bg-gray-50/50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? "text-slate-300" : "text-gray-700"
                  }`}
                >
                  Shipping Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Flat, Street, City, Pincode"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    isDark
                      ? "bg-slate-950/60 border-slate-800 text-slate-100"
                      : "bg-gray-50/50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        ? "bg-slate-950/60 border-slate-800 text-slate-100"
                        : "bg-gray-50/50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-semibold mb-1 ${
                      isDark ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isDark
                        ? "bg-slate-950/60 border-slate-800 text-slate-100"
                        : "bg-gray-50/50 border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 mt-2 rounded-xl text-sm font-bold shadow-md transition-all ${
                  isAdmin
                    ? "bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950"
                    : "bg-gradient-to-r from-rose-900 to-rose-800 text-white"
                } disabled:opacity-50`}
              >
                {loading ? "Completing Setup..." : "Complete Registration"}
              </button>
            </form>
          )}

          {/* Bottom Back Button */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className={`text-xs font-semibold hover:underline transition-colors ${
                isDark ? "text-slate-400" : "text-gray-600"
              }`}
            >
              ← Back to Role Selection
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
