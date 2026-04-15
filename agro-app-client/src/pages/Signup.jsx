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
      setError("All fields required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signupUser(form);
      navigate("/login");
    } catch (err) {
      setError("Signup failed");
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
          Signup 🚀
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          placeholder="Name"
          className="w-full mb-3 p-3 rounded-lg border 
          dark:bg-gray-700"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-lg border 
          dark:bg-gray-700"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg border 
          dark:bg-gray-700"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 
          text-white py-2 rounded-lg"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;