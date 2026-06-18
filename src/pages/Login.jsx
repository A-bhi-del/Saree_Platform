import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function Login() {
    const {role, setRole} = useAuth();

  const navigate = useNavigate();
  return (
    <div>
      <h1>Saree-Hub Login</h1>
      <button
        onClick={() => {
          setRole("admin");
          navigate("/admin");
        }}
      >
        Login as Admin
      </button>
      <button
        onClick={() => {
          setRole("customer");
          navigate("/customer");
        }}
      >
        Login as Customer
      </button>
    </div>
  );
}

export default Login;
