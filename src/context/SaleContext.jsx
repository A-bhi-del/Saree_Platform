import { createContext, use, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";

const SaleContext = createContext();

function SaleProvider({ children }) {
  const { addNotification } = useNotification();
  const [sale, setSale] = useState(
    JSON.parse(localStorage.getItem("sale")) || [],
  );

  useEffect(() => {
    localStorage.setItem("sale", JSON.stringify(sale));
  }, [sale]);

  function addSale(s) {
    // console.log("sale start");
    setSale((prev) => [...prev, s]);
    // console.log("before noti");
    addNotification({
      id: Date.now(),
      type: "sale-alert",
      data: {
        saleId: s.id,
        title: s.saleName,
        discountPercentage: s.discount,
      },

      senderRole: "admin",
      receiverRole: "customer",

      title: "Sale started",
      message: `${s.saleName} - Flat ${s.discount}% OFF`,

      route: "/sarees",
      read: false,
      createdAt: new Date().toISOString(),
    });

    // console.log("after noti");
  }

  function toggleSale(id) {
    setSale((prev) =>
      prev.map((sale) =>
        sale.id === id ? { ...sale, active: !sale.active } : sale,
      ),
    );
  }

  function removeSale(id){
    setSale((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <SaleContext.Provider value={{ sale, addSale, toggleSale, removeSale }}>
      {children}
    </SaleContext.Provider>
  );
}

function useSale() {
  return useContext(SaleContext);
}

export { SaleProvider, useSale };
