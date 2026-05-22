import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import WelcomeGuideModal from "./components/WelcomeGuideModal";
import { FaCopy, FaUsers, FaPlusCircle } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const quickActions = [
  {
    label: "Contribute",
    icon: "💰",
    action: "contribute",
    desc: "Make ajo contribution",
  },
  {
    label: "Savings History",
    icon: "📜",
    action: "history",
    desc: "View contribution history",
  },
  {
    label: "Fund Wallet",
    icon: "💳",
    action: "fund",
    desc: "Add money to your wallet",
  },
  {
    label: "Withdraw",
    icon: "🏦",
    action: "withdraw",
    desc: "Withdraw your earnings",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const [activities, setActivities] = useState([]);

  const [groupLoading, setGroupLoading] = useState(true);
  const [hasGroup, setHasGroup] = useState(false);
  const [groupData, setGroupData] = useState(null);

  const [showGuideModal, setShowGuideModal] = useState(false);

  const [accountDetails, setAccountDetails] = useState({
    fixedAccountNumber: "2034567891",
    fixedBankName: "CirclePay Microfinance Bank",
    fixedAccountName: "CirclePay Integrated Services",
  });

  const [copied, setCopied] = useState(false);

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
      setHasGroup(false);
    }

    setGroupLoading(false);
  };

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(
      accountDetails.fixedAccountNumber
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "contribute":
        navigate("/dashboard/contribute");
        break;

      case "history":
        navigate("/dashboard/transactions");
        break;

      case "fund":
        navigate("/dashboard/fund-wallet");
        break;

      case "withdraw":
        navigate("/dashboard/withdraw");
        break;

      default:
        break;
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="min-h-screen bg-black text-yellow-400 pt-24 pb-10">

      {/* HEADER */}
      <section className="max-w-6xl mx-auto px-4">

        <div className="rounded-3xl overflow-hidden border border-yellow-400 bg-gradient-to-br from-yellow-500/20 via-black to-yellow-900/30 shadow-2xl">

          <div className="p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <p className="text-yellow-300 text-sm">
                  Welcome back
                </p>

                <h1 className="text-3xl md:text-4xl font-extrabold">
                  {user.fullname || user.username}
                </h1>

                <p className="mt-2 text-yellow-200 max-w-lg">
                  Manage your ajo contributions, monitor your payout cycle,
                  and grow your savings securely with CirclePay.
                </p>
              </div>

              <img
                src="/assets/images/site-logo.png"
                alt="logo"
                className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl"
              />
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

              <div className="rounded-2xl bg-black/60 border border-yellow-500 p-5">
                <p className="text-yellow-300 text-sm">
                  Wallet Balance
                </p>

                <h2 className="text-3xl font-extrabold mt-2">
                  {balanceLoading
                    ? "..."
                    : `₦${balance.toLocaleString()}`}
                </h2>

                <p className="text-yellow-200 mt-1">
                  {formatDollar(balance)}
                </p>
              </div>

              <div className="rounded-2xl bg-black/60 border border-yellow-500 p-5">
                <p className="text-yellow-300 text-sm">
                  Current Status
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {hasGroup ? "Active Group" : "No Group Yet"}
                </h2>

                <p className="text-yellow-200 mt-1">
                  {hasGroup
                    ? "You are actively participating in an ajo cycle."
                    : "Create or join an ajo group to begin saving."}
                </p>
              </div>

              <div className="rounded-2xl bg-black/60 border border-yellow-500 p-5">
                <p className="text-yellow-300 text-sm">
                  Next Payout
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {groupData?.nextPayoutDate || "--"}
                </h2>

                <p className="text-yellow-200 mt-1">
                  Automated system payout schedule.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* GROUP SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        {!groupLoading && !hasGroup ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="rounded-3xl border border-yellow-400 bg-black p-8 shadow-xl">

              <div className="flex items-center gap-3">
                <FaPlusCircle className="text-3xl" />
                <h2 className="text-2xl font-bold">
                  Create Ajo Group
                </h2>
              </div>

              <p className="mt-4 text-yellow-200">
                Start your own savings contribution group and invite trusted
                members to contribute daily, weekly, or monthly.
              </p>

              <button
                onClick={() => navigate("/dashboard/create-group")}
                className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg"
              >
                Create Group
              </button>
            </div>

            <div className="rounded-3xl border border-yellow-400 bg-black p-8 shadow-xl">

              <div className="flex items-center gap-3">
                <FaUsers className="text-3xl" />
                <h2 className="text-2xl font-bold">
                  Join Existing Group
                </h2>
              </div>

              <p className="mt-4 text-yellow-200">
                Join a trusted CirclePay ajo contribution group using a
                secure group code from friends, family, or cooperatives.
              </p>

              <button
                onClick={() => navigate("/dashboard/join-group")}
                className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg"
              >
                Join Group
              </button>
            </div>

          </div>
        ) : (
          <div className="rounded-3xl border border-yellow-400 bg-black p-8 shadow-xl">

            <div className="flex items-center justify-between flex-wrap gap-4">

              <div>
                <h2 className="text-3xl font-bold">
                 {groupData?.groupName}
                </h2>

                <p className="text-yellow-200 mt-2">
                  Manage your contribution cycle and track group activities.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard/group")}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg"
              >
                Open Group
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-5">

              <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-4">
                <p className="text-sm text-yellow-300">
                  Members
                </p>

                <h3 className="text-2xl font-bold mt-2">
                 {groupData?.members?.length || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-4">
                <p className="text-sm text-yellow-300">
                  Contribution
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  ₦{groupData?.contributionAmount || 0}
                </h3>
              </div>

              <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-4">
                <p className="text-sm text-yellow-300">
                  Frequency
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  {groupData?.frequency || "Weekly"}
                </h3>
              </div>

              <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-4">
                <p className="text-sm text-yellow-300">
                  Next Recipient
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {groupData?.nextRecipient || "--"}
                </h3>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* FIXED BANK ACCOUNT */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <div className="rounded-3xl border border-yellow-400 bg-black p-8 shadow-xl">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>
              <h2 className="text-2xl font-bold">
                Fund Wallet via Bank Transfer
              </h2>

              <p className="text-yellow-200 mt-2">
                Transfer money to the fixed CirclePay account below to fund your wallet.
              </p>
            </div>

          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-5">
              <p className="text-yellow-300 text-sm">
                Bank Name
              </p>

              <h3 className="text-xl font-bold mt-2">
                {accountDetails.fixedBankName}
              </h3>
            </div>

            <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-5">
              <p className="text-yellow-300 text-sm">
                Account Number
              </p>

              <div className="flex items-center gap-3 mt-2">

                <h3 className="text-2xl font-bold">
                  {accountDetails.fixedAccountNumber}
                </h3>

                <button
                  onClick={handleCopyAccountNumber}
                  className="text-yellow-400"
                >
                  <FaCopy />
                </button>

              </div>

              {copied && (
                <p className="text-green-400 text-sm mt-2">
                  Copied Successfully
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-yellow-900/20 border border-yellow-500 p-5">
              <p className="text-yellow-300 text-sm">
                Account Name
              </p>

              <h3 className="text-xl font-bold mt-2">
                {accountDetails.fixedAccountName}
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <h2 className="text-2xl font-bold mb-5">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {quickActions.map((action) => (
            <button
              key={action.action}
              onClick={() => handleQuickAction(action.action)}
              className="rounded-3xl border border-yellow-400 bg-black hover:bg-yellow-900 transition p-6 text-center shadow-xl"
            >
              <div className="text-4xl">
                {action.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold">
                {action.label}
              </h3>

              <p className="text-sm text-yellow-200 mt-2">
                {action.desc}
              </p>
            </button>
          ))}

        </div>
      </section>

      {/* REFERRAL SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-10">

        <div className="rounded-3xl bg-gradient-to-r from-yellow-700/30 to-yellow-900/30 border border-yellow-400 p-8 shadow-xl">

          <h2 className="text-3xl font-bold">
            Referral Rewards
          </h2>

          <p className="mt-3 text-yellow-200 max-w-2xl">
            Invite friends to CirclePay and earn referral bonuses whenever
            they join and start contributing in ajo groups.
          </p>

          <button
            onClick={() => navigate("/dashboard/rewards")}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg"
          >
            View Rewards
          </button>

        </div>
      </section>

      {showGuideModal && (
        <WelcomeGuideModal
          onClose={() => setShowGuideModal(false)}
        />
      )}
    </main>
  );
}