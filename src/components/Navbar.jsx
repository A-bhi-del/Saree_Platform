import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to={"/"}>Login</Link>
      <Link to={"/admin"}>Admin</Link>
      <Link to={"/customer"}>Customer</Link>
      <Link to={"/sarees"}>Sarees</Link>
    </nav>
  );
}

export default Navbar;
