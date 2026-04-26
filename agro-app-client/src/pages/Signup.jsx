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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const navigate = useNavigate();

  // =====================
  // VALIDATION
  // =====================
  const validate = () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "Please fill all fields";
    }

    if (form.name.length < 3) {
      return "Name must be at least 3 characters";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(form.email)
    ) {
      return "Enter a valid email";
    }

    if (
      form.password.length < 4
    ) {
      return "Password must be at least 4 characters";
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      return "Passwords do not match";
    }

    return null;
  };

  const handleSignup =
    async (e) => {
      e.preventDefault();

      const validationError =
        validate();

      if (validationError) {
        setError(
          validationError
        );
        return;
      }

      setLoading(true);
      setError("");

      try {
        await signupUser({
          name: form.name,
          email: form.email,
          password:
            form.password,
        });

        navigate("/login");
      } catch {
        setError(
          "Signup failed"
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
        onSubmit={
          handleSignup
        }
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
          Create Account 🚀
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

        {/* NAME */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
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
              value={
                form.password
              }
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

        {/* CONFIRM PASSWORD */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300">
            Confirm Password
          </label>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Re-enter password"
            value={
              form.confirmPassword
            }
            onChange={(e) =>
              setForm({
                ...form,
                confirmPassword:
                  e.target.value,
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
            ? "Creating..."
            : "Signup"}
        </button>

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 font-semibold hover:text-green-300"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;