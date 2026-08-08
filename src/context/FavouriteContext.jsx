import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FavouriteContext = createContext();

const API = axios.create({
  baseURL: "http://localhost:5000/api/favorite-sarees",
  withCredentials: true,
});

function FavouriteProvider({ children }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/");

      setFavourites(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch favourites."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  // Add Favourite
  const addFavourites = async (saree) => {
    try {
      const response = await API.post(`/${saree._id}`);

      await fetchFavourites();

      navigate("/favourites-page");

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to add favourite.",
      };
    }
  };

  // Remove Favourite
  const removeFavourites = async (sareeId) => {
    try {
      const response = await API.delete(`/${sareeId}`);

      await fetchFavourites();

      return {
        success: true,
        message: response.data.message,
      };
    } catch (err) {
      console.error(err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to remove favourite.",
      };
    }
  };

  return (
    <FavouriteContext.Provider
      value={{
        favourites,
        loading,
        error,
        fetchFavourites,
        addFavourites,
        removeFavourites,
      }}
    >
      {children}
    </FavouriteContext.Provider>
  );
}

function useFavourites() {
  return useContext(FavouriteContext);
}

export { FavouriteProvider, useFavourites };