import { use, useState } from "react";
import { createContext } from "react-router-dom";

const SaleContext = createContext();

function SaleProvider(){
    const [sale, setSale] = useState(JSON.parse(localStorage.getItem("sale")) || []);

    useEffect(() => {
        localStorage.setItem("sale", JSON.stringify(sale));
    }, [sale]);

    function addSale(){
        setSale((prev) => [...prev, sale]);
    }

    function toggleSale(id){
        setSale((prev) => prev.map((sale) => sale.id === id ? {...sale, active: !sale.active} : sale));
    }
    
    return (
        <SaleContext.Provider value={{sale, addSale, toggleSale}}>{children}</SaleContext.Provider>
    )
}

function useSale(){
    return useContext(SaleContext);
}

export {SaleProvider, useSale};