import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      return setError("Fill all fields");
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);
      const role = res.data.role?.toUpperCase();

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      navigate(role === "ADMIN" ? "/dashboard" : "/home");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
    bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* CARD */}
      <div className="w-full max-w-md p-8 rounded-2xl 
      bg-gray-900/80 border border-gray-700
      shadow-2xl space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-400">
            Agro App 🌱
          </h1>
          <p className="text-gray-400 text-sm">
            Smart Farming System
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-center text-white">
          Welcome Back 👋
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg 
          bg-gray-800 text-white placeholder-gray-400
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg 
            bg-gray-800 text-white placeholder-gray-400
            outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg 
          bg-green-500 hover:bg-green-600
          text-white font-semibold transition"
        >
          {loading ? "Logging..." : "Login"}
        </button>

        {/* 🔥 FORGOT PASSWORD (NEW POSITION) */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-green-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* SIGNUP */}
        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;