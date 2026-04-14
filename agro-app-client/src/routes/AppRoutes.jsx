import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Customers from "../pages/Customers";
import Products from "../pages/Products";
import Credits from "../pages/Credits";

function AppRoutes() {
  return (
    <Routes>
      {/* ✅ ADD path="/" */}
      <Route path="/" element={<MainLayout />}>

        {/* ✅ DEFAULT PAGE */}
        <Route index element={<Home />} />

        {/* ✅ OTHER ROUTES */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Products />} />
        <Route path="credits" element={<Credits />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;