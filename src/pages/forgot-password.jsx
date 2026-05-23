import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Store email for display
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility

  // Step 1: Check if email is registered and send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/request-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(`✓ 4-digit code sent to ${email}`);
        setToken(data.token);
        setUserEmail(email);
        setStep(2);
        setEmail(""); // Clear email field for next step
      } else {
        setError(data.message || "Email not registered in our system");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      console.error(err);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate OTP
    if (!otp || otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setError("Please enter a valid 4-digit code");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, token }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("✓ Code verified successfully!");
        setStep(3);
        setOtp(""); // Clear OTP field
      } else {
        setError(data.message || "Invalid or expired code. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate passwords
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }

    if (!/\d/.test(newPassword)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, token }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage("✓ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-yellow-400 p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-yellow-900 to-yellow-950 border-2 border-yellow-400 rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-yellow-300 mb-2">
            Reset Password
          </h2>
          <p className="text-yellow-200 text-sm">
            {step === 1
              ? "Enter your registered email"
              : step === 2
              ? "Enter the 4-digit code"
              : "Create your new password"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
            <div>
              <label className="block font-semibold text-yellow-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full rounded-xl bg-yellow-800 border-2 border-yellow-400 focus:border-yellow-300 focus:bg-yellow-700 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300 transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black transition hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Checking email..." : "Send Code"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <div>
              <label className="block font-semibold text-yellow-200 mb-2">
                Enter 4-Digit Code
              </label>
              <p className="text-xs text-yellow-300 mb-3">
                We sent it to {userEmail}
              </p>
              <input
                type="text"
                maxLength="4"
                className="w-full rounded-xl bg-yellow-800 border-2 border-yellow-400 focus:border-yellow-300 focus:bg-yellow-700 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300 text-center text-lg font-bold tracking-widest transition"
                placeholder="0000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black transition hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="text-sm text-yellow-300 hover:text-yellow-200 transition"
            >
              ← Back to email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
            {/* New Password Field with Eye Icon */}
            <div>
              <label className="block font-semibold text-yellow-200 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full rounded-xl bg-yellow-800 border-2 border-yellow-400 focus:border-yellow-300 focus:bg-yellow-700 px-4 py-3 pr-12 outline-none text-yellow-400 placeholder-yellow-300 transition"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-300 hover:text-yellow-200 transition focus:outline-none"
                  disabled={loading}
                >
                  {showNewPassword ? (
                    // Eye Open Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // Eye Closed Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-yellow-300 mt-2">
                Must include: uppercase letter, number, 8+ characters
              </p>
            </div>

            {/* Confirm Password Field with Eye Icon */}
            <div>
              <label className="block font-semibold text-yellow-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full rounded-xl bg-yellow-800 border-2 border-yellow-400 focus:border-yellow-300 focus:bg-yellow-700 px-4 py-3 pr-12 outline-none text-yellow-400 placeholder-yellow-300 transition"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-300 hover:text-yellow-200 transition focus:outline-none"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    // Eye Open Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // Eye Closed Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black transition hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(2);
                setNewPassword("");
                setConfirmPassword("");
                setError("");
                setMessage("");
              }}
              className="text-sm text-yellow-300 hover:text-yellow-200 transition"
            >
              ← Back to code
            </button>
          </form>
        )}

        {/* Success Message */}
        {message && (
          <div className="mt-6 p-4 rounded-lg bg-emerald-900 border border-emerald-400 text-emerald-300 text-center font-semibold text-sm">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-900 border border-red-400 text-red-300 text-center font-semibold text-sm">
            {error}
          </div>
        )}

        {/* Footer Link */}
        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-yellow-200 text-sm">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-yellow-300 font-semibold hover:text-yellow-200 transition"
              >
                Login here
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}