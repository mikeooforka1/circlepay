import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaWallet,
  FaCheckCircle,
  FaExclamationCircle,
  FaUsers,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Format currency
function fmt(n) {
  return `₦${Number(n).toLocaleString()}`;
}

export default function ContributePage() {
  const navigate = useNavigate();

  // State
  const [group, setGroup] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contributing, setContributing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Review | 2: Confirm | 3: Success

  // Custom contribution amount
  const [customAmount, setCustomAmount] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token yet");
      return;
    }
    fetchGroupAndBalance();
  }, []);

  const fetchGroupAndBalance = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setError("Please login again");
        return;
      }

      // ── FETCH GROUP ─────────────────────────────────────────────────
      const groupRes = await fetch(`${API_URL}/api/groups/my-group/first`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // FIX 1 & 3: use `groupData` (the parsed response), NOT the `group` state variable.
      // At this point `group` state is still null — it hasn't been set yet.
      const groupData = await groupRes.json();
      console.log("GROUP DATA:", groupData);

      if (groupRes.ok && groupData.success && groupData.group) {
        // FIX 2: store the full group OBJECT, not just a field from it.
        // Original code did: setGroup(group?.groupName)  →  stored a string, not the object.
        setGroup(groupData.group);
      } else {
        // FIX 3: read error from `groupData`, not from `group` state (which is null).
        console.log("No valid group returned:", groupData);
        setError(groupData?.message || "Could not load group. Please join a group first.");
        setLoading(false);
        return;
      }

      // ── FETCH WALLET ─────────────────────────────────────────────────
      const walletRes = await fetch(`${API_URL}/api/wallet/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const walletData = await walletRes.json();
      console.log("WALLET DATA:", walletData);

      if (walletRes.ok) {
        // FIX 4: the state setter is `setWalletBalance`, not `setBalance`.
        // Original code called setBalance() which doesn't exist → ReferenceError → catch fires
        // → setError("Something went wrong") → blank error screen.
        setWalletBalance(walletData.balance || 0);
      } else {
        console.log("Wallet fetch failed:", walletData.message);
        // Non-fatal: we still show the UI, just with 0 balance and a warning.
        setWalletBalance(0);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Something went wrong loading your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine the contribution amount (standard or custom)
  const contributionAmount = customAmount || group?.contributionAmount || 0;

  // Check if user has enough balance
  const hasEnoughBalance = walletBalance >= contributionAmount;

  // Handle contribution
  const handleContribute = async () => {
    if (!group) return;
    if (!hasEnoughBalance) {
      setError("Insufficient balance to contribute");
      return;
    }

    try {
      setContributing(true);
      setError("");
      const token = localStorage.getItem("token");

      // Safe: group._id is now always the real ObjectId because we fixed setGroup above.
      const res = await fetch(`${API_URL}/api/groups/${group._id}/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: contributionAmount }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setStep(3);
        // Refresh wallet balance after a short delay
        setTimeout(() => {
          fetchGroupAndBalance();
        }, 2000);
      } else {
        setError(data.message || "Failed to contribute");
      }
    } catch (err) {
      console.error("Contribution error:", err);
      setError("Network error. Please try again.");
    } finally {
      setContributing(false);
    }
  };

  // ── RENDER GUARDS ──────────────────────────────────────────────────────────
  // FIX 5: Remove the duplicate unstyled early-return guards that were shadowing
  // the real styled ones below. Only ONE set of guards is needed, styled properly.

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10141a] to-[#1e293b]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400/30 border-t-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-200/70">Loading group and wallet...</p>
        </div>
      </main>
    );
  }

  // FIX 6: Guard only on `error` being set while group truly failed to load.
  // Original: `if (error && !group)` — correct condition, but was always true because
  // group was never being set (due to Bugs 1+2). With those fixed, this now only
  // triggers when there truly is no group (e.g. user hasn't joined one).
  if (error && !group) {
    return (
      <main className="min-h-screen pt-28 pb-10 px-4 bg-gradient-to-br from-[#10141a] via-[#0f1419] to-[#1a1f2e]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-8 text-sm"
          >
            <FaArrowLeft size={12} /> Back to Dashboard
          </button>

          <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">No Group Found</h1>
            <p className="text-yellow-200/70 mb-6">{error}</p>
            <button
              onClick={() => navigate("/dashboard/join-group")}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:shadow-lg transition"
            >
              Join a Group
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen pt-28 pb-10 px-4 bg-gradient-to-br from-[#10141a] via-[#0f1419] to-[#1a1f2e]">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-8 text-sm"
        >
          <FaArrowLeft size={12} /> Back to Dashboard
        </button>

        {/* ────────────────────────────────────────────────────────────── */}
        {/* STEP 1: REVIEW CONTRIBUTION                                    */}
        {/* ────────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <>
            <h1 className="text-4xl font-black text-yellow-300 mb-2">
              Make a Contribution
            </h1>
            <p className="text-yellow-200/60 mb-8">
              Contribute to your group using your wallet balance. Your contribution
              helps other members get their payouts.
            </p>

            {/* ERROR BANNER — inline errors (e.g. wallet failed) after group loaded */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
                <FaExclamationCircle className="shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* WARNING: Wallet balance is zero */}
            {walletBalance === 0 && !error && (
              <div className="mb-6 p-4 rounded-xl bg-orange-900/20 border border-orange-500/30 text-orange-300 text-sm flex items-start gap-3">
                <FaExclamationCircle className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">⚠️ Wallet Balance is Zero</p>
                  <p className="text-xs mt-1">
                    Fund your wallet before contributing. Click "Fund Wallet" on
                    the dashboard.
                  </p>
                </div>
              </div>
            )}

            {/* GROUP OVERVIEW CARD */}
            <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-900/20 via-black/40 to-yellow-900/10 p-8 mb-8">
              <h2 className="text-2xl font-bold text-yellow-300 mb-6">
                {group?.groupName}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/40 rounded-xl p-4 border border-yellow-400/20">
                  <p className="text-yellow-200/60 text-xs font-semibold uppercase mb-2">
                    Members
                  </p>
                  <p className="text-2xl font-black text-yellow-300">
                    {group?.members?.length ?? 0}
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-yellow-400/20">
                  <p className="text-yellow-200/60 text-xs font-semibold uppercase mb-2">
                    Frequency
                  </p>
                  <p className="text-2xl font-black text-yellow-300">
                    {group?.frequency}
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-yellow-400/20">
                  <p className="text-yellow-200/60 text-xs font-semibold uppercase mb-2">
                    Cycle
                  </p>
                  <p className="text-2xl font-black text-yellow-300">
                    {group?.payoutDuration}d
                  </p>
                </div>

                <div className="bg-black/40 rounded-xl p-4 border border-yellow-400/20">
                  <p className="text-yellow-200/60 text-xs font-semibold uppercase mb-2">
                    Code
                  </p>
                  <p className="text-lg font-mono font-black text-yellow-300">
                    {group?.groupCode}
                  </p>
                </div>
              </div>

              {/* Next Payout Info */}
              {group?.nextPayoutDate && (
                <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-yellow-400" />
                    <div>
                      <p className="text-yellow-200/60 text-xs font-semibold uppercase">
                        Next Payout
                      </p>
                      <p className="text-yellow-300 font-bold">
                        {new Date(group.nextPayoutDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WALLET BALANCE CARD */}
            <div className="rounded-2xl border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-500/10 via-black/40 to-yellow-900/10 p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FaWallet className="text-yellow-400 text-2xl" />
                <h3 className="text-lg font-bold text-yellow-300">
                  Your Wallet Balance
                </h3>
              </div>
              <p className="text-4xl font-black text-yellow-300 mb-2">
                {fmt(walletBalance)}
              </p>
              <p className="text-yellow-200/60 text-sm">
                Available funds in your wallet
              </p>
            </div>

            {/* CONTRIBUTION AMOUNT SELECTION */}
            <div className="rounded-2xl border border-yellow-400/30 bg-black/40 p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
                <FaMoneyBillWave /> Choose Contribution Amount
              </h3>

              {/* Standard amount */}
              <button
                onClick={() => {
                  setCustomAmount(null);
                  setShowCustomInput(false);
                }}
                className={`w-full p-4 rounded-xl border-2 transition mb-3 text-left ${
                  !customAmount && !showCustomInput
                    ? "border-yellow-400 bg-yellow-900/25"
                    : "border-yellow-400/30 bg-black/30 hover:border-yellow-400/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 font-bold">
                      Standard Amount (Required)
                    </p>
                    <p className="text-yellow-200/60 text-sm mt-1">
                      Contribute the standard group amount
                    </p>
                  </div>
                  <p className="text-3xl font-black text-yellow-400">
                    {fmt(group?.contributionAmount)}
                  </p>
                </div>
              </button>

              {/* Custom amount option */}
              <button
                onClick={() => {
                  setShowCustomInput(!showCustomInput);
                  setCustomAmount(null);
                }}
                className={`w-full p-4 rounded-xl border-2 transition text-left ${
                  showCustomInput
                    ? "border-yellow-400 bg-yellow-900/25"
                    : "border-yellow-400/30 bg-black/30 hover:border-yellow-400/50"
                }`}
              >
                <p className="text-yellow-300 font-bold">
                  Custom Amount (Optional)
                </p>
                <p className="text-yellow-200/60 text-sm mt-1">
                  Contribute any amount to help your group faster
                </p>
              </button>

              {/* Custom amount input */}
              {showCustomInput && (
                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-yellow-400/20">
                  <label className="block text-yellow-300 text-sm font-semibold mb-2">
                    Enter custom amount (₦)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={customAmount || ""}
                    onChange={(e) =>
                      setCustomAmount(e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder={`Minimum: ₦1 | Balance: ${fmt(walletBalance)}`}
                    className="w-full px-4 py-3 rounded-lg bg-black/60 border border-yellow-400/30 text-yellow-300 placeholder-yellow-200/30 focus:outline-none focus:border-yellow-400/60 text-lg"
                  />
                  {customAmount && customAmount > walletBalance && (
                    <p className="text-red-400 text-xs mt-2">
                      ⚠️ Amount exceeds wallet balance
                    </p>
                  )}
                  {customAmount && customAmount > 0 && (
                    <p className="text-yellow-200/60 text-xs mt-2">
                      Amount: {fmt(customAmount)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* CONTRIBUTION SUMMARY */}
            <div className="rounded-2xl border border-yellow-400/30 bg-black/40 p-6 mb-8">
              <h3 className="text-sm font-semibold text-yellow-300 uppercase mb-4">
                Contribution Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-yellow-400/20">
                  <p className="text-yellow-200/70">Amount to Contribute</p>
                  <p className="text-2xl font-black text-yellow-300">
                    {fmt(contributionAmount)}
                  </p>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-yellow-400/20">
                  <p className="text-yellow-200/70">Your Wallet Balance</p>
                  <p className="text-lg font-bold text-yellow-300">
                    {fmt(walletBalance)}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-yellow-200/70 font-semibold">
                    Balance After Contribution
                  </p>
                  <p
                    className={`text-2xl font-black ${
                      walletBalance - contributionAmount >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {fmt(Math.max(0, walletBalance - contributionAmount))}
                  </p>
                </div>
              </div>
            </div>

            {/* INFO BOX */}
            <div className="rounded-xl bg-black/40 border border-yellow-400/20 p-4 mb-8 flex gap-3 items-start">
              <div className="text-yellow-400 mt-1 shrink-0">ℹ️</div>
              <div className="text-sm text-yellow-200/70">
                <p className="font-semibold text-yellow-300 mb-1">How It Works</p>
                <p>
                  Your contribution will be deducted from your wallet balance and
                  added to the group. When it's your turn to receive payout, all
                  contributions from group members will be transferred to you.
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            {!hasEnoughBalance && contributionAmount > 0 ? (
              <div className="rounded-xl bg-red-900/20 border border-red-500/30 p-4 mb-6">
                <p className="text-red-300 text-sm font-semibold mb-3">
                  ❌ Insufficient Balance
                </p>
                <p className="text-red-300/80 text-sm mb-4">
                  You need {fmt(contributionAmount - walletBalance)} more to
                  contribute.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:shadow-lg transition"
                >
                  Fund Wallet
                </button>
              </div>
            ) : (
              <button
                onClick={() => setStep(2)}
                disabled={!hasEnoughBalance || contributionAmount === 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-black text-lg hover:shadow-xl hover:shadow-yellow-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Confirm →
              </button>
            )}
          </>
        )}

        {/* ────────────────────────────────────────────────────────────── */}
        {/* STEP 2: CONFIRM CONTRIBUTION                                   */}
        {/* ────────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <>
            <h1 className="text-4xl font-black text-yellow-300 mb-2">
              Confirm Contribution
            </h1>
            <p className="text-yellow-200/60 mb-8">
              Review and confirm your contribution details
            </p>

            {/* CONFIRMATION CARD */}
            <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-yellow-900/30 via-black/40 to-yellow-900/10 p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">💰</div>
                <h2 className="text-3xl font-black text-yellow-300 mb-2">
                  {fmt(contributionAmount)}
                </h2>
                <p className="text-yellow-200/60">
                  Ready to contribute to {group?.groupName}?
                </p>
              </div>

              <div className="space-y-4 bg-black/40 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center pb-4 border-b border-yellow-400/20">
                  <p className="text-yellow-200/70">Group</p>
                  <p className="text-yellow-300 font-bold">{group?.groupName}</p>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-yellow-400/20">
                  <p className="text-yellow-200/70">Contribution Amount</p>
                  <p className="text-yellow-300 font-bold">
                    {fmt(contributionAmount)}
                  </p>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-yellow-400/20">
                  <p className="text-yellow-200/70">Current Balance</p>
                  <p className="text-yellow-300 font-bold">{fmt(walletBalance)}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-yellow-200/70">Balance After</p>
                  <p className="text-green-400 font-bold">
                    {fmt(walletBalance - contributionAmount)}
                  </p>
                </div>
              </div>

              {/* WARNING BOX */}
              <div className="rounded-xl bg-orange-900/20 border border-orange-500/30 p-4 mb-6 flex gap-3 items-start">
                <div className="text-orange-400 mt-1 shrink-0">⚠️</div>
                <div className="text-sm text-orange-200/70">
                  <p className="font-semibold text-orange-300 mb-1">
                    Cannot Be Reversed
                  </p>
                  <p>
                    Once contributed, the amount cannot be refunded. Please make
                    sure you want to proceed.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-xl border-2 border-yellow-400/40 text-yellow-300 font-bold hover:border-yellow-400/60 transition"
              >
                ← Back
              </button>

              <button
                onClick={handleContribute}
                disabled={contributing}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-black text-lg hover:shadow-xl hover:shadow-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {contributing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle /> Confirm & Contribute
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ────────────────────────────────────────────────────────────── */}
        {/* STEP 3: SUCCESS                                                */}
        {/* ────────────────────────────────────────────────────────────── */}
        {step === 3 && success && (
          <>
            <div className="text-center py-16">
              <div className="text-7xl mb-6 animate-bounce">✅</div>

              <h1 className="text-4xl font-black text-green-400 mb-2">
                Contribution Successful!
              </h1>

              <p className="text-yellow-200/70 text-lg mb-8 max-w-lg mx-auto">
                Your contribution of {fmt(contributionAmount)} has been added to{" "}
                {group?.groupName}. Your fellow members will appreciate your support!
              </p>

              {/* SUCCESS DETAILS */}
              <div className="rounded-2xl border border-green-500/30 bg-green-900/10 p-8 mb-8 max-w-lg mx-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-green-500/20">
                    <p className="text-yellow-200/70">Amount Contributed</p>
                    <p className="text-green-400 font-bold text-lg">
                      {fmt(contributionAmount)}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-green-500/20">
                    <p className="text-yellow-200/70">Group</p>
                    <p className="text-yellow-300 font-bold">{group?.groupName}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-yellow-200/70">New Wallet Balance</p>
                    <p className="text-yellow-300 font-bold">
                      {fmt(walletBalance - contributionAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* INFO BOX */}
              <div className="rounded-xl bg-black/40 border border-yellow-400/20 p-6 mb-8 max-w-lg mx-auto text-left">
                <p className="font-semibold text-yellow-300 mb-3">What Happens Next?</p>
                <ul className="space-y-2 text-yellow-200/70 text-sm">
                  <li>✓ Your contribution is recorded in the group</li>
                  <li>✓ You help fund payouts for other members</li>
                  <li>
                    ✓ When it's your turn, you'll receive contributions from all
                    members
                  </li>
                  <li>✓ Monitor progress in the Group Details page</li>
                </ul>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 max-w-lg mx-auto">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:shadow-lg transition"
                >
                  Back to Dashboard
                </button>

                <button
                  onClick={() => navigate("/dashboard/group")}
                  className="flex-1 py-4 rounded-xl border-2 border-yellow-400/40 text-yellow-300 font-bold hover:border-yellow-400/60 transition"
                >
                  View Group Details
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}