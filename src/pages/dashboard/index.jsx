import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import WelcomeGuideModal from "./components/WelcomeGuideModal";
import { FaCopy } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const quickActions = [
  {
    label: "Buy Airtime",
    icon: "📱",
    action: "airtime",
    desc: "Recharge any network instantly",
  },
  {
    label: "Buy Data",
    icon: "🌐",
    action: "data",
    desc: "Affordable data bundles",
  },
  {
    label: "Transfer Money",
    icon: "💸",
    action: "transfer",
    desc: "Send money to any bank",
  },
  {
    label: "Pay Bills",
    icon: "🧾",
    action: "bills",
    desc: "Electricity, TV, Internet",
  },
  {
    label: "Fund Wallet",
    icon: "💳",
    action: "fund",
    desc: "Add money to your account",
  },
  {
    label: "Transaction History",
    icon: "📜",
    action: "history",
    desc: "View all your transactions",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showTransferLockMsg, setShowTransferLockMsg] = useState(false);
  const [accountDetails, setAccountDetails] = useState({
    virtualAccountNumber: "",
    virtualBankName: "",
    virtualAccountName: "",
    fullname: "",
  });
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Onboarding state
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true); // <-- loading state for backend check

  // Fetch wallet balance
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBalance(res.ok && typeof data.balance === "number" ? data.balance : 0);

      if (res.ok) {
        setAccountDetails({
          virtualAccountNumber: data.virtualAccountNumber,
          virtualBankName: data.virtualBankName,
          virtualAccountName: data.virtualAccountName,
          fullname: data.fullname,
        });
      }
    } catch {
      setBalance(0);
    }
    setBalanceLoading(false);
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/transactions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(res.ok && Array.isArray(data) ? data : []);
    } catch {
      setActivities([]);
    }
    setActivityLoading(false);
  };

  // Check onboarding status (facial recognition, transaction pin, login pin)
  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      setOnboardingLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_URL}/api/auth/user-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // Only prompt if the backend says it's missing
        if (res.ok) {
          if (!data.facialRecognitionDone) {
            navigate("/facial-recognition");
            return;
          }
          if (!data.transactionPinSet) {
            navigate("/set-transaction-code");
            return;
          }
          if (!data.loginPinSet) {
            navigate("/setloginpin");
            return;
          }
        }
        setOnboardingChecked(true);
      } catch {
        // If the check fails, allow dashboard to render (fail open)
        setOnboardingChecked(true);
      } finally {
        setOnboardingLoading(false);
      }
    };
    checkOnboarding();
    // eslint-disable-next-line
  }, [user, navigate]);

  useEffect(() => {
    let intervalId;
    if (user && onboardingChecked) {
      fetchBalance();
      fetchTransactions();
      intervalId = setInterval(() => {
        fetchBalance();
        fetchTransactions();
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line
  }, [user, onboardingChecked]);

  useEffect(() => {
    const handler = () => setShowAccountModal(true);
    window.addEventListener("openFundWalletModal", handler);
    return () => window.removeEventListener("openFundWalletModal", handler);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (onboardingLoading) {
    // Show loading only while checking backend onboarding status
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-yellow-400">
        <div className="text-xl font-bold">Loading your dashboard...</div>
      </div>
    );
  }

  if (!onboardingChecked) {
    // Prevent dashboard render until onboarding is checked
    return null;
  }

  // Quick action navigation (lock transfer)
  const handleQuickAction = (action) => {
    if (action === "transfer") {
      setShowTransferLockMsg(true);
      return;
    }
    switch (action) {
      case "airtime":
        navigate("/dashboard/airtime");
        break;
      case "data":
        navigate("/dashboard/data");
        break;
      case "bills":
        navigate("/dashboard/pay-bills");
        break;
      case "fund":
        setShowAccountModal(true); // <-- Show modal for Fund Wallet
        break;
      case "history":
        navigate("/dashboard/transactions"); // <-- Navigate to transactions page
        break;
      default:
        break;
    }
  };

  // Example function to pay a bill (airtime, data, TV, electricity)
  async function payBill({
    serviceID,      // e.g. "mtn", "gotv", "ikeja-electric"
    billType,       // e.g. "airtime", "data", "tv", "electricity"
    amount,         // e.g. 1000
    phone,          // recipient phone/account
    variation_code, // optional, for data/TV
    recipient       // optional, for bills
  }) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/wallet/pay-bill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        serviceID,
        billType,
        amount,
        phone,
        variation_code,
        recipient
      })
    });
    const data = await res.json();
    return data;
  }

  async function transferToBank({ amount, bankCode, accountNumber, accountName }) {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/wallet/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        amount,
        bankCode,
        accountNumber,
        accountName
      })
    });
    const data = await res.json();
    return data;
  }

  // Place this in your transfer page/component
  const handleTransfer = async (formValues) => {
    const result = await transferToBank(formValues);
    if (result.message === "Transfer initiated") {
      alert("Transfer started! Check your transaction history for updates.");
    } else {
      alert(result.message || "Transfer failed.");
    }
  };

  // Example usage with form values:
  // handleTransfer({
  //   amount,         // from user input
  //   bankCode,       // from user input
  //   accountNumber,  // from user input
  //   accountName     // from user input
  // });

  const handleCopyAccountNumber = () => {
    if (accountDetails.virtualAccountNumber) {
      navigator.clipboard.writeText(accountDetails.virtualAccountNumber)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
        .catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-black text-yellow-400 pt-28">
      {/* Account Card */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col items-center">
          {/* Balance Card */}
          <div className="w-full max-w-md bg-gradient-to-br from-yellow-400/80 via-yellow-700/70 to-yellow-400/80 rounded-3xl shadow-xl p-6 mb-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-black font-semibold text-lg">Account Balance</div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-black">
                  {balanceLoading ? "..." : `₦${balance.toLocaleString()}`}
                </div>
                <div className="text-yellow-900 font-semibold text-sm mt-1">
                  {balanceLoading ? "" : `${formatDollar(balance)}`}
                </div>
              </div>
              <img
                src="/assets/images/site-logo.png"
                alt="CirclePay Logo"
                className="w-14 h-14 rounded-full border-2 border-yellow-400 shadow"
              />
            </div>
            <div className="absolute bottom-4 right-6 text-xs text-yellow-900 font-semibold">
              {user.fullname || user.username}
            </div>
            {/* Transaction History Button - now absolutely at the bottom, blocking anything below */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -32,
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="w-11/12 max-w-xs px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:shadow-xl transition text-base border-2 border-yellow-700"
                onClick={() => navigate("/dashboard/transactions")}
                style={{
                  boxShadow: "0 8px 24px 0 rgba(255, 215, 0, 0.15)",
                }}
              >
                Transaction History
              </button>
            </div>
          </div>
          {/* Paystack Virtual Account Details Card */}
          <div className="w-full max-w-md bg-black rounded-3xl shadow-xl p-6 relative border border-yellow-400 mt-10">
            <div className="text-yellow-400 font-semibold text-lg mb-4 flex items-center gap-2">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="3" fill="#FFD700" fillOpacity="0.13"/>
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="#FFD700" strokeWidth="1.5"/>
                <rect x="6" y="9" width="12" height="2.5" rx="1.25" fill="#FFD700" fillOpacity="0.18"/>
                <rect x="6" y="13" width="6" height="2" rx="1" fill="#FFD700" fillOpacity="0.18"/>
              </svg>
              Fund via Bank Transfer
            </div>
            <div className="flex flex-col gap-2 text-base">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Account Number:</span>
                <div className="flex items-center justify-center mt-1">
                  <span className="text-yellow-400 text-xl font-bold">
                    {accountDetails.virtualAccountNumber || "---"}
                  </span>
                  {accountDetails.virtualAccountNumber && (
                    <button
                      type="button"
                      className="ml-2 text-yellow-400 hover:text-yellow-300 focus:outline-none"
                      onClick={handleCopyAccountNumber}
                      aria-label="Copy account number"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <FaCopy size={20} />
                    </button>
                  )}
                </div>
                {copied && (
                  <div className="text-emerald-400 text-xs font-semibold mt-1">Copied!</div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-300">Bank Name:</span>
                <span className="font-bold text-yellow-400">
                  {accountDetails.virtualBankName || <span className="text-yellow-700">---</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-300">Account Name:</span>
                <span className="font-bold text-yellow-400">
                  {accountDetails.virtualAccountName || accountDetails.fullname}
                </span>
              </div>
            </div>
            <div className="mt-4 text-xs text-yellow-300 text-center">
              <span>
                Send money to this account from any Nigerian bank.<br />
                Your wallet will be credited instantly after payment confirmation.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-xl font-bold text-yellow-400 mb-4 text-center">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {quickActions.map((action) => (
            action.action === "transfer" ? (
              <div
                key={action.action}
                className="flex flex-col items-center justify-center rounded-2xl border border-yellow-400 bg-black p-5 shadow relative cursor-pointer"
                onClick={() => handleQuickAction(action.action)}
                style={{ opacity: 0.7, pointerEvents: "auto" }}
              >
                <span className="absolute top-3 right-3">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#FFD700" fillOpacity="0.15"/>
                    <path d="M8 11V9a4 4 0 1 1 8 0v2" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="8" y="11" width="8" height="7" rx="2" stroke="#FFD700" strokeWidth="2" fill="#FFD700" fillOpacity="0.08"/>
                    <circle cx="12" cy="15" r="1" fill="#FFD700"/>
                  </svg>
                </span>
                <span className="text-3xl mb-2">{action.icon}</span>
                <span className="font-semibold text-yellow-400">{action.label}</span>
                <span className="text-xs text-yellow-200 mt-1 text-center">{action.desc}</span>
                <span className="mt-2 text-xs text-yellow-500 font-semibold">Locked</span>
              </div>
            ) : (
              <button
                key={action.action}
                className="flex flex-col items-center justify-center rounded-2xl border border-yellow-400 bg-black p-5 shadow hover:bg-yellow-900 transition"
                onClick={() => handleQuickAction(action.action)}
              >
                <span className="text-3xl mb-2">{action.icon}</span>
                <span className="font-semibold text-yellow-400">{action.label}</span>
                <span className="text-xs text-yellow-200 mt-1 text-center">{action.desc}</span>
              </button>
            )
          ))}
        </div>
      </section>

      {/* Modals */}
      {showGuideModal && (
        <WelcomeGuideModal
          onClose={() => setShowGuideModal(false)}
        />
      )}

      {/* Transfer Lock Popup */}
      {showTransferLockMsg && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-yellow-900 border border-yellow-400 rounded-2xl p-8 shadow-xl text-center max-w-xs mx-auto">
            <div className="mb-3 flex justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#FFD700" fillOpacity="0.18"/>
                <path d="M8 11V9a4 4 0 1 1 8 0v2" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
                <rect x="8" y="11" width="8" height="7" rx="2" stroke="#FFD700" strokeWidth="2" fill="#FFD700" fillOpacity="0.08"/>
                <circle cx="12" cy="15" r="1" fill="#FFD700"/>
              </svg>
            </div>
            <div className="text-lg font-bold text-yellow-400 mb-2">Feature Locked</div>
            <div className="text-yellow-200 mb-4">
              This feature is not available yet.<br />Stay tuned!
            </div>
            <button
              className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow"
              onClick={() => setShowTransferLockMsg(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Fund Wallet Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-yellow-900 border border-yellow-400 rounded-2xl p-8 shadow-xl text-center max-w-xs mx-auto">
            <div className="mb-3 flex justify-center">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="14" rx="3" fill="#FFD700" fillOpacity="0.13"/>
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="#FFD700" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="text-lg font-bold text-yellow-400 mb-2">Fund Your Wallet</div>
            <div className="text-yellow-200 mb-4">
              <div>
                <span className="font-semibold">Account Number:</span><br />
                <span className="text-yellow-400 text-xl font-bold flex items-center gap-2">
                  {accountDetails.virtualAccountNumber || "---"}
                  {accountDetails.virtualAccountNumber && (
                    <button
                      type="button"
                      className="ml-2 text-yellow-400 hover:text-yellow-300 focus:outline-none"
                      onClick={handleCopyAccountNumber}
                      aria-label="Copy account number"
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                    >
                      <FaCopy />
                    </button>
                  )}
                  {copied && (
                    <span className="ml-2 text-emerald-400 text-xs font-semibold">Copied!</span>
                  )}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Bank Name:</span><br />
                <span className="text-yellow-400">{accountDetails.virtualBankName || "---"}</span>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Account Name:</span><br />
                <span className="text-yellow-400">{accountDetails.virtualAccountName || accountDetails.fullname}</span>
              </div>
              <div className="mt-4 text-xs text-yellow-300 text-center">
                Send money to this account from any Nigerian bank.<br />
                Your wallet will be credited instantly after payment confirmation.
              </div>
            </div>
            <button
              className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow"
              onClick={() => setShowAccountModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Referral Reward Bonus Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="bg-yellow-900 border border-yellow-400 rounded-2xl shadow-xl p-6 flex flex-col items-center">
          <div className="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#FFD700" fillOpacity="0.13"/>
              <path d="M12 7v5l3 3" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Referral Reward Bonus
          </div>
          <div className="text-yellow-200 mb-4 text-center">
            Earn bonuses when your friends join CirclePay using your referral link and make their first transaction!
          </div>
          <button
            className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition"
            onClick={() => navigate("/dashboard/rewards")}
          >
            Proceed
          </button>
        </div>
      </section>

      <div className="mt-16 text-center text-yellow-400 text-base">
        <span className="font-semibold text-yellow-400">CirclePay</span> — Fast, secure, and reliable digital banking for everyone.
      </div>
      <style>{`
        @media (max-width: 900px) {
          .max-w-2xl, .max-w-3xl {
            padding: 0.5rem !important;
          }
        }
        @media (max-width: 640px) {
          main {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .max-w-2xl, .max-w-3xl {
            padding: 0.5rem !important;
          }
          .pt-28 {
            padding-top: 4.5rem !important;
          }
          .pb-8 {
            padding-bottom: 1.5rem !important;
          }
          .mb-16 {
            margin-bottom: 2.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}
