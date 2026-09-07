import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import FixedAccountModal from "./components/Fixedaccountmodal";
import {
  FaUsers,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaUniversity,
  FaCopy,
  FaCheckCircle,
  FaShieldAlt
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const quickActions = [
  { label: "Make Deposit",   icon: "💳", action: "fundWallet", desc: "Transfer to Group Head" },
  { label: "Contribute",    icon: "💰", action: "contribute", desc: "Log ajo contribution" },
  { label: "History",       icon: "📊", action: "history",    desc: "View transaction history" },
  { label: "Withdraw",      icon: "💸", action: "withdraw",   desc: "Withdraw earnings" },
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
  const [showFixedAccountModal, setShowFixedAccountModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchBalance();
    fetchGroup();
  }, [user]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.log("Wallet fetch error:", err);
    }
    setBalanceLoading(false);
  };

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/my-group/first`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.group) {
        setGroupData(data.group);
        setHasGroup(true);
      } else {
        setGroupData(null);
        setHasGroup(false);
      }
    } catch (err) {
      setHasGroup(false);
    }
    setGroupLoading(false);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCopyAccount = () => {
    if (groupData?.collectionAccountNumber) {
      navigator.clipboard.writeText(groupData.collectionAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "fundWallet":
      case "contribute":
        if (hasGroup && groupData) {
          navigate("/dashboard/contribute");
        } else {
          setShowFixedAccountModal(true);
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 pt-20 pb-16">
      
      <FixedAccountModal
        isOpen={showFixedAccountModal}
        onClose={() => setShowFixedAccountModal(false)}
        hasGroup={hasGroup}
        groupData={groupData}
      />

      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* TOP WELCOME & BALANCE BANNER */}
        <div className="rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 via-black to-yellow-900/10 p-6 md:p-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">CirclePay Ajo</span>
                <FaShieldAlt className="text-yellow-400 text-xs" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-yellow-300">
                Welcome, {user?.fullname?.split(' ')[0] || "Member"}!
              </h1>
              <p className="text-yellow-200/60 text-xs md:text-sm mt-1 max-w-md">
                Manage your rotational savings circles, timestamped deposits, and payout rotations.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-400/30 bg-black/50 p-5 min-w-[280px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-yellow-200/50 uppercase font-semibold">Wallet Balance</span>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  {balanceVisible ? <FaEye size={15} /> : <FaEyeSlash size={15} />}
                </button>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-yellow-300">
                {balanceLoading ? "..." : balanceVisible ? `₦${Number(balance).toLocaleString()}` : "••••••••"}
              </p>
              <p className="text-xs text-yellow-200/40 mt-1">{formatDollar(balance)} USD</p>
            </div>
          </div>
        </div>

        {/* ── ACTIVE GROUP COLLECTION BANNER ── */}
        {hasGroup && groupData && groupData.status === 'active' && (
          <div className="rounded-3xl border-2 border-yellow-400/40 bg-gradient-to-r from-yellow-900/20 via-black/80 to-yellow-950/30 p-6 md:p-7 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-2xl flex-shrink-0">
                  <FaUniversity />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-yellow-300">
                      {groupData?.groupName} — Deposit Account
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-[10px] font-bold">
                      Group Head Account
                    </span>
                  </div>
                  <p className="text-yellow-200/60 text-xs mt-0.5">
                    Make your contribution transfer to this account and submit your proof for timestamp verification.
                  </p>
                </div>
              </div>

              {/* Account Display */}
              <div className="flex items-center gap-3 bg-black/60 border border-yellow-400/30 px-5 py-3 rounded-2xl">
                <div>
                  <p className="text-[10px] text-yellow-200/50 uppercase font-semibold">
                    {groupData?.collectionBankName}
                  </p>
                  <p className="text-xl font-black font-mono tracking-wider text-yellow-300">
                    {groupData?.collectionAccountNumber}
                  </p>
                  <p className="text-[10px] text-yellow-200/60 truncate max-w-[180px]">
                    {groupData?.collectionAccountName}
                  </p>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="p-3 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 transition flex-shrink-0"
                  title="Copy Account Number"
                >
                  {copied ? <FaCheckCircle className="text-emerald-400" size={18} /> : <FaCopy size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="rounded-2xl border border-yellow-400/20 bg-black/40 p-4 hover:border-yellow-400/50 hover:bg-yellow-500/10 transition duration-200 text-left group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
              <h4 className="font-bold text-yellow-300 text-sm">{action.label}</h4>
              <p className="text-yellow-200/50 text-xs mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* GROUP SECTION */}
        {groupLoading ? (
          <div className="text-center py-12 rounded-3xl border border-yellow-400/30 bg-black/40">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto mb-3" />
            <p className="text-yellow-200/60 text-xs">Loading Ajo circle information...</p>
          </div>
        ) : hasGroup && groupData?.status === 'pending_approval' ? (
          /* ── PENDING SUPER ADMIN APPROVAL CARD ── */
          <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/20 via-black to-amber-950/10 p-6 md:p-8 shadow-xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 text-xl">
              ⏳
            </div>
            <h3 className="text-xl font-black text-yellow-300">
              "{groupData?.name || groupData?.groupName}" is Awaiting Approval
            </h3>
            <p className="text-xs text-yellow-200/70 max-w-md mx-auto leading-relaxed">
              Your circle creation payment proof of <strong>₦{Number(groupData?.creationFeePaid || 0).toLocaleString()}</strong> was received. Super Admin is verifying your payment. Once approved, your invite code will be activated.
            </p>
            <p className="text-[11px] font-mono text-yellow-400">
              Reference: {groupData?.creationTransactionRef} • Submitted: {new Date(groupData?.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ) : hasGroup && groupData?.status === 'active' ? (
          /* ── ACTIVE GROUP DISPLAY ── */
          <div className="rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-900/10 p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-xs font-bold mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Savings Circle
                </span>
                <h3 className="text-2xl font-black text-yellow-300">{groupData?.groupName || groupData?.name}</h3>
                <p className="text-yellow-200/60 text-xs">Group Code: <span className="font-mono font-bold text-yellow-400">{groupData?.groupCode}</span></p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/dashboard/contribute")}
                  className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-black text-sm hover:shadow-lg transition"
                >
                  Make Contribution
                </button>
                <button
                  onClick={() => navigate("/dashboard/group")}
                  className="px-5 py-3 rounded-xl border border-yellow-400/40 text-yellow-300 font-bold hover:bg-yellow-400/10 text-sm flex items-center gap-2 transition"
                >
                  View Group <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 bg-black/50 rounded-2xl border border-yellow-400/20">
                <p className="text-xs text-yellow-200/50">Members</p>
                <p className="text-xl font-black text-yellow-300">{groupData?.members?.length || 0} / {groupData?.maxMembers}</p>
              </div>
              <div className="p-3.5 bg-black/50 rounded-2xl border border-yellow-400/20">
                <p className="text-xs text-yellow-200/50">Contribution</p>
                <p className="text-xl font-black text-yellow-300">₦{Number(groupData?.contributionAmount || 0).toLocaleString()}</p>
              </div>
              <div className="p-3.5 bg-black/50 rounded-2xl border border-yellow-400/20">
                <p className="text-xs text-yellow-200/50">Frequency</p>
                <p className="text-xl font-black text-yellow-300">{groupData?.frequency}</p>
              </div>
              <div className="p-3.5 bg-black/50 rounded-2xl border border-yellow-400/20">
                <p className="text-xs text-yellow-200/50">Payout Cycle</p>
                <p className="text-xl font-black text-yellow-300">{groupData?.payoutDuration} Days</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-yellow-400/30 bg-black/40 p-8 text-center max-w-xl mx-auto">
            <FaUsers className="text-4xl text-yellow-400 mx-auto mb-3" />
            <h3 className="text-2xl font-black text-yellow-300 mb-2">You Have No Active Circle</h3>
            <p className="text-yellow-200/60 text-xs mb-6">
              Join an existing Ajo group or create a new one as Group Head before making contributions.
            </p>
            <button
              onClick={() => navigate("/dashboard/join-group")}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm hover:shadow-xl transition"
            >
              Join or Create Group →
            </button>
          </div>
        )}

      </div>
    </main>
  );
}