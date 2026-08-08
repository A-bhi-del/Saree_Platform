import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

const NotificationContext = createContext();

const API = axios.create({
  baseURL: "http://localhost:5000/api/notifications",
  withCredentials: true,
});

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/");
      // console.log(response.data.data);

      if (response.data.success) {
        setNotifications(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch notifications."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on Mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Remove Notification
  const removeNotification = async (id) => {
    try {
      await API.delete(`/${id}`);

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);

      throw new Error(
        err.response?.data?.message ||
          "Failed to delete notification."
      );
    }
  };

  // Mark Single Notification Read
  const markAsRead = async (id) => {
    try {
      await API.patch(`/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error(
        "Error marking notification as read:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          "Failed to mark notification as read."
      );
    }
  };

  // ==========================
  // Mark All Notifications Read
  // ==========================
  const markAllAsRead = async () => {
    try {
      await API.patch("/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Error marking all notifications as read:",
        err
      );

      throw new Error(
        err.response?.data?.message ||
          "Failed to mark all notifications as read."
      );
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,

        fetchNotifications,

        removeNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

function useNotification() {
  return useContext(NotificationContext);
}

export { NotificationProvider, useNotification };