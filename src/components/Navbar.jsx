import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useState } from "react";

function Navbar() {
  const { role, setRole } = useAuth();
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
    <nav className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-4 bg-white shadow-sm border-b border-gray-100 font-sans">
      {/* Brand Logo */}
      <div className="mb-4 md:mb-0">
        <Link
          to="/"
          className="text-2xl font-bold tracking-widest text-rose-900 uppercase font-serif"
        >
          Saree-Store
        </Link>
      </div>

      {/* Navigation Links & Action Items */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm font-medium text-gray-700">
        {/* Premium Notification Bell Wrapper */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-xl hover:text-rose-900 transition-colors focus:outline-none cursor-pointer"
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
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-96 flex flex-col transform origin-top-right transition-all">
              {/* Dropdown Header */}
              <div className="bg-rose-50/50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <span className="font-serif font-bold text-rose-950 text-sm">
                  Notifications
                </span>
                {unread_count > 0 && (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {unread_count} New
                  </span>
                )}
              </div>

              {/* Notification List Scrollable Area */}
              <div className="overflow-y-auto divide-y divide-gray-50 flex-grow max-h-72">
                {/* Replace only the userNotifications mapping block inside the notification list divider */}
                {/* Replace the userNotifications mapping block with this version */}
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
                      className={`p-4 hover:bg-rose-50/30 transition-colors cursor-pointer text-left flex flex-col gap-1 relative group/item ${
                        !notification.read
                          ? "bg-amber-50/20 border-l-2 border-l-amber-500"
                          : ""
                      }`}
                    >
                      {/* Header Row: Title and Inline Action Button */}
                      <div className="flex justify-between items-start gap-4">
                        <h4
                          className={`text-xs font-bold text-gray-800 ${!notification.read ? "text-rose-900" : ""}`}
                        >
                          {notification.title}
                        </h4>

                        {/* Mark as read button - Only shows if notification is unread */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              title="Mark as read"
                              className="text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded font-semibold transition-colors cursor-pointer flex items-center gap-1"
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
                            className="text-[10px] text-red-600 bg-red-50 hover:bg-red-100 p-1 rounded transition-colors cursor-pointer flex items-center justify-center w-5 h-5 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        {/* Remove Notification Button */}
                      </div>

                      {/* Dynamic Content Details */}
                      {notification.type === "new-saree" &&
                        notification.data?.name && (
                          <div className="text-[11px] font-medium text-rose-950 bg-rose-50/60 px-2 py-0.5 rounded w-max">
                            ✨ New Stock: {notification.data.name}
                          </div>
                        )}

                      {notification.type === "request" &&
                        notification.data?.designName && (
                          <div className="text-[11px] font-medium text-amber-950 bg-amber-50/60 px-2 py-0.5 rounded w-max">
                            🧵 Request item: {notification.data.designName}
                          </div>
                        )}

                      {/* Main Message Body */}
                      <p className="text-[11px] text-gray-500 line-clamp-2 font-normal leading-relaxed mt-0.5">
                        {notification.message}
                      </p>

                      {/* Structured Localized Timestamp */}
                      <span className="text-[9px] text-gray-400 mt-1 self-end font-medium">
                        {new Date(notification.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Regular Store Links */}
        <Link
          to="/sarees"
          className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
        >
          Sarees
        </Link>

        {/* Customer Links */}
        {role === "customer" && (
          <>
            <Link
              to="/customer"
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/favourites-page"
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
            >
              Favourites
            </Link>
            <Link
              to="/request-saree"
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
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
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
            >
              Admin Panel
            </Link>
            <Link
              to="/admin/add-saree"
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
            >
              Add Saree
            </Link>
            <Link
              to="/request"
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
            >
              Requests
            </Link>
            <Link
              to="/sale-page"
              className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
            >
              Sales
            </Link>
          </>
        )}

        {/* Auth Action Button */}
        {role !== null ? (
          <button
            onClick={handleLogout}
            className="ml-2 bg-rose-900 hover:bg-rose-950 text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            LogOut
          </button>
        ) : (
          <Link
            to="/"
            className="ml-2 bg-rose-900 hover:bg-rose-950 text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
