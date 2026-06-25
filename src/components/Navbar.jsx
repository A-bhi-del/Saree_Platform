import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { role, setRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, markAsRead, removeNotification } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const userNotifications = notifications.filter(
    (notification) => notification.receiverRole === role,
  );

  const unread_count = userNotifications.filter(
    (noti) => noti.read === false,
  ).length;

  function handleLogout() {
    setRole(null);
    navigate("/");
  }

  return (
    <nav
      className={`sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-4 shadow-sm border-b font-sans transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-gray-100 text-gray-700"
      }`}
    >
      {/* Brand Logo */}
      <div className="mb-4 md:mb-0">
        <Link
          to="/"
          className={`text-2xl font-bold tracking-widest uppercase font-serif transition-colors ${
            theme === "dark" ? "text-rose-400 hover:text-rose-300" : "text-rose-900"
          }`}
        >
          Saree-Store
        </Link>
      </div>

      {/* Navigation Links & Action Items */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm font-medium">
        {/* Regular Store Links */}
        <Link
          to="/sarees"
          className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
            theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
          }`}
        >
          Sarees
        </Link>

        {/* Customer Links */}
        {role === "customer" && (
          <>
            <Link
              to="/customer"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/favourites-page"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Favourites
            </Link>
            <Link
              to="/request-saree"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Add Request
            </Link>
          </>
        )}

        {/* Admin Links */}
        {role === "admin" && (
          <>
            <Link
              to="/admin"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Admin Panel
            </Link>
            <Link
              to="/admin/add-saree"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Add Saree
            </Link>
            <Link
              to="/request"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Requests
            </Link>
            <Link
              to="/sale-page"
              className={`border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200 ${
                theme === "dark" ? "text-slate-200 hover:text-rose-400" : "text-gray-700"
              }`}
            >
              Sales
            </Link>
          </>
        )}

        {/* Premium Notification Bell Wrapper */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-0.5 text-xl transition-colors focus:outline-none cursor-pointer ${
              theme === "dark" ? "text-slate-300 hover:text-rose-400" : "hover:text-rose-900 text-gray-700"
            }`}
          >
            🔔
            {unread_count > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                {unread_count}
              </span>
            )}
          </button>

          {/* Floating Dropdown Card */}
          {showNotifications && (
            <div
              className={`absolute right-0 mt-3 w-80 border rounded-xl shadow-xl z-50 overflow-hidden max-h-96 flex flex-col transform origin-top-right transition-all ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-white border-gray-100 text-gray-700"
              }`}
            >
              {/* Dropdown Header */}
              <div
                className={`px-4 py-3 border-b flex justify-between items-center ${
                  theme === "dark" ? "bg-slate-800/50 border-slate-700" : "bg-rose-50/50 border-gray-100"
                }`}
              >
                <span className={`font-serif font-bold text-sm ${theme === "dark" ? "text-rose-400" : "text-rose-950"}`}>
                  Notifications
                </span>
                {unread_count > 0 && (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 px-2 py-0.5 rounded-full">
                    {unread_count} New
                  </span>
                )}
              </div>

              {/* Notification List Scrollable Area */}
              <div
                className={`overflow-y-auto divide-y flex-grow max-h-72 ${
                  theme === "dark" ? "divide-slate-700" : "divide-gray-50"
                }`}
              >
                {userNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400 italic">
                    No Notifications yet.
                  </div>
                ) : (
                  userNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        markAsRead(notification.id);
                        navigate(notification.route);
                        setShowNotifications(false);
                      }}
                      className={`p-4 transition-colors cursor-pointer text-left flex flex-col gap-1 relative group/item ${
                        theme === "dark" ? "hover:bg-slate-700/50" : "hover:bg-rose-50/30"
                      } ${
                        !notification.read
                          ? theme === "dark"
                            ? "bg-amber-950/20 border-l-2 border-l-amber-500"
                            : "bg-amber-50/20 border-l-2 border-l-amber-500"
                          : ""
                      }`}
                    >
                      {/* Header Row: Title and Inline Action Buttons */}
                      <div className="flex justify-between items-start gap-4">
                        <h4
                          className={`text-xs font-bold ${
                            !notification.read
                              ? theme === "dark"
                                ? "text-rose-400"
                                : "text-rose-900"
                              : theme === "dark"
                              ? "text-slate-300"
                              : "text-gray-800"
                          }`}
                        >
                          {notification.title}
                        </h4>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              title="Mark as read"
                              className="text-[10px] text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 px-2 py-1 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              ✓ Read
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            title="Delete notification"
                            className="text-[10px] text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/60 p-1 rounded transition-colors cursor-pointer flex items-center justify-center w-5 h-5 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Content Details */}
                      {notification.type === "new-saree" && notification.data?.name && (
                        <div
                          className={`text-[11px] font-medium px-2 py-0.5 rounded w-max ${
                            theme === "dark" ? "text-rose-300 bg-rose-950/40" : "text-rose-950 bg-rose-50/60"
                          }`}
                        >
                          ✨ New Stock: {notification.data.name}
                        </div>
                      )}

                      {notification.type === "request" && notification.data?.designName && (
                        <div
                          className={`text-[11px] font-medium px-2 py-0.5 rounded w-max ${
                            theme === "dark" ? "text-amber-300 bg-amber-950/40" : "text-amber-950 bg-amber-50/60"
                          }`}
                        >
                          🧵 Request item: {notification.data.designName}
                        </div>
                      )}

                      {/* Main Message Body */}
                      <p className={`text-[11px] line-clamp-2 font-normal leading-relaxed mt-0.5 ${
                        theme === "dark" ? "text-slate-400" : "text-gray-500"
                      }`}>
                        {notification.message}
                      </p>

                      {/* Structured Localized Timestamp */}
                      <span className="text-[9px] text-gray-400 mt-1 self-end font-medium">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* 🌓 Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-all duration-200 cursor-pointer text-base hover:scale-110 ${
            theme === "dark" ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-gray-100 text-slate-700 hover:bg-gray-200"
          }`}
          title={theme === "dark" ? "Switch to light Mode" : "Switch to dark Mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Auth Action Button */}
        {role !== null ? (
          <button
            onClick={handleLogout}
            className={`ml-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer ${
              theme === "dark"
                ? "bg-rose-700 hover:bg-rose-600 text-white"
                : "bg-rose-900 hover:bg-rose-950 text-white"
            }`}
          >
            LogOut
          </button>
        ) : (
          <Link
            to="/"
            className={`ml-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-200 shadow-md hover:shadow-lg inline-block ${
              theme === "dark"
                ? "bg-rose-700 hover:bg-rose-600 text-white"
                : "bg-rose-900 hover:bg-rose-950 text-white"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;