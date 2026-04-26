import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError(
        "Please fill all fields"
      );
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);

      const role =
        res.data.role?.toUpperCase();

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "role",
        role
      );

      navigate(
        role === "ADMIN"
          ? "/dashboard"
          : "/home"
      );
    } catch {
      setError(
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex items-center justify-center
      px-4 py-4
      bg-gradient-to-br
      from-slate-950 via-slate-900 to-green-950
    "
    >
      {/* CARD */}
      <form
        onSubmit={handleLogin}
        className="
        w-full max-w-md
        rounded-3xl
        px-6 sm:px-8
        py-6
        bg-white/10
        backdrop-blur-2xl
        border border-white/10
        shadow-2xl
        space-y-5
      "
      >
        {/* TOP */}
        <div className="text-center space-y-2">
          <div
            className="
            w-14 h-14 mx-auto
            rounded-2xl
            bg-gradient-to-r from-green-500 to-emerald-500
            flex items-center justify-center
            text-2xl
            shadow-lg shadow-green-500/30
          "
          >
            🌱
          </div>

          <h1 className="text-3xl font-bold text-white">
            Agro App
          </h1>

          <p className="text-sm text-gray-300">
            Smart Agriculture Platform
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-xl font-semibold text-white">
          Welcome Back 👋
        </h2>

        {/* ERROR */}
        {error && (
          <div
            className="
            text-red-400 text-sm text-center
            py-2 rounded-xl
            bg-red-500/10 border border-red-500/20
          "
          >
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="
            w-full h-12 px-4
            rounded-2xl
            bg-white/10
            border border-white/10
            text-white placeholder-gray-400
            outline-none
            focus:ring-2 focus:ring-green-500/30
            focus:border-green-400
          "
          />
        </div>

        {/* PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Password
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password:
                    e.target.value,
                })
              }
              className="
              w-full h-12 px-4 pr-12
              rounded-2xl
              bg-white/10
              border border-white/10
              text-white placeholder-gray-400
              outline-none
              focus:ring-2 focus:ring-green-500/30
              focus:border-green-400
            "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="
              absolute right-4 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-white
            "
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </button>
          </div>
        </div>

        {/* FORGOT */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-green-400 hover:text-green-300"
          >
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
          w-full h-12
          rounded-2xl
          bg-gradient-to-r from-green-500 to-emerald-500
          text-white font-semibold
          hover:scale-[1.01]
          active:scale-[0.99]
          transition
          shadow-lg shadow-green-500/20
          disabled:opacity-60
          flex items-center justify-center gap-2
        "
        >
          {loading && (
            <span
              className="
              w-4 h-4 border-2 border-white
              border-t-transparent rounded-full
              animate-spin
            "
            ></span>
          )}

          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-green-400 font-semibold hover:text-green-300"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;