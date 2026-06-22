import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import AddSaree from "../pages/AddSaree";
import CustomerDashboard from "../pages/CustomerDashboard";
import Sarees from "../pages/Sarees";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import RequestSaree from "../pages/RequestSaree";
import Requests from "../pages/Requests";

function AppRoutes() {
  const { setRole } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Login setRole={setRole} />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-saree"
        element={
          <ProtectedRoute allowedRole="admin">
            <AddSaree />
          </ProtectedRoute>
        }
      />

      {/* <Route path="/admin" element={<AdminDashboard />} /> */}
      {/* <Route path="/admin/add-saree" element={<AddSaree />} /> */}
      {/* <Route path="/customer" element={<CustomerDashboard />} /> */}

      <Route path="/sarees" element={<Sarees />} />

      <Route
        path="/request-saree"
        element={
          <ProtectedRoute allowedRole="customer">
            <RequestSaree />
          </ProtectedRoute>
        }
      />

      <Route
        path="/request"
        element={
          <ProtectedRoute allowedRole="admin">
            <Requests />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;
