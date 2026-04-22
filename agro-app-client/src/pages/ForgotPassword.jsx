import { useState } from "react";
import { forgotPassword } from "../api/authApi";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 EMAIL VALIDATION
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {
    if (!email) {
      setIsError(true);
      setMsg("⚠️ Please enter email");
      return;
    }

    if (!isValidEmail(email)) {
      setIsError(true);
      setMsg("⚠️ Enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      setIsError(false);

      await forgotPassword({ email });

      setMsg("✅ Reset link sent to your email");
    } catch (err) {
      console.error(err);

      setIsError(true);
      setMsg(
        err?.response?.data?.message ||
        "❌ Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
    bg-gray-100 dark:bg-gray-900">

      <div className="w-full max-w-md p-6 rounded-2xl 
      bg-white dark:bg-gray-800 shadow-xl space-y-5">

        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Forgot Password 🔑
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* INPUT */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-lg 
          bg-gray-100 dark:bg-gray-700
          text-gray-800 dark:text-white
          outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full py-3 rounded-lg 
          bg-green-500 hover:bg-green-600 
          text-white font-medium transition
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* MESSAGE */}
        {msg && (
          <p
            className={`text-center text-sm ${
              isError
                ? "text-red-500"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {msg}
          </p>
        )}

        {/* EXTRA INFO */}
        {!isError && msg && (
          <p className="text-xs text-center text-gray-500">
            Check your spam folder if you don’t see the email
          </p>
        )}

        {/* BACK */}
        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;