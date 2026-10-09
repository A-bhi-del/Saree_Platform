import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";
import AddSaree from "../pages/AddSaree";
import CustomerDashboard from "../pages/CustomerDashboard";
import Sarees from "../pages/Sarees";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import RequestSaree from "../pages/RequestSaree";
import Requests from "../pages/Requests";
import FavouritePage from "../pages/FavouritePage";
import EditSaree from "../pages/EditSaree";
import SalePage from "../pages/SalePage";
import CreateSale from "../pages/CreateSale";
import Register from "../pages/Register";
import RoleSelection from "../pages/RoleSelection";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import Followers from "../pages/Followers";
import Followings from "../pages/Following";
import Admins from "../pages/AllAdmins";
import AllActiveSale from "../pages/All_active_sales_page";
import AddToCart from "../pages/AddToCart";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";
import AdminOrders from "../pages/AdminOrders";
import OrderDetails from "../pages/OrderDetails";
import AdminCoupons from "../pages/AdminCoupons";
import CreateCoupon from "../pages/CreateCoupon";
import EditCoupon from "../pages/EditCoupon";

function AppRoutes() {
  const { setRole } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<RoleSelection setRole={setRole} />} />
      <Route path="/login" element={<Login />} />
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

      <Route
        path="/favourites-page"
        element={
          <ProtectedRoute allowedRole="customer">
            <FavouritePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sale-page"
        element={
          <ProtectedRoute allowedRole="admin">
            <SalePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-sale"
        element={
          <ProtectedRoute allowedRole="admin">
            <CreateSale />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-saree/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <EditSaree />
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />

      <Route
        path="/admin-followers"
        element={
          <ProtectedRoute allowedRole="admin">
            <Followers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-followings"
        element={
          <ProtectedRoute allowedRole="admin">
            <Followings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admins"
        element={
          <ProtectedRoute allowedRole="admin">
            <Admins />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-active-sales"
        element={
          <ProtectedRoute allowedRole="customer">
            <AllActiveSale />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRole="customer">
            <AddToCart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRole="customer">
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success"
        element={
          <ProtectedRoute allowedRole="customer">
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRole="customer">
            <MyOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminCoupons />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons/create"
        element={
          <ProtectedRoute allowedRole="admin">
            <CreateCoupon />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons/:id/edit"
        element={
          <ProtectedRoute allowedRole="admin">
            <EditCoupon />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
