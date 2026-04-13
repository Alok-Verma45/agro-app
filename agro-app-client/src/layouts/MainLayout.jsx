import { Outlet, NavLink } from "react-router-dom";

function MainLayout() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive ? "bg-green-500 text-white" : "text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 min-h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Agro App 🌱</h2>

        <nav className="flex flex-col gap-2">
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/customers" className={linkClass}>
            Customers
          </NavLink>
          <NavLink to="/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/credits" className={linkClass}>
            Credits
          </NavLink>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;