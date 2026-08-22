import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [role, setRole] = useState(JSON.parse(localStorage.getItem("role")));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    localStorage.setItem("role", JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await getCurrentUser();
        setUserId(res.data.message._id);
        setUser(res.data.message);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        userId,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
