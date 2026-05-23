import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import WelcomeGuideModal from "./components/WelcomeGuideModal";
import FixedAccountModal from "./components/Fixedaccountmodal";
import { FaCopy, FaUsers, FaPlusCircle, FaArrowRight, FaCreditCard, FaEye, FaEyeSlash } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const quickActions = [
  {
    label: "Fund Wallet",
    icon: "💳",
    action: "fundWallet",
    desc: "Add funds via bank transfer",
  },
  {
    label: "Contribute",
    icon: "💰",
    action: "contribute",
    desc: "Make ajo contribution",
  },
  {
    label: "History",
    icon: "📊",
    action: "history",
    desc: "View transaction history",
  },
  {
    label: "Withdraw",
    icon: "💸",
    action: "withdraw",
    desc: "Withdraw earnings",
  },
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
  const [copied, setCopied] = useState(false);

  const [fixedAccountDetails, setFixedAccountDetails] = useState({
    accountNumber: "2034567891",
    bankName: "CirclePay Microfinance Bank",
    accountName: "CirclePay Integrated Services",
  });

  // Check if user exists
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    // Show guide modal for first-time users (you can customize this logic)
    // setShowGuideModal(true);
    fetchBalance();
    fetchGroup();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/wallet/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance || 0);
      }
    } catch (err) {
      console.log(err);
    }

    setBalanceLoading(false);
  };

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/groups/my-group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.group) {
        setHasGroup(true);
        setGroupData(data.group);
      } else {
        setHasGroup(false);
      }
    } catch (err) {
      console.log("Error fetching group:", err);
      setHasGroup(false);
    }

    setGroupLoading(false);
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(fixedAccountDetails.accountNumber);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "fundWallet":
        setShowFixedAccountModal(true);
        break;

      case "contribute":
        if (hasGroup) {
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

  const handleFixedAccountSuccess = (data) => {
    // Refresh balance after successful deposit
    fetchBalance();
    setShowFixedAccountModal(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 pt-20 pb-10">
      {/* Modals */}
      <FixedAccountModal
        isOpen={showFixedAccountModal}
        onClose={() => setShowFixedAccountModal(false)}
        onSuccess={handleFixedAccountSuccess}
      />

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Welcome Section */}
        <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-yellow-300/70 text-sm font-semibold uppercase tracking-wider mb-2">
                Welcome back
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-2">
                {user?.fullname || "User"}
              </h1>
              <p className="text-yellow-200/70 text-sm md:text-base max-w-lg">
                Manage your wallet, ajo groups, and track all your savings activity in one place.
              </p>
            </div>

            {/* Balance Card */}
            <div className="rounded-2xl bg-black/40 border border-yellow-400/30 p-6 md:p-8 backdrop-blur-sm">
              <p className="text-yellow-300/70 text-xs font-semibold uppercase tracking-wider mb-3">
                Wallet Balance
              </p>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-black text-yellow-300">
                  {balanceLoading ? (
                    <span className="animate-pulse">...</span>
                  ) : balanceVisible ? (
                    `₦${balance.toLocaleString()}`
                  ) : (
                    "••••••"
                  )}
                </h2>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-2 hover:bg-yellow-400/10 rounded-lg transition"
                  title={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? (
                    <FaEye className="text-yellow-400" size={18} />
                  ) : (
                    <FaEyeSlash className="text-yellow-400" size={18} />
                  )}
                </button>
              </div>
              <p className="text-yellow-200/60 text-xs">
                {formatDollar(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.action)}
              className="rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5 p-6 hover:border-yellow-400/60 hover:bg-yellow-500/15 transition duration-300 backdrop-blur-sm group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition">
                {action.icon}
              </div>
              <h3 className="font-bold text-yellow-300 text-sm mb-1">
                {action.label}
              </h3>
              <p className="text-yellow-200/60 text-xs leading-tight">
                {action.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Group Section */}
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
                Group Code: <span className="font-mono font-bold text-yellow-300">{groupData?.groupCode}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                  Members
                </p>
                <p className="text-2xl font-black text-yellow-300">
                  {groupData?.members?.length || 0}
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                  Contribution
                </p>
                <p className="text-2xl font-black text-yellow-300">
                  ₦{groupData?.contributionAmount?.toLocaleString() || 0}
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                  Frequency
                </p>
                <p className="text-2xl font-black text-yellow-300">
                  {groupData?.frequency}
                </p>
              </div>

              <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                  Payout Cycle
                </p>
                <p className="text-2xl font-black text-yellow-300">
                  {groupData?.payoutDuration}d
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard/group")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition flex items-center justify-center gap-2"
            >
              View Group Details <FaArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm text-center">
            <FaUsers className="text-4xl text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-300 mb-3">
              No Group Yet
            </h3>
            <p className="text-yellow-200/70 mb-6">
              Join or create an ajo group to start saving with friends
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => navigate("/dashboard/create-group")}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <FaPlusCircle size={18} /> Create Group
              </button>
              <button
                onClick={() => navigate("/dashboard/join-group")}
                className="flex-1 py-3 rounded-xl border border-yellow-400/50 text-yellow-300 font-bold hover:bg-yellow-400/10 transition"
              >
                Join Group
              </button>
            </div>
          </div>
        )}

        {/* Fixed Account Card */}
        <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-blue-500/10 to-blue-900/5 p-8 md:p-10 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-yellow-300/70 text-xs font-semibold uppercase tracking-wider mb-2">
                💳 Our Fixed Account
              </p>
              <h3 className="text-2xl font-bold text-yellow-300 mb-3">
                Fund Your Wallet via Bank Transfer
              </h3>
              <p className="text-yellow-200/70 text-sm max-w-2xl">
                Transfer funds directly to our fixed account and your wallet will be credited instantly after verification.
              </p>
            </div>

            <button
              onClick={() => setShowFixedAccountModal(true)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-black font-bold hover:scale-105 transition flex items-center gap-2 flex-shrink-0"
            >
              <FaCreditCard size={18} /> Fund Now
            </button>
          </div>

          {/* Account Details Preview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-black/40 border border-yellow-400/20 p-4">
              <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                Account Number
              </p>
              <p className="text-lg font-mono font-bold text-yellow-300 mb-2">
                {fixedAccountDetails.accountNumber}
              </p>
              <button
                onClick={handleCopyAccountNumber}
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
              >
                <FaCopy size={12} /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="rounded-xl bg-black/40 border border-yellow-400/20 p-4">
              <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                Bank Name
              </p>
              <p className="text-lg font-bold text-yellow-300">
                {fixedAccountDetails.bankName}
              </p>
            </div>

            <div className="rounded-xl bg-black/40 border border-yellow-400/20 p-4">
              <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                Account Name
              </p>
              <p className="text-lg font-bold text-yellow-300">
                {fixedAccountDetails.accountName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}