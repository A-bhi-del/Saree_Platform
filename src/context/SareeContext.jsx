import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";
import {
  fetchSareesApi,
  createSareeApi,
  updateSareeApi,
  deleteSareeApi,
} from "../api/sareeApi";

const SareeContext = createContext();

function SareeProvider({ children }) {
  const { addNotification } = useNotification();
  const [sarees, setSarees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const getSarees = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await fetchSareesApi(filters);
      setSarees(response.data.data);
      if (response.data.pagination) {
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error(
        "Error fetching sarees:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSarees();
  }, []);

  async function addSaree(newSareeData) {
    try {
      const response = await createSareeApi(newSareeData);
      const createdSaree = response.data.data;

      setSarees((prev) => [createdSaree, ...prev]);

      addNotification({
        id: Date.now(),
        type: "new-saree",
        data: {
          id: createdSaree._id,
          name: createdSaree.name,
          price: createdSaree.price,
          fabric: createdSaree.fabric,
        },
        senderRole: "admin",
        receiverRole: "customer",
        title: "New Saree Added",
        message: `${createdSaree.name} is now available`,
        route: "/sarees",
        read: false,
        createdAt: new Date().toISOString(),
      });

      console.log("Saree added:", createdSaree);

      return createdSaree;
    } catch (error) {
      console.error("Error adding saree:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async function deleteSaree(id) {
    try {
      await deleteSareeApi(id);
      setSarees((prev) => prev.filter((saree) => (saree._id || saree.id) !== id));
    } catch (error) {
      console.error("Error deleting saree:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async function updateSaree(updatedSareeData) {
    const sareeId = updatedSareeData._id || updatedSareeData.id;

    try {
      const oldSaree = sarees.find((saree) => (saree._id || saree.id) === sareeId);

      const response = await updateSareeApi(sareeId, updatedSareeData);
      const updatedSaree = response.data.data;

      setSarees((prev) =>
        prev.map((saree) =>
          (saree._id || saree.id) === sareeId ? updatedSaree : saree
        )
      );

      if (
        oldSaree &&
        oldSaree.discountPercentage !== updatedSaree.discountPercentage
      ) {
        addNotification({
          type: "discount",
          data: {
            sareeId: updatedSaree._id,
            sareeName: updatedSaree.name,
            discountPercentage: updatedSaree.discountPercentage,
          },
          senderRole: "admin",
          receiverRole: "customer",
          title: "Discount Added",
          message: `${updatedSaree.name} is now ${updatedSaree.discountPercentage}% off`,
          route: "/sarees",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      return updatedSaree;
    } catch (error) {
      console.error("Error updating saree:", error?.response?.data?.message || error.message);
      throw error;
    }
  }

  return (
    <SareeContext.Provider
      value={{
        sarees,
        loading,
        pagination,
        getSarees,
        addSaree,
        deleteSaree,
        updateSaree,
      }}
    >
      {children}
    </SareeContext.Provider>
  );
}

function useSaree() {
  return useContext(SareeContext);
}

export { SareeProvider, useSaree };