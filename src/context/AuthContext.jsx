import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [role, setRole] = useState(JSON.parse(localStorage.getItem("role")));

  useEffect(() => {
    localStorage.setItem("role", JSON.stringify(role));
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
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
