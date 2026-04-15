import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("All fields required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(form);

      const role = res.data.role?.toUpperCase();

      // ✅ SAVE
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      // ✅ ROLE BASED REDIRECT
      if (role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }

    } catch (err) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gray-100 dark:bg-gray-950">

      <div className="bg-white dark:bg-gray-800 
      p-8 rounded-2xl shadow-lg w-[350px]">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login 🔐
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-lg border 
          dark:bg-gray-700 dark:border-gray-600"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg border 
          dark:bg-gray-700 dark:border-gray-600"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 
          text-white py-2 rounded-lg"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-500">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;