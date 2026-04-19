import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api/authApi";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔥 VALIDATION
  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "⚠️ सभी फील्ड भरें (Fill all fields)";
    }

    if (form.name.length < 3) {
      return "⚠️ नाम कम से कम 3 अक्षरों का होना चाहिए";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "⚠️ सही Email डालें (Enter valid email)";
    }

    if (form.password.length < 4) {
      return "⚠️ Password कम से कम 4 characters का होना चाहिए";
    }

    if (form.password !== form.confirmPassword) {
      return "⚠️ Password match नहीं कर रहा";
    }

    return null;
  };

  const handleSignup = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signupUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch {
      setError("❌ Signup failed (साइनअप असफल)");
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
            अपना खाता बनाएं <br />
            <span className="text-gray-400">
              (Create your account)
            </span>
          </p>
        </div>

        {/* 🚀 TITLE */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4 text-white">
          🚀 Signup करें (Signup)
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* 👤 NAME */}
        <input
          placeholder="👤 नाम (Name)"
          className="w-full mb-3 p-3 rounded-xl 
          bg-white/20 text-white placeholder-gray-300
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

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

        {/* 🔑 PASSWORD */}
        <div className="relative mb-3">
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

        {/* 🔁 CONFIRM PASSWORD */}
        <input
          type={showPassword ? "text" : "password"}
          placeholder="🔁 Confirm Password"
          className="w-full mb-4 p-3 rounded-xl 
          bg-white/20 text-white placeholder-gray-300
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        {/* 🚀 BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2.5 rounded-xl 
          bg-gradient-to-r from-green-500 to-green-600 
          hover:scale-105 active:scale-95
          disabled:opacity-50
          text-white font-semibold transition"
        >
          {loading
            ? "⏳ खाता बन रहा है..."
            : "Signup (साइनअप करें)"}
        </button>

        {/* 🔗 LOGIN */}
        <p className="text-xs sm:text-sm text-center mt-5 text-gray-300">
          पहले से खाता है? (Already have an account?){" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;