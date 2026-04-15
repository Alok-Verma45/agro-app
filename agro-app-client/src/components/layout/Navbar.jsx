import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="sticky top-0 z-50 
      bg-gray-900 text-white 
      border-b border-gray-700 
      shadow-sm px-6 py-3 flex justify-between items-center">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-green-400">
          Agro App 🌱
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* ✅ AUTH LOGIC */}
        {!isAuthPage && !token && (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Signup
            </Link>
          </>
        )}

        {/* ✅ LOGOUT */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}

        {/* Sidebar Toggle → ONLY ADMIN */}
{toggleSidebar && role === "ADMIN" && (
  <button
    onClick={toggleSidebar}
    className="px-3 py-1 bg-gray-700 rounded"
  >
    ☰
  </button>
)}
      </div>
    </div>
  );
}

export default Navbar;