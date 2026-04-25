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

  // =====================================
  // THEME INIT
  // =====================================
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  // =====================================
  // FETCH CART (USER ONLY)
  // =====================================
  const fetchCart = async () => {
    try {
      const res = await getCart();

      const qty =
        res.data.items?.reduce(
          (sum, item) => sum + item.quantity,
          0
        ) || 0;

      setCartCount(qty);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (token && role === "USER") {
      fetchCart();
    }
  }, [token, role]);

  useEffect(() => {
    const handleUpdate = () => fetchCart();

    window.addEventListener(
      "cartUpdated",
      handleUpdate
    );

    return () =>
      window.removeEventListener(
        "cartUpdated",
        handleUpdate
      );
  }, []);

  // =====================================
  // HELPERS
  // =====================================
  const toggleTheme = () => {
    const isDark =
      document.documentElement.classList.contains(
        "dark"
      );

    if (isDark) {
      document.documentElement.classList.remove(
        "dark"
      );
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const goHome = () => {
    if (!token) return navigate("/login");

    if (role === "ADMIN") {
      navigate("/dashboard");
    } else {
      navigate("/home");
    }
  };

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  const navBtn = (path, label) => {
    const active = location.pathname === path;

    return (
      <button
        onClick={() => navigate(path)}
        className={`px-4 py-2 rounded-xl text-sm transition ${
          active
            ? "bg-green-500/15 text-green-400 border border-green-500/20"
            : "hover:bg-white/5 text-gray-300 hover:text-white"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <header
      className="
      sticky top-0 z-50
      border-b border-white/10
      bg-slate-950/85
      backdrop-blur-xl
      text-white
    "
    >
      <div
        className="
        max-w-[1700px] mx-auto
        px-3 sm:px-6 lg:px-8
        h-16
        flex items-center justify-between
      "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* ADMIN MOBILE SIDEBAR */}
          {toggleSidebar &&
            role === "ADMIN" && (
              <button
                onClick={toggleSidebar}
                className="
                md:hidden
                w-10 h-10 rounded-xl
                bg-white/5 hover:bg-white/10
                transition
              "
              >
                ☰
              </button>
            )}

          {/* LOGO */}
          <button
            onClick={goHome}
            className="flex items-center gap-3 group"
          >
            <div
              className="
              w-10 h-10 rounded-2xl
              bg-gradient-to-r from-green-500 to-emerald-500
              flex items-center justify-center
              text-lg shadow-lg
            "
            >
              🌱
            </div>

            <div className="text-left leading-tight">
              <h1
                className="
                text-base sm:text-xl font-bold tracking-wide
                group-hover:text-green-400 transition
              "
              >
                Agro App
              </h1>

              <p className="text-[11px] text-gray-400 mt-1 hidden sm:block">
                Smart Agriculture Commerce
              </p>
            </div>
          </button>
        </div>

        {/* CENTER USER NAV ONLY */}
        {token &&
          role === "USER" &&
          !isAuthPage && (
            <nav className="hidden lg:flex items-center gap-4">
              {navBtn("/home", "Home")}
              {navBtn("/orders", "Orders")}
            </nav>
          )}

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* USER CART ICON ONLY */}
          {token &&
            role === "USER" &&
            !isAuthPage && (
              <button
                onClick={() =>
                  navigate("/cart")
                }
                className="
                relative w-10 h-10 rounded-xl
                bg-white/5 hover:bg-white/10
                transition
              "
              >
                🛒

                {cartCount > 0 && (
                  <span
                    className="
                    absolute -top-1 -right-1
                    min-w-[20px] h-5 px-1
                    rounded-full
                    bg-green-500 text-xs
                    flex items-center justify-center
                  "
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

          {/* ADMIN BUTTONS (UNCHANGED) */}
          {token &&
            role === "ADMIN" && (
              <button
                onClick={() =>
                  navigate(
                    "/admin/orders"
                  )
                }
                className="
                hidden sm:block
                px-4 py-2 rounded-xl
                bg-blue-600 hover:bg-blue-700
                text-sm font-medium
              "
              >
                Orders
              </button>
            )}

          {/* THEME */}
          <button
            onClick={toggleTheme}
            className="
            w-10 h-10 rounded-xl
            bg-white/5 hover:bg-white/10
            transition
          "
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {/* GUEST */}
          {!token && !isAuthPage && (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl hover:bg-white/5 text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="
                px-4 py-2 rounded-xl
                bg-green-600 hover:bg-green-700
                text-sm font-medium
              "
              >
                Signup
              </Link>
            </div>
          )}

          {/* LOGOUT */}
          {token && (
            <button
              onClick={logout}
              className="
              px-3 sm:px-4 py-2 rounded-xl
              bg-red-600 hover:bg-red-700
              text-sm font-medium
            "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;