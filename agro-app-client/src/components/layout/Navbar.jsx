import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../../api/cartApi";

function Navbar({ toggleSidebar }) {
  const [dark, setDark] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // =====================
  // THEME
  // =====================
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const isDark =
      document.documentElement.classList.contains("dark");

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

  // =====================
  // CART
  // =====================
  const fetchCart = async () => {
    try {
      const res = await getCart();

      const qty =
        res.data.items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) || 0;

      setCartCount(qty);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (token && role === "USER") {
      fetchCart();
    }
  }, [token, role]);

  useEffect(() => {
    const update = () => fetchCart();

    window.addEventListener("cartUpdated", update);

    return () =>
      window.removeEventListener("cartUpdated", update);
  }, []);

  // =====================
  // HELPERS
  // =====================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const goHome = () => {
    if (!token) {
      navigate("/login");
      return;
    }

    navigate(role === "ADMIN" ? "/dashboard" : "/home");
  };

  const tooltip = (text) => (
    <span
      className="
      hidden md:block
      absolute top-full mt-2 left-1/2 -translate-x-1/2
      px-2 py-1 rounded-lg text-xs whitespace-nowrap
      bg-black text-white
      opacity-0 group-hover:opacity-100
      transition z-50 pointer-events-none
    "
    >
      {text}
    </span>
  );

  const navBtn = (path, label) => {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => {
          navigate(path);
          setMobileMenu(false);
        }}
        className={`group relative px-4 py-2 rounded-xl text-sm transition ${
          active
            ? "bg-green-500/20 text-green-400"
            : "bg-white/5 text-gray-300 hover:bg-white/10"
        }`}
      >
        {label}
        {tooltip(label)}
      </button>
    );
  };

  return (
    <>
      <header
        className="
        sticky top-0 z-50
        bg-slate-950/90
        border-b border-white/10
        backdrop-blur-xl text-white
      "
      >
        <div
          className="
          h-16 px-3 sm:px-6
          max-w-[1700px] mx-auto
          flex items-center justify-between
        "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={goHome}
              className="
              group relative
              w-10 h-10 rounded-2xl
              bg-gradient-to-r from-green-500 to-emerald-500
              flex items-center justify-center
            "
            >
              🌱
              {tooltip("Home")}
            </button>

            <div className="hidden sm:block">
              <h1 className="font-bold">Agro App</h1>

              <p className="text-[11px] text-gray-400">
                Smart Farming
              </p>
            </div>
          </div>

          {/* DESKTOP USER NAV */}
          {token && role === "USER" && (
            <div className="hidden md:flex items-center gap-2">
              {navBtn("/home", "Home")}
              {navBtn("/orders", "Orders")}
              {navBtn("/products", "Shop")}
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* USER CART */}
            {token && role === "USER" && (
              <button
                onClick={() => navigate("/cart")}
                className="
                group relative
                w-10 h-10 rounded-xl
                bg-white/5 hover:bg-white/10
              "
              >
                🛒
                {tooltip("Cart")}

                {cartCount > 0 && (
                  <span
                    className="
                    absolute -top-1 -right-1
                    min-w-[18px] h-[18px]
                    rounded-full bg-green-500
                    text-[10px]
                    flex items-center justify-center
                  "
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="
              group relative
              w-10 h-10 rounded-xl
              bg-white/5 hover:bg-white/10
            "
            >
              {dark ? "☀️" : "🌙"}
              {tooltip("Theme")}
            </button>

            {/* LOGOUT DESKTOP ONLY */}
            {token && !(role === "USER") && (
              <button
                onClick={logout}
                className="
                group relative
                px-3 py-2 rounded-xl
                bg-red-600 hover:bg-red-700
                text-sm font-medium
              "
              >
                Logout
                {tooltip("Logout")}
              </button>
            )}

            {token && role === "USER" && (
              <button
                onClick={logout}
                className="
                group relative
                hidden sm:flex md:flex
                px-3 py-2 rounded-xl
                bg-red-600 hover:bg-red-700
                text-sm font-medium
              "
              >
                Logout
                {tooltip("Logout")}
              </button>
            )}

            {/* ADMIN DESKTOP QUICK */}
            {token && role === "ADMIN" && (
              <button
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="
                group relative
                hidden md:block
                px-4 py-2 rounded-xl
                bg-blue-600 hover:bg-blue-700
              "
              >
                Orders
                {tooltip("Orders")}
              </button>
            )}

            {/* USER MOBILE MENU */}
            {token && role === "USER" && (
              <button
                onClick={() =>
                  setMobileMenu(!mobileMenu)
                }
                className="
                group relative
                md:hidden
                w-10 h-10 rounded-xl
                bg-white/5 hover:bg-white/10
              "
              >
                ☰
                {tooltip("Menu")}
              </button>
            )}

            {/* ADMIN SIDEBAR BTN */}
            {toggleSidebar &&
              role === "ADMIN" && (
                <button
                  onClick={toggleSidebar}
                  className="
                  group relative
                  md:hidden
                  w-10 h-10 rounded-xl
                  bg-white/5 hover:bg-white/10
                "
                >
                  ☰
                  {tooltip("Menu")}
                </button>
              )}
          </div>
        </div>
      </header>

      {/* USER MOBILE DROPDOWN */}
      {mobileMenu &&
        token &&
        role === "USER" && (
          <div
            className="
            md:hidden
            bg-slate-950
            border-b border-white/10
            px-3 py-3
            flex flex-col gap-2
          "
          >
            {navBtn("/home", "Home")}
            {navBtn("/orders", "Orders")}
            {navBtn("/products", "Shop")}

            <button
              onClick={logout}
              className="
              px-4 py-2 rounded-xl text-sm
              bg-red-600 hover:bg-red-700 text-white
            "
            >
              Logout
            </button>
          </div>
        )}
    </>
  );
}

export default Navbar;