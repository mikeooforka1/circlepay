import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaKey,
  FaPlusCircle,
  FaUsers,
  FaShieldAlt,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function JoinGroup() {
  const navigate = useNavigate();

  const [groupCode, setGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!groupCode.trim()) {
      setError("Please enter a 6-character group code.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/groups/join-by-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groupCode: groupCode.toUpperCase().trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(`✓ Successfully joined "${data.group?.name || data.group?.groupName || "the group"}"!`);
        setTimeout(() => navigate("/dashboard"), 1800);
      } else {
        setError(data.message || "Invalid group code. Please check and try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] text-yellow-400">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm"
        >
          <FaArrowLeft size={12} /> Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-300 mb-2">
            Ajo Circles
          </h1>
          <p className="text-yellow-200/60 text-sm max-w-md mx-auto">
            Join an existing savings circle using an invite code, or create your own circle to become the Group Head.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-sm flex items-center gap-2">
            <FaExclamationCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-center space-y-2">
            <FaCheckCircle className="text-emerald-400 text-3xl mx-auto" />
            <h3 className="text-xl font-bold">{success}</h3>
            <p className="text-xs text-yellow-200/60">Redirecting to your dashboard...</p>
          </div>
        )}

        {!success && (
          <div className="space-y-6">
            {/* ── OPTION 1: JOIN WITH CODE ── */}
            <div className="rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-yellow-950/20 via-black to-yellow-950/10 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xl">
                  <FaKey />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-yellow-300">Have a Group Code?</h2>
                  <p className="text-yellow-200/60 text-xs">Enter the 6-character code given to you by your Group Head</p>
                </div>
              </div>

              <form onSubmit={handleJoinByCode} className="mt-5 space-y-4">
                <div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. ABC123"
                    value={groupCode}
                    onChange={(e) => {
                      setGroupCode(e.target.value.toUpperCase());
                      setError("");
                    }}
                    className="w-full px-6 py-4 rounded-2xl bg-black/60 border border-yellow-400/40 text-yellow-300 placeholder-yellow-200/20 text-center font-mono tracking-widest text-2xl font-black focus:outline-none focus:border-yellow-400 uppercase"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !groupCode.trim()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-base hover:shadow-xl hover:shadow-yellow-500/20 transition disabled:opacity-40"
                >
                  {loading ? "Verifying Code..." : "Join Group Now →"}
                </button>
              </form>
            </div>

            {/* ── DIVIDER ── */}
            <div className="flex items-center gap-4 px-6">
              <div className="flex-1 h-[1px] bg-yellow-400/20" />
              <span className="text-xs text-yellow-200/40 font-bold uppercase tracking-wider">or</span>
              <div className="flex-1 h-[1px] bg-yellow-400/20" />
            </div>

            {/* ── OPTION 2: CREATE A GROUP ── */}
            <div className="rounded-3xl border border-yellow-400/30 bg-black/60 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:border-yellow-400/50 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-2xl flex-shrink-0">
                  <FaPlusCircle />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-yellow-300">Create a New Circle</h3>
                  <p className="text-yellow-200/60 text-xs mt-1 leading-relaxed max-w-sm">
                    Set your rules, specify your collection account, and invite friends as the Group Head.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/dashboard/create-group")}
                className="px-6 py-3.5 rounded-xl border border-yellow-400/40 text-yellow-300 font-bold hover:bg-yellow-400/10 transition flex items-center justify-center gap-2 text-sm flex-shrink-0"
              >
                Create Circle <FaChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}