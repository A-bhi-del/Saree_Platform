import { createContext, useContext, useEffect, useState } from "react";

const SareeContext = createContext();

function SareeProvider({ children }) {
  const [sarees, setSarees] = useState(
    JSON.parse(localStorage.getItem("sarees")) || []
  );

  useEffect(() => {
    localStorage.setItem("sarees", JSON.stringify(sarees));
  }, [sarees]);

  function addSaree(newSaree) {
    setSarees((prev) => [...prev, newSaree]);
  }

  function deleteSaree(id) {
    setSarees((prev) =>
      prev.filter((saree) => saree.id !== id)
    );
  }

  return (
    <SareeContext.Provider
      value={{
        sarees,
        addSaree,
        deleteSaree,
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