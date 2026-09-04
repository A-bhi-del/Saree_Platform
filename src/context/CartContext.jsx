import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  getCartCount,
  updateCart,
  removeFromCart,
  clearCart,
  validateCart,
} from "../api/cartSystem.js"; // Adjust relative API path

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCart();
      const cartData = res.data?.data || res.data;
      setCart(cartData);
      console.log(res.data);

      // Fetch dynamic badge count
      const countRes = await getCartCount();
      setCartCount(countRes.data?.data?.count || countRes.data?.count || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.response?.data?.message || "Failed to load shopping cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCart = async (sareeId, quantity) => {
    try {
      await updateCart({ quantity }, sareeId);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update item quantity.");
    }
  };

  const handleRemoveFromCart = async (sareeId) => {
    try {
      await removeFromCart(sareeId);
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear cart.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        error,
        fetchCart,
        handleUpdateCart,
        handleRemoveFromCart,
        handleClearCart,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);