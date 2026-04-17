import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = localStorage.getItem("role");

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded transition cursor-pointer ${
      isActive
        ? "bg-green-500 text-white"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <div className="min-h-screen flex flex-col 
      bg-gray-100 dark:bg-gray-950 
      text-gray-900 dark:text-gray-100 transition-colors">

      {/* NAVBAR */}
      <Navbar
        toggleSidebar={
          role === "ADMIN"
            ? () => setSidebarOpen(!sidebarOpen)
            : null
        }
      />

      <div className="flex flex-1">

        {/* SIDEBAR */}
        {role === "ADMIN" && sidebarOpen && (
          <div className="w-60 p-4 
            bg-white dark:bg-gray-900 
            text-gray-900 dark:text-white 
            border-r border-gray-300 dark:border-gray-700">

            <nav className="flex flex-col gap-2">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/customers" className={linkClass}>Customers</NavLink>
              <NavLink to="/products" className={linkClass}>Products</NavLink>
              <NavLink to="/credits" className={linkClass}>Credits</NavLink>
            </nav>
          </div>
        )}

        {/* ❌ REMOVE PADDING FROM HERE */}
        <div className="flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;