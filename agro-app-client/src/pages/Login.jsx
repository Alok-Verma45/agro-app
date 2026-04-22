import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 form submit fix

    if (!form.email || !form.password) {
      return setError("⚠️ सभी फील्ड भरें (Fill all fields)");
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
      setError("❌ गलत जानकारी (Invalid credentials)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    px-4 sm:px-6
    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* 🔥 FORM WRAPPER */}
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl 
        bg-white/10 backdrop-blur-xl border border-white/20 
        shadow-2xl space-y-6"
      >

        {/* 🌱 BRAND */}
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-green-400">
            उन्नतशील बीज भंडार 🌱
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm mt-1">
            आपका डिजिटल कृषि साथी <br />
            <span className="text-gray-400">
              (Your Digital Farming Partner)
            </span>
          </p>
        </div>

        {/* 🔐 TITLE */}
        <h2 className="text-lg sm:text-xl font-semibold text-center text-white">
          🔐 लॉगिन करें (Login)
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        {/* 📧 EMAIL */}
        <input
          type="email"
          placeholder="📧 Email"
          className="w-full p-3 rounded-xl 
          bg-white/20 text-white placeholder-gray-300
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* 🔑 PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="🔑 Password"
            className="w-full p-3 rounded-xl 
            bg-white/20 text-white placeholder-gray-300
            outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-300 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* 🔥 FORGOT PASSWORD */}
        <div className="text-right -mt-2">
          <Link
            to="/forgot-password"
            className="text-xs text-green-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* 🚀 BUTTON */}
        <button
          type="submit" // 🔥 important
          disabled={loading}
          className="w-full py-2.5 rounded-xl 
          bg-gradient-to-r from-green-500 to-green-600 
          hover:scale-105 active:scale-95
          disabled:opacity-50
          text-white font-semibold transition flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading
            ? "लॉगिन हो रहा है..."
            : "Login (लॉगिन करें)"}
        </button>

        {/* 🔗 SIGNUP */}
        <p className="text-xs sm:text-sm text-center text-gray-300">
          खाता नहीं है? (Don't have an account?){" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;