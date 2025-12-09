import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // For backend verification

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/auth/request-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: input }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg("OTP sent! Check your email or SMS.");
        setToken(data.token); // Save token for next step
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, token }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg("OTP verified! You can now reset your password.");
        setStep(3);
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, token }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMsg("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1800);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-28 flex flex-col items-center justify-center bg-black text-yellow-400">
      <div className="max-w-md w-full bg-yellow-900 border border-yellow-400 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <label className="font-semibold text-yellow-200">
              Enter your email or phone number
            </label>
            <input
              type="text"
              className="rounded-xl bg-yellow-800 border border-yellow-400 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300"
              placeholder="Email or phone"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
            />
            <button
              className="rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black w-fit shadow hover:from-yellow-500 hover:to-yellow-400"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <label className="font-semibold text-yellow-200">
              Enter the 4-digit OTP sent to your email or phone
            </label>
            <input
              type="text"
              maxLength={4}
              className="rounded-xl bg-yellow-800 border border-yellow-400 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300"
              placeholder="4-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
            />
            <button
              className="rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black w-fit shadow hover:from-yellow-500 hover:to-yellow-400"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <label className="font-semibold text-yellow-200">
              Enter your new password
            </label>
            <input
              type="password"
              className="rounded-xl bg-yellow-800 border border-yellow-400 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button
              className="rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black w-fit shadow hover:from-yellow-500 hover:to-yellow-400"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        {msg && <div className="mt-4 text-emerald-400 text-center font-semibold">{msg}</div>}
        {error && <div className="mt-4 text-rose-400 text-center font-semibold">{error}</div>}
      </div>
    </main>
  );
}