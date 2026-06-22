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
    <nav className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-4 bg-white shadow-sm border-b border-gray-100 font-sans">
      
      {/* Brand Logo */}
      <div className="mb-4 md:mb-0">
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-widest text-rose-900 uppercase font-serif"
        >
          Saree-Store
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm font-medium text-gray-700">
        <Link 
          to="/sarees" 
          className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200"
        >
          Sarees
        </Link>

        {/* Customer Links */}
        {role === "customer" && (
          <>
            <Link to="/customer" className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200">
              Dashboard
            </Link>
            <Link to="/favourites-page" className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200">
              Favourites
            </Link>
            <Link to="/request-saree" className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200">
              Add Request
            </Link>
          </>
        )}

        {/* Admin Links */}
        {role === "admin" && (
          <>
            <Link to="/admin" className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200">
              Admin Panel
            </Link>
            <Link to="/admin/add-saree" className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200">
              Add Saree
            </Link>
            <Link to="/request" className="hover:text-rose-900 border-b-2 border-transparent hover:border-amber-500 pb-1 transition-all duration-200">
              Requests
            </Link>
          </>
        )}

        {/* Auth Action Button */}
        {role !== null ? (
          <button 
            onClick={handleLogout} 
            className="ml-2 bg-rose-900 hover:bg-rose-950 text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            LogOut
          </button>
        ) : (
          <Link 
            to="/" 
            className="ml-2 bg-rose-900 hover:bg-rose-950 text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;