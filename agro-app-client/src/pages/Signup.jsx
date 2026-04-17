import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../api/authApi";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("⚠️ सभी फील्ड भरें");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signupUser(form);
      navigate("/login");
    } catch {
      setError("❌ Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* 🔥 CARD */}
      <div className="w-[360px] p-8 rounded-3xl 
      bg-white/10 backdrop-blur-xl border border-white/20 
      shadow-2xl">

        {/* BRAND */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-400">
            उन्नतशील बीज भंडार 🌱
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            अपना खाता बनाएं
          </p>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center mb-4 text-white">
          🚀 Signup करें
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* NAME */}
        <input
          placeholder="👤 नाम"
          className="w-full mb-3 p-3 rounded-xl 
          bg-white/20 text-white placeholder-gray-300
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
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

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="🔑 Password"
          className="w-full mb-4 p-3 rounded-xl 
          bg-white/20 text-white placeholder-gray-300
          outline-none focus:ring-2 focus:ring-green-400"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-2 rounded-xl 
          bg-gradient-to-r from-green-500 to-green-600 
          hover:scale-105 active:scale-95
          text-white font-semibold transition"
        >
          {loading ? "⏳ बन रहा है..." : "Signup"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-sm text-center mt-5 text-gray-300">
          पहले से खाता है?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;