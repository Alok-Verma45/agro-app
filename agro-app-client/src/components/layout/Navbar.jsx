import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../../api/cartApi";

function Navbar({ toggleSidebar }) {
  const [dark, setDark] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🌙 THEME INIT
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

  // 🛒 FETCH CART FROM BACKEND
  const fetchCart = async () => {
    try {
      const res = await getCart();

      const totalQty =
        res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      setCartCount(totalQty);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartCount(0);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    if (token && role === "USER") {
      fetchCart();
    }
  }, [token, role]);

  // 🔥 LISTEN CART UPDATE EVENT
  useEffect(() => {
    const handleUpdate = () => fetchCart();

    window.addEventListener("cartUpdated", handleUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
    };
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
    if (token) navigate("/home");
    else navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div
      className="sticky top-0 z-50 
      bg-gray-900/80 backdrop-blur-md text-white 
      border-b border-gray-700/50 
      shadow-md px-3 sm:px-6 py-3 flex justify-between items-center"
    >
      {/* 🌱 LOGO */}
      <div
        onClick={handleLogoClick}
        className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
      >
        <h1
          className="text-sm sm:text-xl md:text-2xl font-semibold 
        tracking-wide text-gray-200 group-hover:text-green-400 transition truncate"
        >
          उन्नतशील बीज भंडार
        </h1>

        <span
          className="text-green-400 text-lg sm:text-xl 
        group-hover:scale-110 transition"
        >
          🌱
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* 🛒 CART (ONLY USER) */}
        {token && role === "USER" && !isAuthPage && (
          <button
            onClick={() => navigate("/cart")}
            className="relative px-3 py-1.5 bg-gray-800 hover:bg-gray-700 
            rounded-lg transition"
          >
            🛒
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 
              bg-green-500 text-white text-xs px-1.5 py-0.5 
              rounded-full"
              >
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* 🌙 THEME */}
        <button
          onClick={toggleTheme}
          className="px-2 sm:px-3 py-1.5 bg-gray-800 hover:bg-gray-700 
          rounded-lg transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* 🔐 AUTH */}
        {!isAuthPage && !token && (
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-green-500 hover:bg-green-600 
              text-white px-3 py-1.5 rounded-lg"
            >
              Signup
            </Link>
          </div>
        )}

        {/* 🚪 LOGOUT */}
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 
            px-2 sm:px-4 py-1.5 rounded-lg"
          >
            Logout
          </button>
        )}
        {/* Orders */}
        {token && role === "USER" && (
          <button
            onClick={() => navigate("/orders")}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg"
          >
            📦 Orders
          </button>
        )}

        {token && role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin/orders")}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
          >
            Orders
          </button>
        )}

        {/* ☰ SIDEBAR (ADMIN ONLY) */}
        {toggleSidebar && role === "ADMIN" && (
          <button
            onClick={toggleSidebar}
            className="sm:hidden px-2 py-1.5 bg-gray-800 rounded-lg"
          >
            ☰
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
