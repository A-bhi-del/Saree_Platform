import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRole, children }) {
  const { role } = useAuth();
  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedRoute;
