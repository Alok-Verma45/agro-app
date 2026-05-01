import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../../api/cartApi";

function Navbar({ toggleSidebar }) {

  const [profileOpen, setProfileOpen] = useState(false);

  const [dark, setDark] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
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

  // CART
  const fetchCart = async () => {
    try {
      const res = await getCart();
      const qty =
        res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(qty);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (token && role === "USER") fetchCart();
  }, [token, role]);

  useEffect(() => {
    const update = () => fetchCart();
    window.addEventListener("cartUpdated", update);
    return () => window.removeEventListener("cartUpdated", update);
  }, []);

  // HELPERS
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const goHome = () => {
    if (!token) return navigate("/login");
    navigate(role === "ADMIN" ? "/dashboard" : "/home");
  };

  // NAV BUTTON
  const navBtn = (path, label) => {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => {
          navigate(path);
          setMobileMenu(false);
        }}
        className={`
          relative px-4 py-2 text-sm font-medium rounded-xl
          transition-all duration-300
          ${
            active
              ? "text-green-600 dark:text-green-400"
              : "text-gray-700 dark:text-gray-300 hover:text-green-500"
          }
        `}
      >
        {label}
        <span
          className={`
            absolute left-1/2 -translate-x-1/2 bottom-0
            h-[2px] bg-green-500 rounded-full
            transition-all duration-300
            ${active ? "w-6 opacity-100" : "w-0 opacity-0"}
          `}
        ></span>
      </button>
    );
  };

  return (
    <>
      <header
        className="
        sticky top-0 z-50
        bg-white/70 dark:bg-slate-900/70
        backdrop-blur-xl
        border-b border-gray-200/60 dark:border-white/10
        shadow-sm
        text-gray-800 dark:text-white
      "
      >
        <div className="h-16 px-3 sm:px-6 max-w-[1700px] mx-auto flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={goHome}
              className="
                w-10 h-10 rounded-2xl
                bg-white dark:bg-zinc-800
                flex items-center justify-center
                shadow-sm
                transition-all duration-300
                hover:scale-110 hover:shadow-green-500/30
              "
            >
              <span className="text-green-600 text-lg">🌱</span>
            </button>

            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-800 dark:text-white">
                Agro App
              </h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Smart Farming
              </p>
            </div>
          </div>

          {/* USER NAV */}
          {token && role === "USER" && (
            <div className="hidden md:flex items-center gap-2">
              {navBtn("/home", "Home")}
              {navBtn("/orders", "Orders")}
              {navBtn("/products", "Shop")}
              {navBtn("/contact", "Contact")}
            </div>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            {/* CART */}
{token && role === "USER" && (
  <button
    onClick={() => navigate("/cart")}
    className="
      relative w-10 h-10 rounded-xl
      bg-gray-200 dark:bg-zinc-800
      hover:bg-gray-300 dark:hover:bg-zinc-700
      flex items-center justify-center
      transition-all duration-200
      hover:scale-105 active:scale-95
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-gray-800 dark:text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h12M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>

    {cartCount > 0 && (
      <span
        className="
          absolute -top-1 -right-1
          min-w-[18px] h-[18px]
          rounded-full bg-green-500
          text-[10px] text-white
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
              w-10 h-10 rounded-xl
              bg-gray-100/70 dark:bg-white/5
              hover:bg-gray-200 dark:hover:bg-white/10
              backdrop-blur-md
              transition-all duration-200
              hover:scale-105 active:scale-95
            "
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {/* PROFILE */}
            {token && (
              <div className="relative">
                <button
  onClick={() => setProfileOpen(!profileOpen)}
  className="
    w-10 h-10 rounded-full
    bg-gray-100 dark:bg-zinc-800
    hover:bg-gray-200 dark:hover:bg-zinc-700
    flex items-center justify-center
    transition-all duration-200
    hover:scale-105 active:scale-95
  "
>
  <span
    className="
      text-[18px]
      filter brightness-90 dark:brightness-125
    "
  >
    👤
  </span>
</button>

                {profileOpen && (
                  <div className="
                    absolute right-0 mt-2 w-40
                    bg-white dark:bg-slate-900
                    border border-gray-200 dark:border-white/10
                    rounded-xl shadow-lg
                    overflow-hidden z-50
                  ">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileOpen(false);
                      }}
                      className="
                        w-full text-left px-4 py-2 text-sm
                        hover:bg-gray-100 dark:hover:bg-white/10
                      "
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="
                        w-full text-left px-4 py-2 text-sm
                        text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20
                      "
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN */}
            {token && role === "ADMIN" && (
              <button
                onClick={() => navigate("/admin/orders")}
                className="
                hidden md:block
                px-4 py-2 rounded-xl
                bg-blue-600 hover:bg-blue-700 text-white
                transition-all duration-200
                hover:scale-105 active:scale-95
              "
              >
                Orders
              </button>
            )}

            {/* MOBILE MENU */}
            {token && role === "USER" && (
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="
                md:hidden
                w-10 h-10 rounded-xl
                bg-gray-100/70 dark:bg-white/5
                hover:bg-gray-200 dark:hover:bg-white/10
                backdrop-blur-md
                transition-all duration-200
                hover:scale-105 active:scale-95
              "
              >
                ☰
              </button>
            )}

            {toggleSidebar && role === "ADMIN" && (
              <button
                onClick={toggleSidebar}
                className="
                md:hidden
                w-10 h-10 rounded-xl
                bg-gray-100/70 dark:bg-white/5
                hover:bg-gray-200 dark:hover:bg-white/10
                backdrop-blur-md
                transition-all duration-200
                hover:scale-105 active:scale-95
              "
              >
                ☰
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DROPDOWN */}
      {mobileMenu && token && role === "USER" && (
        <div className="
          md:hidden
          bg-white/80 dark:bg-slate-900/80
          backdrop-blur-xl
          border-b border-gray-200 dark:border-white/10
          px-3 py-3 flex flex-col gap-2
        ">
          {navBtn("/home", "Home")}
          {navBtn("/orders", "Orders")}
          {navBtn("/products", "Shop")}
          {navBtn("/contact", "Contact")}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm bg-red-600 hover:bg-red-700 text-white"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;