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
      navigate("/home"); // 🔥 ya dashboard bhi kar sakte ho based on role
    } else {
      navigate("/login");
    }
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div
      className="sticky top-0 z-50 
      bg-gray-900 text-white 
      border-b border-gray-700 
      shadow-sm px-6 py-3 flex justify-between items-center"
    >
      {/* LEFT (LOGO CLICKABLE) */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition"
      >
        <h1 className="text-xl md:text-2xl font-semibold text-gray-200 tracking-wide">
  उन्नतशील बीज भंडार <span className="text-green-400">🌱</span>
</h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="px-3 py-1 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* AUTH BUTTONS */}
        {!isAuthPage && !token && (
          <>
            <Link
              to="/login"
              className="text-gray-300 hover:text-white cursor-pointer transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer transition"
            >
              Signup
            </Link>
          </>
        )}

        {/* LOGOUT */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded cursor-pointer transition"
          >
            Logout
          </button>
        )}

        {/* SIDEBAR TOGGLE (ADMIN ONLY) */}
        {toggleSidebar && role === "ADMIN" && (
          <button
            onClick={toggleSidebar}
            className="px-3 py-1 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
