import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUsers,
  FaClock,
  FaMoneyBillWave,
  FaCode,
  FaLightbulb,
  FaCheckCircle,
  FaChevronRight,
  FaBolt,
  FaStar,
  FaCrown,
  FaCalendarAlt,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── Group Category Metadata ─────────────────────────────────────────────────
const CYCLE_INFO = {
  7: {
    label: "Quick Cycle",
    tagline: "Fast returns, short commitment",
    icon: <FaBolt className="text-cyan-300" />,
    badge: "7-Day Payout",
    accent: "cyan",
    gradient: "from-cyan-900/30 to-black/50",
    border: "border-cyan-500/40",
    activeBorder: "border-cyan-400",
    badgeBg: "bg-cyan-500/20 text-cyan-300",
    dot: "bg-cyan-400",
    tip: "Great for short-term savers who want quick results.",
  },
  14: {
    label: "Standard Cycle",
    tagline: "Steady savings with fair rotation",
    icon: <FaStar className="text-purple-300" />,
    badge: "14-Day Payout",
    accent: "purple",
    gradient: "from-purple-900/30 to-black/50",
    border: "border-purple-500/40",
    activeBorder: "border-purple-400",
    badgeBg: "bg-purple-500/20 text-purple-300",
    dot: "bg-purple-400",
    tip: "The most popular option — balanced for most people.",
  },
  21: {
    label: "Premium Cycle",
    tagline: "Bigger payouts, longer planning",
    icon: <FaCrown className="text-amber-300" />,
    badge: "21-Day Payout",
    accent: "amber",
    gradient: "from-amber-900/30 to-black/50",
    border: "border-amber-500/40",
    activeBorder: "border-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-300",
    dot: "bg-amber-400",
    tip: "Ideal for long-term savers building larger goals.",
  },
};

const CONTRIBUTION_AMOUNTS = [1000, 2000, 3000, 5000, 7000, 10000];
const GROUP_SIZES = [
  { size: 5, label: "5 Members", desc: "Intimate circle" },
  { size: 7, label: "7 Members", desc: "Perfect balance" },
  { size: 10, label: "10 Members", desc: "Bigger community" },
];

