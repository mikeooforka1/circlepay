import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import WelcomeGuideModal from "./components/WelcomeGuideModal";
import FixedAccountModal from "./components/Fixedaccountmodal";
import {
  FaUsers,
  FaArrowRight,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const quickActions = [
  { label: "Fund Wallet",  icon: "💳", action: "fundWallet", desc: "Add funds to wallet" },
  { label: "Contribute",   icon: "💰", action: "contribute", desc: "Make ajo contribution" },
  { label: "History",      icon: "📊", action: "history",    desc: "View transaction history" },
  { label: "Withdraw",     icon: "💸", action: "withdraw",   desc: "Withdraw earnings" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [groupLoading, setGroupLoading] = useState(true);
  const [hasGroup, setHasGroup] = useState(false);
  const [groupData, setGroupData] = useState(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showFixedAccountModal, setShowFixedAccountModal] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // FIX 1 — user guard is moved to AFTER all hooks.
  //
  // The original code had `if (!user) return <Navigate ... />` placed BEFORE
  // useEffect and useState calls, which violates React's Rules of Hooks.
  // When AuthContext briefly re-renders (e.g. token validation), this caused
  // Dashboard to fully unmount and remount, re-firing all useEffects.
  // That's why the console showed "Fetching wallet..." twice — Dashboard
  // was mounting again while /dashboard/contribute was open.
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return; // Don't fetch if not logged in
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found yet");
      return;
    }
    fetchBalance();
    fetchGroup();
  }, [user]); // depend on user so it re-runs if user changes

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setBalanceLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/wallet/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance || 0);
      } else {
        console.log("Wallet error:", data.message);
      }
    } catch (err) {
      console.log("Wallet fetch error:", err);
    }
    setBalanceLoading(false);
  };

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setGroupLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/api/groups/my-group/first`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.group) {
        setGroupData(data.group);
        setHasGroup(true);
      } else {
        setGroupData(null);
        setHasGroup(false);
      }
    } catch (err) {
      console.log("Error fetching group:", err);
      setHasGroup(false);
    }
    setGroupLoading(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // FIX 2 — user guard placed here, after all hooks, before render logic.
  // This is the correct location per React's Rules of Hooks.
  // ─────────────────────────────────────────────────────────────────────────
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case "fundWallet":
        setShowFixedAccountModal(true);
        break;

      case "contribute":
        if (groupLoading) {
          alert("Loading your group info...");
          return;
        }
        if (hasGroup && groupData) {
          navigate("/dashboard/contribute");
        } else {
          alert("You need to join a group first!");
        }
        break;

      case "history":
        navigate("/dashboard/transactions");
        break;

      case "withdraw":
        navigate("/dashboard/withdraw");
        break;

      default:
        break;
    }
  };

  const handleFixedAccountSuccess = () => {
    fetchBalance();
    setShowFixedAccountModal(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 pt-20 pb-10">

      {/* MODALS */}
      <FixedAccountModal
        isOpen={showFixedAccountModal}
        onClose={() => setShowFixedAccountModal(false)}
        onSuccess={handleFixedAccountSuccess}
      />

      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* WELCOME + BALANCE CARD */}
        <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 via-black to-yellow-900/10 p-4 md:p-6 shadow-xl backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            {/* LEFT SIDE */}
            <div className="flex-1 min-w-0">
              <p className="text-yellow-300/60 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">
                Welcome back
              </p>
              <h1 className="text-lg md:text-3xl font-black text-yellow-300 truncate">
                {user?.fullname || "User"}
              </h1>
              <p className="text-yellow-200/60 text-xs md:text-sm mt-1 leading-relaxed max-w-md">
                Manage ajo groups, wallet, contributions & savings easily from one dashboard.
              </p>
            </div>

            {/* RIGHT SIDE - BALANCE */}
            <div className="w-full md:w-auto md:min-w-[280px] rounded-2xl border border-yellow-400/20 bg-black/30 p-4 md:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-yellow-300/60 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">
                    Wallet Balance
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-300 leading-tight truncate">
                    {balanceLoading ? (
                      <span className="animate-pulse">...</span>
                    ) : balanceVisible ? (
                      `₦${balance.toLocaleString()}`
                    ) : (
                      "••••••••"
                    )}
                  </h2>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-yellow-400/10 transition flex-shrink-0"
                  title={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? (
                    <FaEye className="text-yellow-400" size={16} />
                  ) : (
                    <FaEyeSlash className="text-yellow-400" size={16} />
                  )}
                </button>
              </div>
              <p className="text-yellow-200/50 text-xs md:text-sm font-medium">
                {formatDollar(balance)}
              </p>
            </div>

          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="rounded-lg border border-yellow-400/25 bg-gradient-to-br from-yellow-500/8 via-black/40 to-yellow-900/8 p-3 md:p-3.5 hover:border-yellow-400/50 hover:from-yellow-500/15 hover:to-yellow-900/15 transition duration-300 backdrop-blur-sm group shadow-sm"
            >
              <div className="text-xl md:text-2xl mb-1.5 group-hover:scale-110 transition transform">
                {action.icon}
              </div>
              <h3 className="font-bold text-yellow-300 text-xs md:text-sm mb-0.5 leading-tight">
                {action.action === "contribute" && groupLoading ? "Loading..." : action.label}
              </h3>
              <p className="text-yellow-200/50 text-[9px] md:text-xs leading-tight">
                {action.desc}
              </p>
            </button>
          ))}
        </div>

        {/* GROUP SECTION */}
        {groupLoading ? (
          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400/30 border-t-yellow-400 mx-auto mb-4"></div>
              <p className="text-yellow-200/70">Loading group information...</p>
            </div>
          </div>

        ) : hasGroup ? (
          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                <p className="text-yellow-300/70 text-xs font-semibold uppercase tracking-wider">
                  Active Group
                </p>
              </div>
              <h2 className="text-3xl font-black text-yellow-300 mb-2">
                {groupData?.groupName}
              </h2>
              <p className="text-yellow-200/70 text-sm">
                Group Code:{" "}
                <span className="font-mono font-bold text-yellow-300">
                  {groupData?.groupCode}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">Members</p>
                <p className="text-2xl font-black text-yellow-300">
                  {groupData?.members?.length || 0}
                </p>
              </div>
              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">Contribution</p>
                <p className="text-2xl font-black text-yellow-300">
                  ₦{groupData?.contributionAmount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">Frequency</p>
                <p className="text-2xl font-black text-yellow-300">
                  {groupData?.frequency}
                </p>
              </div>
              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">Payout Cycle</p>
                <p className="text-2xl font-black text-yellow-300">
                  {groupData?.payoutDuration}d
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/group")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition flex items-center justify-center gap-2"
            >
              View Group Details
              <FaArrowRight size={16} />
            </button>
          </div>

        ) : (
          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm text-center">
            <FaUsers className="text-4xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-300 mb-3">No Group Yet</h3>
            <p className="text-yellow-200/70 mb-6 max-w-md mx-auto">
              Join an ajo group to start saving with others. Browse available groups or use a code to join friends.
            </p>
            <button
              onClick={() => navigate("/dashboard/join-group")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition flex items-center justify-center gap-2 mx-auto"
            >
              Join Group
              <FaArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </main>
  );
}