import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function SetTransactionCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{4}$/.test(code)) {
      setError("Please enter a valid 4-digit code.");
      return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setError("User not found. Please login again.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/set-transaction-pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, pin: code }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to set transaction PIN.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-yellow-400">
      <h2 className="text-2xl font-bold mb-4">Set Transaction PIN</h2>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="password"
          maxLength={4}
          pattern="\d{4}"
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
          className="text-black text-2xl px-6 py-3 rounded-xl border-2 border-yellow-400 text-center"
          placeholder="4-digit PIN"
          disabled={loading}
        />
        {error && <div className="text-red-400">{error}</div>}
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold"
          disabled={loading}
        >
          {loading ? "Setting..." : "Set PIN"}
        </button>
      </form>
    </div>
  );
}