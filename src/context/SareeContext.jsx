import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";

const SareeContext = createContext();

function SareeProvider({ children }) {
  const { addNotification } = useNotification();
  const [sarees, setSarees] = useState(
    JSON.parse(localStorage.getItem("sarees")) || [],
  );

  useEffect(() => {
    localStorage.setItem("sarees", JSON.stringify(sarees));
  }, [sarees]);

  function addSaree(newSaree) {
    setSarees((prev) => [...prev, newSaree]);

    addNotification({
      id: Date.now(),
      type: "new-saree",
      data: {
        id: newSaree.id,
        name: newSaree.name,
        price: newSaree.price,
        fabric: newSaree.fabric,
      },
      senderRole: "admin",
      receiverRole: "customer",
      title: "New Saree Added",
      message: `${newSaree.name} is now available`,
      route: "/sarees",
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  function deleteSaree(id) {
    setSarees((prev) => prev.filter((saree) => saree.id !== id));
  }

  function updateSaree(updatedSaree) {
    setSarees((prev) =>
      prev.map((saree) =>
        saree.id === updatedSaree.id ? updatedSaree : saree,
      ),
    );

    const oldSaree = sarees.find((saree) => saree.id === updatedSaree.id);

    if (oldSaree.discountPercentage !== updatedSaree.discountPercentage) {
      addNotification({
        type: "discount",

        data: {
          sareeId: updatedSaree.id,
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
  }

  return (
    <SareeContext.Provider
      value={{
        sarees,
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
