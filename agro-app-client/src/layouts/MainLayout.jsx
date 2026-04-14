import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // 🔥 IMPORTANT

  // ✅ AUTO CLOSE SIDEBAR ON HOME PAGE
  useEffect(() => {
    if (location.pathname === "/") {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded transition ${
      isActive
        ? "bg-green-500 text-white"
        : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className="min-h-screen flex flex-col 
      bg-gray-100 dark:bg-gray-950 
      text-gray-900 dark:text-gray-100">

      {/* NAVBAR */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1">

        {/* SIDEBAR */}
        {sidebarOpen && (
          <div className="w-60 bg-gray-900 text-white p-4">
            <nav className="flex flex-col gap-2">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/customers" className={linkClass}>Customers</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <NavLink to="/credits" className={linkClass}>Credits</NavLink>
            </nav>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 bg-transparent">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;