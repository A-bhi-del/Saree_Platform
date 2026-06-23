import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || [],
  );

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  function addNotification(newNotification) {
    setNotifications((prev) => [newNotification, ...prev]);
  }

  function removeNotification(id) {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }

  function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item,
      ),
    );
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
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
