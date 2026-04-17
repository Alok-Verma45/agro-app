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

  const handleLogoClick = () => {
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="sticky top-0 z-50 
      bg-gray-900/80 backdrop-blur-md text-white 
      border-b border-gray-700/50 
      shadow-md px-6 py-3 flex justify-between items-center">

      {/* 🔥 LOGO */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-gray-200 group-hover:text-green-400 transition">
          उन्नतशील बीज भंडार
        </h1>
        <span className="text-green-400 text-xl group-hover:scale-110 transition">
          🌱
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🌙 THEME */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 
          rounded-lg transition cursor-pointer"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* AUTH */}
        {!isAuthPage && !token && (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-600 
              text-white px-4 py-1.5 rounded-lg 
              transition shadow-md"
            >
              Signup
            </Link>
          </>
        )}

        {/* LOGOUT */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 
            px-4 py-1.5 rounded-lg 
            transition shadow-md"
          >
            Logout
          </button>
        )}

        {/* ☰ ADMIN */}
        {toggleSidebar && role === "ADMIN" && (
          <button
            onClick={toggleSidebar}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 
            rounded-lg transition cursor-pointer"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;