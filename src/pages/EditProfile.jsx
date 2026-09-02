import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getCurrentUser, updateProfile } from "../api/authApi";

function EditProfile() {
  const { role } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    shopName: "",
  });

  // Image Upload States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await getCurrentUser();
        // Extract user object safely from response wrapper
        const user = res.data?.data;
        // console.log("user:", res.data.message);

        if (user) {
          setFormData({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            shopName: user.shopName || "",
          });

          // Extract Cloudinary profile image URL properly
          let imgUrl = "";
          if (typeof user.profileImage === "string") {
            imgUrl = user.profileImage;
          } else if (user.profileImage?.url) {
            imgUrl = user.profileImage.url;
          }

          setExistingImageUrl(imgUrl);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setMessage("Failed to load user profile data.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Handle local image file selection
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage("");
    }
  }

  function handleRemoveSelectedFile() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("phone", formData.phone.trim());
      data.append("address", formData.address.trim());

      if (role === "admin" && formData.shopName) {
        data.append("shopName", formData.shopName.trim());
      }

      // Must match multer middleware upload.single("image")
      if (selectedFile) {
        data.append("image", selectedFile);
      }

      const res = await updateProfile(data);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setMessage(res.data?.message || "Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setMessage(
        err.response?.data?.message || err.message || "Failed to update profile."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <p className="animate-pulse font-medium">Loading profile information...</p>
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
      className={`min-h-[calc(100vh-80px)] p-6 md:p-12 transition-colors duration-300 ${
        theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`max-w-xl mx-auto rounded-2xl p-6 md:p-8 shadow-xl border ${
          theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"
        }`}
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
          {/* Profile Image Avatar Preview Section */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-rose-500/50 shadow-md bg-slate-800">
              <img
                src={
                  previewUrl ||
                  existingImageUrl ||
                  "https://placehold.co/150x150?text=No+Avatar"
                }
                alt="Profile Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/150x150?text=No+Avatar";
                }}
              />
              {selectedFile && (
                <button
                  type="button"
                  onClick={handleRemoveSelectedFile}
                  className="absolute inset-0 bg-black/60 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Reset image selection"
                >
                  Change
                </button>
              )}
            </div>

            <label className="cursor-pointer bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              <span>
                {selectedFile ? "Change Selected Avatar" : "Upload New Avatar"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-[10px] text-gray-400">
              JPG, PNG, WEBP up to 5MB
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-400">
              Full Name *
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

          {/* Shop Name (Admin only) */}
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

          {/* Phone */}
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

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold uppercase mb-1 text-gray-400">
              Address *
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

          {/* Buttons */}
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
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-md flex items-center gap-2 ${
                theme === "dark"
                  ? "bg-rose-700 hover:bg-rose-600 text-white"
                  : "bg-rose-900 hover:bg-rose-950 text-white"
              } ${submitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {submitting ? (
                <>
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;