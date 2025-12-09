import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function SetLoginPin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(pin)) {
      setError("Please enter a valid 6-digit login PIN.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    // Support both id and _id
    const userId = user?.id || user?._id;
    if (!userId) {
      setError("User not found. Please login again.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/set-login-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, loginPin: pin }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to set login PIN.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-yellow-400">
      <h2 className="text-2xl font-bold mb-4">Set Login PIN</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
        <input
          type="password"
          maxLength={6}
          pattern="\d{6}"
          value={pin}
          onChange={e => setPin(e.target.value.replace(/\D/g, ""))}
          className="text-black text-2xl px-6 py-3 rounded-xl border-2 border-yellow-400 text-center tracking-widest w-full"
          placeholder="6-digit PIN"
          disabled={loading}
        />
        {error && <div className="text-red-400">{error}</div>}
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold w-full"
          disabled={loading}
        >
          {loading ? "Setting..." : "Set Login PIN"}
        </button>
      </form>
      <div className="mt-8 text-yellow-300 text-center text-sm max-w-xs">
        Your 6-digit login PIN adds an extra layer of security to your account. Please keep it safe and do not share it with anyone.
      </div>
    </div>
  );
}