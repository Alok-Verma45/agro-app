import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔥 VALIDATION FUNCTION
  const validate = () => {
    if (!form.email || !form.password) {
      return "⚠️ सभी फील्ड भरें (Fill all fields)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "⚠️ सही Email डालें (Enter valid email)";
    }

    if (form.password.length < 4) {
      return "⚠️ Password कम से कम 4 characters का होना चाहिए";
    }

    return null;
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);
      const role = res.data.role?.toUpperCase();

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      if (role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }

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

      {/* 🔥 CARD */}
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl 
      bg-white/10 backdrop-blur-xl border border-white/20 
      shadow-2xl">

        {/* 🌱 BRAND */}
        <div className="text-center mb-6">
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
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4 text-white">
          🔐 लॉगिन करें (Login)
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* 📧 EMAIL */}
        <input
          type="email"
          placeholder="📧 Email"
          className="w-full mb-3 p-3 rounded-xl 
          bg-white/20 text-white placeholder-gray-300
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* 🔑 PASSWORD WITH TOGGLE */}
        <div className="relative mb-4">
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

          {/* 👁️ TOGGLE ICON */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-300 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* 🚀 BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2.5 rounded-xl 
          bg-gradient-to-r from-green-500 to-green-600 
          hover:scale-105 active:scale-95
          disabled:opacity-50
          text-white font-semibold transition"
        >
          {loading
            ? "⏳ लॉगिन हो रहा है..."
            : "Login (लॉगिन करें)"}
        </button>

        {/* 🔗 SIGNUP */}
        <p className="text-xs sm:text-sm text-center mt-5 text-gray-300">
          खाता नहीं है? (Don't have an account?){" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;