import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Checkout from "../pages/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess";

import OfflineDashboard from "../pages/OfflineDashboard";
import Customers from "../pages/Customers";
import AdminProducts from "../pages/AdminProducts";
import Credits from "../pages/Credits";
import BillingPage from "../pages/BillingPage";

import AdminUsers from "../pages/AdminUsers";
import AdminUserProfile from "../pages/AdminUserProfile";
import AdminOrders from "../pages/AdminOrders";
import OnlineDashboard from "../pages/OnlineDashboard";
import Inventory from "../pages/Inventory";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// ================================
// ADMIN PROTECTED ROUTE
// ================================
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  const token = localStorage.getItem("token");

  if (!token || !role || role.toUpperCase() !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        {/* ================= USER ROUTES ================= */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* ================= ADMIN OFFLINE ================= */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <OfflineDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/offline-dashboard"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/customers"
          element={
            <AdminRoute>
              <Customers />
            </AdminRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <AdminRoute>
              <BillingPage />
            </AdminRoute>
          }
        />

        <Route
          path="/credits"
          element={
            <AdminRoute>
              <Credits />
            </AdminRoute>
          }
        />

        {/* ================= ADMIN ONLINE ================= */}
        <Route
          path="/admin/online-dashboard"
          element={
            <AdminRoute>
              <OnlineDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <AdminRoute>
              <AdminUserProfile />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        {/* ================= INVENTORY ================= */}
        <Route
          path="/inventory"
          element={
            <AdminRoute>
              <Inventory />
            </AdminRoute>
          }
        />

        {/* ================= REPORTS ================= */}
        <Route
          path="/reports"
          element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          }
        />

        {/* ================= SETTINGS ================= */}
        <Route
          path="/settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
