import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    setRole(null);
    navigate("/");
  }

  return (
    <nav>
      {role !== null ? (
        <button onClick={handleLogout} to={"/"}>
          LogOut
        </button>
      ) : (
        <Link to={"/"}>Login</Link>
      )}

      {/* {role === "customer" && <Link to={"/customer"}>Customer Dashboard</Link>} */}

      {role === "admin" && <Link to={"/admin"}>Admin</Link>}

      {role === "admin" && <Link to={"/admin/add-saree"}>Add Saree</Link>}

      {role === "customer" && <Link to={"/customer"}>Customer</Link>}

      {role === "admin" && <Link to={"/request"}>Requests</Link>}

      {role === "customer" && <Link to={"/request-saree"}>Add Request</Link>}

      <Link to={"/sarees"}>Sarees</Link>

    </nav>
  );
}

export default Navbar;
