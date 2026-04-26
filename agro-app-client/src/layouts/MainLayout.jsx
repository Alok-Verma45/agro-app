import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = localStorage.getItem("role");

  const menuSectionTitle = (title) =>
    !collapsed && (
      <p className="px-3 mb-2 mt-4 text-[11px] uppercase tracking-[2px] text-gray-500 font-semibold">
        {title}
      </p>
    );

  const linkClass = ({ isActive }) =>
    `
    group relative flex items-center
    ${collapsed ? "justify-center" : "gap-3"}
    px-4 py-3 rounded-2xl
    transition-all duration-300

    ${
      isActive
        ? `
          bg-gradient-to-r from-green-500/20 to-emerald-500/10
          border border-green-400/30
          text-green-400
          shadow-lg shadow-green-500/10
        `
        : `
          text-gray-300
          hover:bg-white/5
          hover:text-white
        `
    }
  `;

  // ======================
  // MENU DATA
  // ======================
  const offlineMenu = [
    { to: "/dashboard", icon: "📊", label: "Offline Dashboard" },
    { to: "/customers", icon: "👥", label: "Customers" },
    { to: "/billing", icon: "🧾", label: "Billing" },
    { to: "/credits", icon: "💰", label: "Credits" },
  ];

  const onlineMenu = [
    {
      to: "/admin/online-dashboard",
      icon: "🌐",
      label: "Online Dashboard",
    },
    { to: "/admin/products", icon: "📦", label: "Products" },
    { to: "/admin/users", icon: "🧑‍💼", label: "Users" },
    { to: "/admin/orders", icon: "📬", label: "Orders" },
  ];

  const inventoryMenu = [{ to: "/inventory", icon: "📋", label: "Stock List" }];

  const settingsMenu = [
    { to: "/reports", icon: "📈", label: "Reports" },
    { to: "/settings", icon: "⚙️", label: "Settings" },
  ];

  const renderMenu = (items) =>
    items.map((item, index) => (
      <NavLink
        key={index}
        to={item.to}
        className={linkClass}
        onClick={() => setSidebarOpen(false)}
      >
        <span className="text-xl">{item.icon}</span>

        {!collapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}

        {/* tooltip */}
        {collapsed && (
          <span
            className="
            hidden md:block absolute left-full ml-3
            px-3 py-1.5 rounded-xl
            text-xs whitespace-nowrap
            bg-black text-white
            opacity-0 group-hover:opacity-100
            translate-x-2 group-hover:translate-x-0
            transition-all duration-200
            pointer-events-none z-50
          "
          >
            {item.label}
          </span>
        )}
      </NavLink>
    ));

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-[#020617] text-gray-900 dark:text-white transition-colors duration-300">
      {/* NAVBAR */}
      <Navbar
        toggleSidebar={
          role === "ADMIN" ? () => setSidebarOpen(!sidebarOpen) : null
        }
      />

      <div className="flex flex-1 relative">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        {role === "ADMIN" && (
          <aside
            className={`
    fixed md:static top-0 left-0 z-40 h-full

    ${collapsed ? "w-20" : "w-72 xl:w-80"}

    bg-gradient-to-b
    from-[#0f172a]
    via-[#081226]
    to-[#020617]

    border-r border-white/10
    shadow-2xl
    transition-all duration-300
    overflow-y-auto

    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-[#0f172a]/85 border-b border-white/10 px-4 py-4">
              <div className="flex items-center justify-between">
                {!collapsed ? (
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                      ⚙️ Management
                    </h2>

                    <p className="text-xs text-gray-400 mt-1 tracking-wide">
                      Premium Admin Panel
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto text-2xl">⚙️</div>
                )}

                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition"
                >
                  {collapsed ? "➡️" : "⬅️"}
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="p-2.5 pb-8">
              {/* OFFLINE */}
              {menuSectionTitle("🏪 Offline Business")}
              <div className="space-y-1.5">{renderMenu(offlineMenu)}</div>

              {/* ONLINE */}
              {menuSectionTitle("🌐 Online Store")}
              <div className="space-y-1.5 mt-3">{renderMenu(onlineMenu)}</div>

              {/* INVENTORY */}
              {menuSectionTitle("📦 Inventory")}
              <div className="space-y-1.5 mt-3">
                {renderMenu(inventoryMenu)}
              </div>

              {/* SETTINGS */}
              {menuSectionTitle("⚡ Admin Tools")}
              <div className="space-y-1.5 mt-3">{renderMenu(settingsMenu)}</div>

              {/* BUSINESS CARD */}
              {!collapsed && (
                <div className="mt-5 p-4 rounded-3xl border border-green-400/10 bg-gradient-to-r from-green-500/10 to-emerald-500/5">
                  <p className="text-green-400 font-semibold text-sm">
                    🚀 Business Tip
                  </p>

                  <p className="text-xs text-gray-300 mt-2 leading-5">
                    Separate offline + online modules improve analytics,
                    workflow and scale.
                  </p>

                  <button className="mt-4 w-full py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition">
                    Upgrade Reports
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div
              className="
              rounded-3xl
              border border-white/5
              bg-white/[0.02]
              backdrop-blur-sm
              min-h-[calc(100vh-120px)]
              p-4 sm:p-6
            "
            >
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
