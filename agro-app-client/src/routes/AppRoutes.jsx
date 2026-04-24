import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import OrderDetails from "../pages/OrderDetails";
import Checkout from "../pages/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Credits from "../pages/Credits";
import BillingPage from "../pages/BillingPage";
import AdminUsers from '../pages/AdminUsers';
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import AdminOrders from "../pages/AdminOrders";

// 🔥 ADMIN PROTECTED
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");

  if (!role || role !== "ADMIN") {
    return <Navigate to="/home" />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* APP */}
      <Route element={<MainLayout />}>
        {/* USER */}
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
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

        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <AdminRoute>
              <Customers />
            </AdminRoute>
          }
        />

        {/* 🔥 NEW BILLING ROUTE */}
        <Route
          path="/billing"
          element={
            <AdminRoute>
              <BillingPage />
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
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
