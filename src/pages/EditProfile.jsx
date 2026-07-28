import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

function EditProfile() {
  const { role } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "",
    shopName: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        const user = res.data.message;
        console.log(user);

        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          address: user.address || "",
          profileImage: user.profileImage || "",
          shopName: user.shopName || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = { ...formData };

    if (role !== "admin") {
      delete payload.shopName;
    }

    try {
      const res = await axios.patch(
        "http://localhost:5000/api/auth/edit-profile",
        payload,
        {
          withCredentials: true,
        },
      );
      setMessage(res.data.message || "Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"}`}
      >
        <p className="animate-pulse font-medium">Loading form...</p>
      </div>
    );
  }

  const inputStyle = `w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
    theme === "dark"
      ? "bg-slate-900 border-slate-700 text-slate-100"
      : "bg-white border-gray-200 text-gray-800"
  }`;

  return (
    <div
      className={`min-h-[calc(100vh-80px)] p-6 md:p-12 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-800"}`}
    >
      <div
        className={`max-w-xl mx-auto rounded-2xl p-6 md:p-8 shadow-xl border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}
      >
        <h2 className="text-xl font-bold font-serif mb-6 text-center">
          Edit Profile
        </h2>

        {message && (
          <div className="mb-4 p-3 rounded-lg text-xs font-semibold text-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-400">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputStyle}
            />
          </div>

          {/* Conditional Shop Name Field (Admin only) */}
          {role === "admin" && (
            <div>
              <label className="block text-xs font-semibold uppercase mb-1 text-amber-500">
                Shop Name (Admin Only)
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Enter shop name"
                className={`${inputStyle} border-amber-500/40 focus:ring-amber-500/50`}
              />
            </div>
          )}

          {/* Phone Field */}
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-400">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className={inputStyle}
            />
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-400">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
              placeholder="Enter full address"
              className={inputStyle}
            />
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-400">
              Profile Image URL
            </label>
            <input
              type="url"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className={inputStyle}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-md ${
                theme === "dark"
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
              } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