// ─── Helper ───────────────────────────────────────────────────────────────────
function fmt(n) {
  return `₦${Number(n).toLocaleString()}`;
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepBar({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < current ? "bg-yellow-400" : i === current ? "bg-yellow-400/60" : "bg-yellow-400/15"
            }`}
          />
        </React.Fragment>
      ))}
      <span className="text-yellow-200/50 text-xs ml-2 whitespace-nowrap">
        Step {current + 1} / {total}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function JoinGroup() {
  const navigate = useNavigate();

  // join mode: "browse" = pick from system groups | "code" = enter group code
  const [joinMode, setJoinMode] = useState(null); // null = not chosen yet

  // Step-based selections (browse flow)
  const [step, setStep] = useState(0); // 0=cycle, 1=contribution, 2=frequency, 3=size, 4=confirm
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Code flow
  const [groupCode, setGroupCode] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Clear error on any selection change
  useEffect(() => { setError(""); }, [selectedDuration, selectedAmount, selectedFrequency, selectedSize, groupCode]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleJoinByCode = async (e) => {
    e.preventDefault();
    if (!groupCode.trim()) { setError("Please enter a group code."); return; }
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/join-by-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ groupCode: groupCode.toUpperCase().trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(`✓ Successfully joined group "${data.group?.groupName || "the group"}"!`);
        setTimeout(() => navigate("/dashboard"), 1800);
      } else {
        setError(data.message || "Failed to join group. Check the code and try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAvailable = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/join-flexible`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          payoutDuration: selectedDuration,
          frequency: selectedFrequency,
          contributionAmount: selectedAmount,
          maxMembers: selectedSize,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(
          data.isNewGroup
            ? `✓ A new group has been created for you! Code: ${data.group?.groupCode}`
            : `✓ Joined group "${data.group?.groupName}"! Code: ${data.group?.groupCode}`
        );
        setTimeout(() => navigate("/dashboard"), 2200);
      } else {
        setError(data.message || "Failed to join. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Correct payout formula:
  //   Daily  → each of the payoutDuration days every member contributes once
  //             payout = contributionAmount × members × payoutDuration
  //   Weekly → each week every member contributes once; payoutDuration is in days
  //             payout = contributionAmount × members × (payoutDuration / 7)
  const estimatedPayout = (() => {
    if (!selectedAmount || !selectedSize || !selectedFrequency || !selectedDuration) return null;
    const contributionsPerCycle =
      selectedFrequency === "Daily" ? selectedDuration : selectedDuration / 7;
    return selectedAmount * selectedSize * contributionsPerCycle;
  })();

  const cycleInfo = selectedDuration ? CYCLE_INFO[selectedDuration] : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-100 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-8 text-sm font-medium"
        >
          <FaArrowLeft size={13} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-yellow-300 tracking-tight mb-3">
            Join an Ajo Group
          </h1>
          <p className="text-yellow-200/60 text-base max-w-xl mx-auto">
            Save together, win together. Choose how you'd like to join a savings group.
          </p>
        </div>

        {/* Global messages */}
        {error && (
          <div className="mb-6 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
            <span className="mt-0.5">⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm flex items-start gap-3">
            <FaCheckCircle className="mt-0.5 shrink-0" /> {success}
          </div>
        )}

        {/* ── Mode Selection ─────────────────────────────────────────── */}
        {!joinMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Browse system groups */}
            <button
              onClick={() => setJoinMode("browse")}
              className="group text-left rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-900/10 to-black/50 p-8 hover:border-yellow-400/60 hover:bg-yellow-900/20 transition-all duration-200"
            >
              <div className="text-4xl mb-4">🏦</div>
              <h2 className="text-xl font-bold text-yellow-300 mb-2 flex items-center gap-2">
                Browse System Groups
                <FaChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
              </h2>
              <p className="text-yellow-200/60 text-sm leading-relaxed">
                Pick your preferences — cycle length, amount, frequency, and group size. We'll match you to an available group or create one for you.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">⚡ Auto-matched</span>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">🛡️ Secure</span>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">✓ Fair rotation</span>
              </div>
            </button>

            {/* Join by code */}
            <button
              onClick={() => setJoinMode("code")}
              className="group text-left rounded-2xl border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-900/10 to-black/50 p-8 hover:border-yellow-400/60 hover:bg-yellow-900/20 transition-all duration-200"
            >
              <div className="text-4xl mb-4">🔑</div>
              <h2 className="text-xl font-bold text-yellow-300 mb-2 flex items-center gap-2">
                Join with Group Code
                <FaChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
              </h2>
              <p className="text-yellow-200/60 text-sm leading-relaxed">
                Already have a group code from a friend or family member? Enter it here to join their specific group directly.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">🔐 Code required</span>
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-300">👥 Join friends</span>
              </div>
            </button>
          </div>
        )}

        {/* ── Join by Code Flow ──────────────────────────────────────── */}
        {joinMode === "code" && (
          <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-900/10 to-black/50 p-8 md:p-12">
            <button
              onClick={() => { setJoinMode(null); setGroupCode(""); setError(""); }}
              className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-8 text-sm"
            >
              <FaArrowLeft size={12} /> Change method
            </button>

            <h2 className="text-2xl font-bold text-yellow-300 mb-2 flex items-center gap-3">
              <FaCode /> Enter Your Group Code
            </h2>
            <p className="text-yellow-200/50 text-sm mb-8">
              Ask the group creator or a current member for the 6-character code.
            </p>

            <form onSubmit={handleJoinByCode} className="space-y-6 max-w-sm mx-auto">
              <div>
                <label className="block text-yellow-300 font-semibold mb-2 text-sm">Group Code</label>
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  placeholder="e.g. AJ72XK"
                  maxLength={6}
                  className="w-full px-6 py-5 rounded-xl bg-black/40 border-2 border-yellow-400/30 focus:border-yellow-400 text-yellow-300 placeholder-yellow-200/25 outline-none transition text-center text-3xl tracking-[0.4em] font-bold uppercase"
                />
                <p className="text-yellow-200/40 text-xs mt-2 text-center">6-character alphanumeric code</p>
              </div>

              <button
                type="submit"
                disabled={loading || groupCode.length < 6}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-base hover:shadow-lg hover:shadow-yellow-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Joining...
                  </span>
                ) : "Join This Group"}
              </button>
            </form>

            <div className="mt-8 p-4 rounded-xl bg-black/30 border border-yellow-400/10 flex gap-3 items-start max-w-sm mx-auto">
              <FaLightbulb className="text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-yellow-200/50 text-xs leading-relaxed">
                Each group has a unique code. You cannot join a group you're already a member of.
              </p>
            </div>
          </div>
        )}

        {/* ── Browse / Step Flow ─────────────────────────────────────── */}
        {joinMode === "browse" && (
          <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-900/10 to-black/50 p-8 md:p-12">
            {/* Back to mode select */}
            {step === 0 && (
              <button
                onClick={() => { setJoinMode(null); setError(""); }}
                className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-8 text-sm"
              >
                <FaArrowLeft size={12} /> Change method
              </button>
            )}

            <StepBar current={step} total={5} />

            {/* ── STEP 0: Choose Payout Cycle ── */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-1 flex items-center gap-3">
                  <FaClock /> Choose Payout Cycle
                </h2>
                <p className="text-yellow-200/50 text-sm mb-8">
                  This sets how often the group's payout rotates to the next member.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[7, 14, 21].map((dur) => {
                    const info = CYCLE_INFO[dur];
                    return (
                      <button
                        key={dur}
                        onClick={() => { setSelectedDuration(dur); setStep(1); }}
                        className={`text-left rounded-2xl border-2 p-6 transition-all duration-200 hover:scale-[1.02] bg-gradient-to-br ${info.gradient} ${
                          selectedDuration === dur ? info.activeBorder : info.border
                        } hover:${info.activeBorder}`}
                      >
                        <div className="text-2xl mb-3">{info.icon}</div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${info.badgeBg} mb-3 inline-block`}>
                          {info.badge}
                        </span>
                        <h3 className="text-lg font-bold text-yellow-200 mb-1">{info.label}</h3>
                        <p className="text-yellow-200/50 text-xs leading-relaxed">{info.tagline}</p>
                        <p className="text-yellow-200/35 text-xs mt-3 italic">{info.tip}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── STEP 1: Choose Contribution Amount ── */}
            {step === 1 && (
              <div>
                <button onClick={() => setStep(0)} className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm">
                  <FaArrowLeft size={12} /> Back
                </button>
                <h2 className="text-2xl font-bold text-yellow-300 mb-1 flex items-center gap-3">
                  <FaMoneyBillWave /> Choose Contribution Amount
                </h2>
                <p className="text-yellow-200/50 text-sm mb-2">
                  How much will each member contribute per cycle?
                </p>
                {cycleInfo && (
                  <div className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full mb-8 ${cycleInfo.badgeBg}`}>
                    {cycleInfo.icon} {cycleInfo.label} selected
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {CONTRIBUTION_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => { setSelectedAmount(amt); setStep(2); }}
                      className={`rounded-xl border-2 p-5 text-center transition-all hover:scale-[1.03] ${
                        selectedAmount === amt
                          ? "border-yellow-400 bg-yellow-900/30"
                          : "border-yellow-400/25 bg-black/30 hover:border-yellow-400/50"
                      }`}
                    >
                      <p className="text-2xl font-black text-yellow-300">{fmt(amt)}</p>
                      <p className="text-yellow-200/40 text-xs mt-1">per cycle</p>
                    </button>
                  ))}
                </div>

                <p className="text-yellow-200/35 text-xs mt-6 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" />
                  Min ₦1,000 · Max ₦10,000 — you'll receive the total pooled from all members.
                </p>
              </div>
            )}

            {/* ── STEP 2: Choose Contribution Frequency ── */}
            {step === 2 && (
              <div>
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm">
                  <FaArrowLeft size={12} /> Back
                </button>
                <h2 className="text-2xl font-bold text-yellow-300 mb-1 flex items-center gap-3">
                  <FaCalendarAlt /> Contribution Frequency
                </h2>
                <p className="text-yellow-200/50 text-sm mb-8">
                  How often will each member make their contribution?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      key: "Daily",
                      icon: "☀️",
                      title: "Daily",
                      desc: "Contribute a small amount every day. Builds discipline and keeps you consistent.",
                      badge: "Every Day",
                    },
                    {
                      key: "Weekly",
                      icon: "📅",
                      title: "Weekly",
                      desc: "Contribute once per week. Great for people with a regular income schedule.",
                      badge: "Once a Week",
                    },
                  ].map((freq) => (
                    <button
                      key={freq.key}
                      onClick={() => { setSelectedFrequency(freq.key); setStep(3); }}
                      className={`text-left rounded-2xl border-2 p-7 transition-all hover:scale-[1.02] ${
                        selectedFrequency === freq.key
                          ? "border-yellow-400 bg-yellow-900/25"
                          : "border-yellow-400/25 bg-black/30 hover:border-yellow-400/50"
                      }`}
                    >
                      <div className="text-4xl mb-4">{freq.icon}</div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 mb-3 inline-block">
                        {freq.badge}
                      </span>
                      <h3 className="text-xl font-bold text-yellow-200 mb-2">{freq.title}</h3>
                      <p className="text-yellow-200/50 text-sm leading-relaxed">{freq.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 3: Choose Group Size ── */}
            {step === 3 && (
              <div>
                <button onClick={() => setStep(2)} className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm">
                  <FaArrowLeft size={12} /> Back
                </button>
                <h2 className="text-2xl font-bold text-yellow-300 mb-1 flex items-center gap-3">
                  <FaUsers /> Choose Group Size
                </h2>
                <p className="text-yellow-200/50 text-sm mb-8">
                  How many members should be in your group? More members = bigger payout for each person's turn.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {GROUP_SIZES.map(({ size, label, desc }) => (
                    <button
                      key={size}
                      onClick={() => { setSelectedSize(size); setStep(4); }}
                      className={`text-left rounded-2xl border-2 p-6 transition-all hover:scale-[1.02] ${
                        selectedSize === size
                          ? "border-yellow-400 bg-yellow-900/25"
                          : "border-yellow-400/25 bg-black/30 hover:border-yellow-400/50"
                      }`}
                    >
                      <FaUsers className="text-yellow-300 text-3xl mb-4" />
                      <h3 className="text-2xl font-black text-yellow-200 mb-1">{label}</h3>
                      <p className="text-yellow-200/45 text-sm">{desc}</p>
                      {selectedAmount && selectedFrequency && selectedDuration && (() => {
                        const contributionsPerCycle =
                          selectedFrequency === "Daily" ? selectedDuration : selectedDuration / 7;
                        return (
                          <p className="text-yellow-400 font-bold text-sm mt-3">
                            Payout ≈ {fmt(selectedAmount * size * contributionsPerCycle)}
                          </p>
                        );
                      })()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP 4: Review & Confirm ── */}
            {step === 4 && selectedDuration && selectedAmount && selectedFrequency && selectedSize && (
              <div>
                <button onClick={() => setStep(3)} className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm">
                  <FaArrowLeft size={12} /> Back
                </button>
                <h2 className="text-2xl font-bold text-yellow-300 mb-1">Review Your Choices</h2>
                <p className="text-yellow-200/50 text-sm mb-8">
                  Double-check everything before joining. You'll be matched to an available group or a new one will be created for you.
                </p>

                {/* Summary card */}
                <div className={`rounded-2xl border-2 bg-gradient-to-br ${CYCLE_INFO[selectedDuration].gradient} ${CYCLE_INFO[selectedDuration].border} p-7 mb-6`}>
                  {/* Category banner */}
                  <div className="flex items-center gap-3 mb-6 pb-5 border-b border-yellow-400/10">
                    <div className="text-3xl">{CYCLE_INFO[selectedDuration].icon}</div>
                    <div>
                      <p className="font-bold text-yellow-200 text-lg">{CYCLE_INFO[selectedDuration].label}</p>
                      <p className="text-yellow-200/50 text-sm">{CYCLE_INFO[selectedDuration].tagline}</p>
                    </div>
                    <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${CYCLE_INFO[selectedDuration].badgeBg}`}>
                      {CYCLE_INFO[selectedDuration].badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="text-center">
                      <p className="text-yellow-200/45 text-xs mb-1">Payout Cycle</p>
                      <p className="text-yellow-300 font-black text-xl">{selectedDuration} days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-200/45 text-xs mb-1">Your Contribution</p>
                      <p className="text-yellow-300 font-black text-xl">{fmt(selectedAmount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-200/45 text-xs mb-1">Frequency</p>
                      <p className="text-yellow-300 font-black text-xl">{selectedFrequency}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-200/45 text-xs mb-1">Group Size</p>
                      <p className="text-yellow-300 font-black text-xl">{selectedSize} members</p>
                    </div>
                  </div>

                  {/* Estimated payout highlight */}
                  <div className="mt-6 pt-5 border-t border-yellow-400/10 text-center">
                    <p className="text-yellow-200/45 text-xs mb-1">Your Estimated Payout When It's Your Turn</p>
                    <p className="text-4xl font-black text-yellow-400">{fmt(estimatedPayout)}</p>
                    <p className="text-yellow-200/35 text-xs mt-1">
                      {selectedFrequency === "Daily"
                        ? `(${fmt(selectedAmount)} × ${selectedSize} members × ${selectedDuration} days)`
                        : `(${fmt(selectedAmount)} × ${selectedSize} members × ${selectedDuration / 7} week${selectedDuration / 7 > 1 ? "s" : ""})`}
                    </p>
                  </div>
                </div>

                {/* Notice */}
                <div className="mb-6 p-4 rounded-xl bg-black/40 border border-yellow-400/15 flex gap-3 items-start">
                  <FaLightbulb className="text-yellow-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-yellow-300 text-sm font-semibold mb-1">How It Works</p>
                    <p className="text-yellow-200/50 text-xs leading-relaxed">
                      You'll be matched to an available system group with these exact settings. If no group has space, a new one will be created automatically. Each group has a unique code you can share. You cannot join the same group twice.
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center gap-3 py-6 text-yellow-300">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Matching you to a group...
                  </div>
                ) : (
                  <button
                    onClick={handleJoinAvailable}
                    className="w-full py-5 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-lg hover:shadow-xl hover:shadow-yellow-500/30 transition transform hover:scale-[1.01]"
                  >
                    Confirm & Join Group →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Bottom Info Cards ───────────────────────────────────────── */}
        {!success && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: "⚡", title: "Auto-Matched", desc: "We find or create the best group for your preferences automatically." },
              { icon: "🛡️", title: "No Duplicates", desc: "The system prevents you from joining the same group more than once." },
              { icon: "🔑", title: "Unique Group Codes", desc: "Every group gets a unique code so members can invite others directly." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-yellow-400/20 bg-black/30 p-5 hover:bg-black/50 transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-yellow-300 text-sm mb-1">{item.title}</h3>
                <p className="text-yellow-200/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}