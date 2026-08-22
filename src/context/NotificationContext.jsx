import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";

import axios from "axios";
import { socket } from "../socket/socket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

const API = axios.create({
    baseURL: "http://localhost:5000/api/notifications",
    withCredentials: true,
});

function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await API.get("/");

            console.log(response.data);
            if (response.data.success) {
                setNotifications(
                    response.data.data || []
                );
            }
        } catch (err) {
            console.error(
                "Error fetching notifications:",
                err
            );
            setError(
                err.response?.data?.message ||
                "Failed to fetch notifications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user?._id) return;
        fetchNotifications();
    }, [user?._id, fetchNotifications]);


    // REAL-TIME SOCKET
    useEffect(() => {
        if (!user?._id) return;
        socket.connect();
        socket.emit("register", {
            userId: user._id,
            role: user.role,
        });

        const handleNewNotification = (
            notification
        ) => {
            console.log(
                "New notification:",
                notification
            );

            setNotifications((prev) => {
                const exists = prev.some(
                    (item) =>
                        item._id === notification._id
                );
                if (exists) {
                    return prev;
                }
                return [
                    notification,
                    ...prev,
                ];
            });
        };

        socket.on(
            "new-notification",
            handleNewNotification
        );

        return () => {
            socket.off(
                "new-notification",
                handleNewNotification
            );
            socket.disconnect();
        };
    }, [user?._id, user?.role]);

    const removeNotification = async (id) => {
        try {
            await API.delete(`/${id}`);

            setNotifications((prev) =>
                prev.filter(
                    (notification) =>
                        notification._id !== id
                )
            );

        } catch (err) {
            console.error(
                "Error deleting notification:",
                err
            );

            throw new Error(
                err.response?.data?.message ||
                "Failed to delete notification."
            );

        }
    };

    const markAsRead = async (id) => {
        try {
            await API.patch(`/${id}/read`);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification._id === id
                        ? {
                            ...notification,
                            isRead: true,
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

    const markAllAsRead = async () => {
        try {
            await API.patch("/read-all");
            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );

        } catch (err) {
            console.error(
                "Error marking all notifications as read:",
                err
            );

            throw new Error(
                err.response?.data?.message ||
                "Failed to mark notification as read."
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


export {
    NotificationProvider,
    useNotification,
};