import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop

  const role = localStorage.getItem("role");

  const linkClass = ({ isActive }) =>
    `relative flex items-center ${
      collapsed ? "justify-center" : "gap-3"
    } px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group ${
      isActive
        ? "bg-green-500/20 border border-green-400/30 text-green-400"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  const menuItems = [
    { to: "/dashboard", icon: "📊", label: "डैशबोर्ड (Dashboard)" },
    { to: "/customers", icon: "👥", label: "ग्राहक (Customers)" },
    { to: "/products", icon: "📦", label: "उत्पाद (Products)" },
    { to: "/credits", icon: "💰", label: "उधारी (Credits)" },
  ];

  return (
    <div className="min-h-screen flex flex-col 
    bg-gray-100 dark:bg-gray-950 
    text-gray-900 dark:text-gray-100">

      {/* NAVBAR */}
      <Navbar
        toggleSidebar={
          role === "ADMIN"
            ? () => setSidebarOpen(!sidebarOpen)
            : null
        }
      />

      <div className="flex flex-1 relative">

        {/* 🔥 MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 🔥 SIDEBAR */}
        {role === "ADMIN" && (
          <div
            className={`
              fixed md:static top-0 left-0 h-full z-40
              ${collapsed ? "w-20" : "w-64"}
              bg-gradient-to-b from-gray-900 to-gray-950
              border-r border-white/10
              shadow-xl transition-all duration-300 flex flex-col

              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:translate-x-0
            `}
          >
            {/* TOP */}
            <div className="flex items-center justify-between p-4 mb-4">
              {!collapsed && (
                <h2 className="text-lg font-semibold text-green-400">
                  📊 प्रबंधन (Management)
                </h2>
              )}

              {/* ❌ MOBILE PE HIDE */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:block text-gray-400 hover:text-white"
              >
                {collapsed ? "➡️" : "⬅️"}
              </button>
            </div>

            {/* NAV */}
            <nav className="flex flex-col gap-2 px-2">
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.to}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)} // mobile close
                >
                  {/* ICON */}
                  <span className="text-lg">{item.icon}</span>

                  {/* TEXT */}
                  {!collapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}

                  {/* TOOLTIP (desktop only) */}
                  {collapsed && (
                    <span
                      className="hidden md:block absolute left-full ml-3 px-3 py-1 
                      text-sm whitespace-nowrap 
                      bg-black text-white rounded-md shadow-lg
                      opacity-0 group-hover:opacity-100 
                      translate-x-2 group-hover:translate-x-0
                      transition-all duration-200 pointer-events-none z-50"
                    >
                      {item.label}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {/* 🔥 CONTENT */}
        <div className="flex-1 transition-all duration-300">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
}

export default MainLayout;