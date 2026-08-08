import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";

const SaleContext = createContext();

const API = axios.create({
  baseURL: "http://localhost:5000/api/sales",
  withCredentials: true,
});

function SaleProvider({ children }) {
  const { role, userId } = useAuth();
  const [sale, setSale] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMySale = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = role === "admin" ? "/" : "/active";

      const response = await API.get(endpoint);

      const responseData =
        response.data?.sales || response.data?.data || response.data;

      const salesData = Array.isArray(responseData)
        ? responseData
        : responseData
          ? [responseData]
          : [];

      setSale(salesData);
    } catch (err) {
      console.error("Sales Fetch Error:", err);

      setError(err.response?.data?.message || "Failed to fetch sales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySale();
  }, [userId]);

  // Create Sale
  const addSale = async (salePayload) => {
    try {
      setLoading(true);

      const formattedData = {
        title: salePayload.title || salePayload.saleName,
        description: salePayload.description || "",
        discountType: salePayload.discountType || "percentage",
        discountValue: Number(
          salePayload.discountValue || salePayload.discount,
        ),
        startDate: salePayload.startDate,
        endDate: salePayload.endDate,
      };

      const response = await API.post("/", formattedData);

      await fetchMySale();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message: err.response?.data?.message || "Failed to create sale.",
      };
    } finally {
      setLoading(false);
    }
  };

  // Update Sale
  const toggleSale = async (id, updatedFields = {}) => {
    try {
      const response = await API.patch(`/${id}`, updatedFields);
      await fetchMySale();
      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message: err.response?.data?.message || "Failed to update sale.",
      };
    }
  };

  // Delete Sale
  const removeSale = async (id) => {
    try {
      const response = await API.delete(`/${id}`);

      await fetchMySale();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message: err.response?.data?.message || "Failed to delete sale.",
      };
    }
  };

  return (
    <SaleContext.Provider
      value={{
        sale,
        loading,
        error,
        addSale,
        toggleSale,
        removeSale,
        refreshSale: fetchMySale,
      }}
    >
      {children}
    </SaleContext.Provider>
  );
}

export function useSale() {
  return useContext(SaleContext);
}

export { SaleProvider };
