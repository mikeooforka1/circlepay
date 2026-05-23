import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import WelcomeGuideModal from "./components/WelcomeGuideModal";
import FixedAccountModal from "./components/Fixedaccountmodal";
import {
  FaUsers,
  FaPlusCircle,
  FaArrowRight,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;

  return `$${usd.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}

const quickActions = [
  {
    label: "Fund Wallet",
    icon: "💳",
    action: "fundWallet",
    desc: "Add funds to wallet",
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

  // Check if user exists
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {

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
{/* WELCOME + BALANCE */}
<div className="flex flex-row items-stretch gap-3">

  {/* WELCOME CARD */}
  <div className="flex-1 rounded-xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/8 via-black to-yellow-900/10 p-3 md:p-4 shadow-lg backdrop-blur-sm hover:border-yellow-400/50 transition-colors duration-300">

    <p className="text-yellow-300/60 text-[9px] md:text-xs font-semibold uppercase tracking-wider mb-1">
      Welcome back
    </p>

    <h1 className="text-sm md:text-lg font-bold text-yellow-300 mb-0.5 truncate">
      {user?.fullname || "User"}
    </h1>

    <p className="text-yellow-200/60 text-[10px] md:text-xs leading-snug">
      Manage ajo groups, wallet, contributions & savings
    </p>

  </div>

  {/* BALANCE CARD */}
  <div className="w-[48%] sm:w-[44%] md:w-[280px] flex-shrink-0 rounded-xl border border-yellow-400/30 bg-gradient-to-br from-yellow-500/10 to-black/60 p-3 md:p-4 shadow-lg backdrop-blur-sm hover:border-yellow-400/50 transition-colors duration-300 flex flex-col justify-between overflow-hidden">

    <p className="text-yellow-300/60 text-[8px] sm:text-[9px] md:text-xs font-semibold uppercase tracking-wider mb-2 truncate">
      Wallet Balance
    </p>

    <div className="space-y-1">

      <div className="flex items-center justify-between gap-1 w-full">

        <h2 className="text-xs sm:text-sm md:text-2xl font-black text-yellow-300 leading-tight truncate flex-1 overflow-hidden">

          {balanceLoading ? (

            <span className="animate-pulse">...</span>

          ) : balanceVisible ? (

            `₦${balance.toLocaleString()}`

          ) : (

            "••••••••"
          )}

        </h2>

        <button
          onClick={() => setBalanceVisible(!balanceVisible)}
          className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-lg hover:bg-yellow-400/15 transition flex-shrink-0"
          title={balanceVisible ? "Hide balance" : "Show balance"}
        >

          {balanceVisible ? (

            <FaEye
              className="text-yellow-400"
              size={window.innerWidth < 768 ? 12 : 16}
            />

          ) : (

            <FaEyeSlash
              className="text-yellow-400"
              size={window.innerWidth < 768 ? 12 : 16}
            />

          )}

        </button>

      </div>

      <p className="text-yellow-200/50 text-[8px] sm:text-[9px] md:text-xs font-medium truncate">
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
      onClick={() =>
        handleQuickAction(action.action)
      }
      className="rounded-lg border border-yellow-400/25 bg-gradient-to-br from-yellow-500/8 via-black/40 to-yellow-900/8 p-3 md:p-3.5 hover:border-yellow-400/50 hover:from-yellow-500/15 hover:to-yellow-900/15 transition duration-300 backdrop-blur-sm group shadow-sm"
    >

      <div className="text-xl md:text-2xl mb-1.5 group-hover:scale-110 transition transform">
        {action.icon}
      </div>

      <h3 className="font-bold text-yellow-300 text-xs md:text-sm mb-0.5 leading-tight">
        {action.label}
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

              <p className="text-yellow-200/70">
                Loading group information...
              </p>

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
                  ₦
                  {groupData?.contributionAmount?.toLocaleString() || 0}
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
              onClick={() =>
                navigate("/dashboard/group")
              }
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition flex items-center justify-center gap-2"
            >

              View Group Details

              <FaArrowRight size={16} />

            </button>

          </div>

        ) : (

          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm text-center">

            <FaUsers className="text-4xl text-yellow-400 mx-auto mb-4" />

            <h3 className="text-2xl font-bold text-yellow-300 mb-3">
              No Group Yet
            </h3>

            <p className="text-yellow-200/70 mb-6">
              Join or create an ajo group
              to start saving with others
            </p>

            <div className="flex flex-col md:flex-row gap-4">

              <button
                onClick={() =>
                  navigate("/dashboard/create-group")
                }
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition flex items-center justify-center gap-2"
              >

                <FaPlusCircle size={18} />

                Create Group

              </button>

              <button
                onClick={() =>
                  navigate("/dashboard/join-group")
                }
                className="flex-1 py-3 rounded-xl border border-yellow-400/50 text-yellow-300 font-bold hover:bg-yellow-400/10 transition"
              >
                Join Group
              </button>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}