import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/authApi";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token");

  // 🔥 PASSWORD RULES
  const rules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const strength = Object.values(rules).filter(Boolean).length;

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const isValid = strength >= 3 && password === confirm;

  const handleReset = async () => {
    if (!token) {
      setIsError(true);
      setMsg("❌ Invalid or expired link");
      return;
    }

    if (!isValid) {
      setIsError(true);
      setMsg("⚠️ Please fix password requirements");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      setIsError(false);

      await resetPassword({
        token,
        newPassword: password,
      });

      setMsg("✅ Password updated successfully");

      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      setIsError(true);
      setMsg(
        err?.response?.data?.message ||
        "❌ Failed to reset password"
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
        <h1 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
          Reset Password 🔐
        </h1>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="New Password"
            className="w-full px-4 py-3 rounded-lg 
            bg-gray-100 dark:bg-gray-700
            text-gray-800 dark:text-white
            outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>

        {/* 🔥 STRENGTH BAR */}
        <div className="h-2 w-full bg-gray-300 rounded">
          <div
            className={`h-2 rounded ${getStrengthColor()}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          ></div>
        </div>

        {/* RULES */}
        <div className="text-xs space-y-1">
          <p className={rules.length ? "text-green-500" : "text-gray-400"}>
            • At least 6 characters
          </p>
          <p className={rules.upper ? "text-green-500" : "text-gray-400"}>
            • One uppercase letter
          </p>
          <p className={rules.number ? "text-green-500" : "text-gray-400"}>
            • One number
          </p>
          <p className={rules.special ? "text-green-500" : "text-gray-400"}>
            • One special character
          </p>
        </div>

        {/* CONFIRM */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-lg 
            bg-gray-100 dark:bg-gray-700
            text-gray-800 dark:text-white
            outline-none focus:ring-2 focus:ring-green-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>

        {/* MATCH CHECK */}
        {confirm && (
          <p className={`text-sm ${
            password === confirm ? "text-green-500" : "text-red-500"
          }`}>
            {password === confirm
              ? "✔ Passwords match"
              : "✖ Passwords do not match"}
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleReset}
          disabled={loading || !isValid}
          className="w-full py-3 rounded-lg 
          bg-green-500 hover:bg-green-600 
          text-white font-medium transition
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {/* MESSAGE */}
        {msg && (
          <p className={`text-center text-sm ${
            isError ? "text-red-500" : "text-green-500"
          }`}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;