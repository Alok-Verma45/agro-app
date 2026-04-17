import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const role = localStorage.getItem("role");

  const linkClass = ({ isActive }) =>
    `flex items-center ${
      collapsed ? "justify-center" : "gap-3"
    } px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-green-500 text-white shadow-md"
        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="min-h-screen flex flex-col 
      bg-gray-100 dark:bg-gray-950 
      text-gray-900 dark:text-gray-100 transition-all duration-300">

      {/* NAVBAR */}
      <Navbar
        toggleSidebar={
          role === "ADMIN"
            ? () => setSidebarOpen(!sidebarOpen)
            : null
        }
      />

      <div className="flex flex-1">

        {/* 🔥 SIDEBAR */}
        {role === "ADMIN" && sidebarOpen && (
          <div
            className={`${
              collapsed ? "w-20" : "w-64"
            } p-4 bg-white dark:bg-gray-900 
            border-r border-gray-300 dark:border-gray-700
            shadow-lg transition-all duration-300 flex flex-col`}
          >
            {/* TOP */}
            <div className="flex items-center justify-between mb-6">
              {!collapsed && (
                <h2 className="text-lg font-semibold text-green-500">
                  📊 प्रबंधन
                </h2>
              )}

              {/* COLLAPSE BUTTON */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-gray-500 hover:text-white cursor-pointer"
              >
                {collapsed ? "➡️" : "⬅️"}
              </button>
            </div>

            {/* NAV */}
            <nav className="flex flex-col gap-2">

              <NavLink to="/dashboard" className={linkClass}>
                <span>📊</span>
                {!collapsed && "डैशबोर्ड"}
              </NavLink>

              <NavLink to="/customers" className={linkClass}>
                <span>👥</span>
                {!collapsed && "ग्राहक"}
              </NavLink>

              <NavLink to="/products" className={linkClass}>
                <span>📦</span>
                {!collapsed && "उत्पाद"}
              </NavLink>

              <NavLink to="/credits" className={linkClass}>
                <span>💰</span>
                {!collapsed && "उधारी"}
              </NavLink>

            </nav>
          </div>
        )}

        {/* CONTENT */}
        <div className="flex-1 transition-all duration-300">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;