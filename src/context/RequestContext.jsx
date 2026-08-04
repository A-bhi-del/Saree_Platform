import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { useNotification } from "./NotificationContext";

const RequestContext = createContext();

const API = axios.create({
  baseURL: "http://localhost:5000/api/requests",
  withCredentials: true,
});

export function RequestProvider({ children }) {
  const { addNotification } = useNotification();

  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.get("/", {
        params: { page, limit },
      });

      if (response.data.success) {
        setRequests(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);

      setError(err.response?.data?.message || "Failed to load requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const createRequest = async (requestData) => {
    try {
      const response = await API.post("/", requestData);

      await fetchRequests();

      addNotification({
        id: Date.now(),

        type: "request",

        senderRole: "customer",
        receiverRole: "admin",

        title: "New Request",

        message: `${requestData.designName} request submitted`,

        route: "/request",

        read: false,

        createdAt: new Date().toISOString(),
      });

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      throw new Error(
        err.response?.data?.message || "Failed to submit request.",
      );
    }
  };

  const updateStatus = async (requestId, status) => {
    try {
      const response = await API.patch(`/${requestId}/status`, { status });

      await fetchRequests();

      if (status === "accepted") {
        addNotification({
          id: Date.now(),

          type: "request-approved",

          senderRole: "admin",
          receiverRole: "customer",

          title: "Request Approved",

          message: "Your request has been approved.",

          route: "/customer",

          read: false,

          createdAt: new Date().toISOString(),
        });
      } else {
        addNotification({
          id: Date.now(),

          type: "request-rejected",

          senderRole: "admin",
          receiverRole: "customer",

          title: "Request Rejected",

          message: "Your request has been rejected.",

          route: "/customer",

          read: false,

          createdAt: new Date().toISOString(),
        });
      }

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      throw new Error(
        err.response?.data?.message || "Failed to update request status.",
      );
    }
  };

  const approveRequest = (id) => updateStatus(id, "accepted");

  const rejectRequest = (id) => updateStatus(id, "rejected");

  const deleteRequest = async (requestId, role = "customer") => {
    try {
      const endpoint =
        role === "admin" ? `/admin/${requestId}` : `/customer/${requestId}`;

      const response = await API.delete(endpoint);

      await fetchRequests();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      throw new Error(
        err.response?.data?.message || "Failed to delete request.",
      );
    }
  };

  return (
    <RequestContext.Provider
      value={{
        requests,
        pagination,
        loading,
        error,
        fetchRequests,
        createRequest,
        approveRequest,
        rejectRequest,
        deleteRequest,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  return useContext(RequestContext);
}
