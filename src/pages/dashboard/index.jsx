import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import BankDetailsModal from "./components/BankDetailsModal";
import WelcomeGuideModal from "./components/WelcomeGuideModal";

// Nigerian stocks data
const stocks = [
  { symbol: "ZENITHBANK", name: "Zenith Bank Plc", price: "₦38.50", change: "+0.52%" },
  { symbol: "GTCO", name: "GTCO", price: "₦41.20", change: "-0.15%" },
  { symbol: "ACCESSCORP", name: "Access Holdings", price: "₦19.80", change: "+1.10%" },
  { symbol: "UBA", name: "United Bank for Africa", price: "₦17.50", change: "+0.30%" },
  { symbol: "MTNN", name: "MTN Nigeria", price: "₦245.00", change: "+0.80%" },
  { symbol: "AIRTELAFRI", name: "Airtel Africa", price: "₦1,650.00", change: "-0.10%" },
  { symbol: "DANGCEM", name: "Dangote Cement", price: "₦320.00", change: "-0.25%" },
  { symbol: "BUACEMENT", name: "BUA Cement", price: "₦98.00", change: "+0.40%" },
  { symbol: "WAPCO", name: "Lafarge Africa Plc", price: "₦31.00", change: "+0.20%" },
  { symbol: "NB", name: "Nigerian Breweries Plc", price: "₦38.00", change: "+0.15%" },
  { symbol: "GUINNESS", name: "Guinness Nigeria Plc", price: "₦70.00", change: "-0.05%" },
  { symbol: "CADBURY", name: "Cadbury Nigeria Plc", price: "₦17.80", change: "+0.25%" },
  { symbol: "DANGSUGAR", name: "Dangote Sugar Refinery", price: "₦45.00", change: "+0.10%" },
  { symbol: "SEPLAT", name: "Seplat Energy", price: "₦1,450.00", change: "+0.90%" },
  { symbol: "CONOIL", name: "Conoil Plc", price: "₦55.00", change: "-0.20%" },
  { symbol: "ARADEL", name: "Aradel Holdings", price: "₦1,200.00", change: "+0.60%" },
  { symbol: "TRANSCOHOT", name: "Transcorp Hotels Plc", price: "₦12.50", change: "+0.05%" },
  { symbol: "NAHCO", name: "NAHCO Plc", price: "₦19.00", change: "+0.10%" },
  { symbol: "CUSTODIAN", name: "Custodian Investment Plc", price: "₦7.80", change: "+0.08%" },
];

// Sectors grouping
const categories = [
  {
    sector: "Banking",
    companies: ["ZENITHBANK", "GTCO", "ACCESSCORP", "UBA"],
    desc: "Stable stocks with consistent dividend history.",
  },
  {
    sector: "Industrial Goods / Cement",
    companies: ["DANGCEM", "BUACEMENT", "WAPCO"],
    desc: "Dominant players in construction and infrastructure.",
  },
  {
    sector: "Consumer Goods",
    companies: ["NB", "GUINNESS", "CADBURY", "DANGSUGAR"],
    desc: "Producers of everyday items with large market reach.",
  },
  {
    sector: "Telecommunications",
    companies: ["MTNN", "AIRTELAFRI"],
    desc: "High-cap companies driven by Nigeria's mobile/data usage.",
  },
  {
    sector: "Oil and Gas",
    companies: ["SEPLAT", "CONOIL", "ARADEL"],
    desc: "Exploration, production, and distribution of petroleum.",
  },
  {
    sector: "Others",
    companies: ["TRANSCOHOT", "NAHCO", "CUSTODIAN"],
    desc: "Hospitality, aviation services, and insurance.",
  },
];

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [earnings, setEarnings] = useState(0);
  const [investments, setInvestments] = useState([]);
  const [investmentsLoading, setInvestmentsLoading] = useState(true);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(true); // Assume true, check from API

  // Fetch wallet balance
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBalance(res.ok && typeof data.balance === "number" ? data.balance : 0);
    } catch {
      setBalance(0);
    }
    setBalanceLoading(false);
  };

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActivities(res.ok && Array.isArray(data.activities) ? data.activities : []);
    } catch {
      setActivities([]);
    }
    setActivityLoading(false);
  };

  // Fetch earnings
  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEarnings(res.ok && typeof data.earnings === "number" ? data.earnings : 0);
    } catch {
      setEarnings(0);
    }
  };

  // Fetch investments
  const fetchInvestments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/investment/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvestments(res.ok && Array.isArray(data.investments) ? data.investments : []);
    } catch {
      setInvestments([]);
    }
    setInvestmentsLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchActivities();
      fetchEarnings();
      fetchInvestments();
      // Check if user has bank details
      fetch(`${API_URL}/api/users/bank-details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(res => res.json())
        .then(data => {
          console.log("Bank details API response:", data); // <-- Add this line
          if (!data.hasBankDetails) {
            setHasBankDetails(false);
            setShowBankModal(true);
          }
        });
    }
    // eslint-disable-next-line
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleAddFunds = () => navigate("/dashboard/payment");
  const handleWithdraw = () => navigate("/dashboard/withdraw", { state: { maxAmount: earnings } });
  const handleBankDetailsSubmitted = () => {
    setShowBankModal(false);
    setHasBankDetails(true);
    setShowGuideModal(true);
  };

  // Helper to check investment status
  function getInvestmentStatus(inv) {
    if (inv.status !== "active") return inv.status;
    if (!inv.duration || !inv.createdAt) return inv.status;
    const startDate = new Date(inv.createdAt);
    const endDate = new Date(startDate.getTime() + inv.duration * 24 * 60 * 60 * 1000);
    const now = new Date();
    return now >= endDate ? "completed" : "active";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10">
          {/* Left: Welcome & Info */}
          <div className="w-full md:w-2/3 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Welcome, {user.fullname || user.username}
            </h1>
            <p className="text-slate-700 max-w-2xl text-lg mb-4">
              Your CirclePay dashboard. Track your balance, monitor your earnings, and invest in Nigeria’s top stocks with confidence and ease.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold shadow">
                Secure &amp; Automated
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold shadow">
                Real-Time Portfolio
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold shadow">
                Multi-Sector Support
              </span>
            </div>
          </div>
          {/* Right: Balance Card */}
          <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
            <div className="rounded-3xl border border-blue-100 bg-white shadow-xl p-8 flex flex-col items-center">
              <span className="text-blue-700 text-base font-semibold">Total Balance</span>
              <span className="mt-2 text-4xl font-extrabold tracking-tight text-slate-800">
                {balanceLoading ? "..." : `₦${balance.toLocaleString()}`}
                <span className="ml-2 text-cyan-600 text-lg font-bold">
                  {balanceLoading ? "" : `(${formatDollar(balance)})`}
                </span>
              </span>
              <button
                className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-base shadow hover:scale-105 transition"
                onClick={handleAddFunds}
              >
                Add Funds
              </button>
              <div className="mt-4 text-xs text-blue-500 text-center max-w-[180px]">
                Instantly fund your wallet and start investing in premium Nigerian stocks.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 flex flex-col items-center shadow-lg">
          <div className="text-blue-700 text-base font-semibold">Balance</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800">
            {balanceLoading ? "..." : `₦${balance.toLocaleString()}`}
            <span className="ml-2 text-cyan-600 text-lg font-bold">
              {balanceLoading ? "" : `(${formatDollar(balance)})`}
            </span>
          </div>
          <button
            className="mt-4 px-5 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow transition"
            onClick={handleAddFunds}
          >
            Add Funds
          </button>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-6 flex flex-col items-center shadow-lg">
          <div className="text-blue-700 text-base font-semibold">Earnings</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800">
            {investmentsLoading ? "..." : `₦${earnings.toLocaleString()}`}
            <span className="ml-2 text-cyan-600 text-lg font-bold">
              {investmentsLoading ? "" : `(${formatDollar(earnings)})`}
            </span>
          </div>
          <button
            className="mt-4 px-5 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm shadow transition"
            onClick={handleWithdraw}
          >
            Withdraw
          </button>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-white p-6 flex flex-col items-center shadow-lg">
          <div className="text-blue-700 text-base font-semibold">Active Investments</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800">
            {investmentsLoading
              ? "..."
              : investments.filter(inv => getInvestmentStatus(inv) === "active").length}
          </div>
          <button className="mt-4 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow transition" onClick={() => navigate("/dashboard/activeplans")}>
            View
          </button>
        </div>
      </section>

      {/* Sectors & Stocks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Sectors & Leading Stocks
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.sector} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg flex flex-col h-full transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-800">{cat.sector}</h3>
              </div>
              <p className="mb-3 text-blue-600 text-sm flex-1">{cat.desc}</p>
              <div className="mb-2 flex flex-col gap-2">
                {cat.companies.map((symbol) => {
                  const stock = stocks.find(s => s.symbol === symbol);
                  // Parse price for dollar conversion
                  const priceNaira = Number(String(stock.price).replace(/[₦,]/g, ""));
                  return (
                    <div
                      key={symbol}
                      className="flex flex-col gap-2 bg-blue-50 rounded-lg px-3 py-2 mb-1"
                    >
                      <div className="flex flex-row items-center justify-between">
                        <div>
                          <span className="text-blue-700 font-bold">{stock.symbol}</span>
                          <span className="ml-2 text-slate-800 font-semibold">{stock.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-800">
                            {stock.price}
                            <span className="ml-2 text-xs text-cyan-600">
                              ({formatDollar(priceNaira)})
                            </span>
                          </span>
                          <span className={`${stock.change.startsWith("+") ? "text-green-600" : "text-red-600"} text-xs font-medium`}>
                            {stock.change.startsWith("+") ? "▲" : "▼"} {stock.change.replace("+", "").replace("-", "")}
                          </span>
                        </div>
                      </div>
                      <button
                        className="w-full sm:w-auto mt-2 inline-flex items-center justify-center px-3 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs font-semibold shadow hover:shadow-md transition"
                        onClick={() => navigate(`/dashboard/cointrend/${stock.symbol}`)}
                      >
                        Invest
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Summary & Security */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-blue-700 mb-4">
            Portfolio Overview
          </h3>
          <div className="text-slate-700 mb-2">
            Total Invested:{" "}
            <span className="font-semibold text-blue-700">
              ₦{investments.reduce((sum, inv) => sum + (inv.amount || 0), 0).toLocaleString()}
              <span className="ml-2 text-cyan-600 text-base font-bold">
                ({formatDollar(investments.reduce((sum, inv) => sum + (inv.amount || 0), 0))})
              </span>
            </span>
          </div>
          <div className="text-slate-700 mb-2">
            Active Investments: <span className="font-semibold text-blue-700">
              {investments.filter(inv => getInvestmentStatus(inv) === "active").length}
            </span>
          </div>
          <div className="text-slate-700 mb-2">
            Completed Investments: <span className="font-semibold text-blue-700">
              {investments.filter(inv => getInvestmentStatus(inv) === "completed").length}
            </span>
          </div>
          <div className="text-slate-700 mb-2">
            Total Earnings:{" "}
            <span className="font-semibold text-blue-700">
              ₦{earnings.toLocaleString()}
              <span className="ml-2 text-cyan-600 text-base font-bold">
                ({formatDollar(earnings)})
              </span>
            </span>
          </div>
          {/* Investment details table */}
          {investments.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-xs text-slate-700">
                <thead>
                  <tr>
                    <th className="px-2 py-1 whitespace-nowrap">Plan</th>
                    <th className="px-2 py-1 whitespace-nowrap">Stock</th>
                    <th className="px-2 py-1 whitespace-nowrap">Amount</th>
                    <th className="px-2 py-1 whitespace-nowrap">Status</th>
                    <th className="px-2 py-1 whitespace-nowrap">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map(inv => {
                    const stock = stocks.find(s => s.symbol === inv.stockSymbol);
                    const status = getInvestmentStatus(inv);
                    return (
                      <tr key={inv._id}>
                        <td className="px-2 py-1 whitespace-nowrap">{inv.plan}</td>
                        <td className="px-2 py-1 whitespace-nowrap">{stock ? stock.symbol : inv.stockSymbol}</td>
                        <td className="px-2 py-1 whitespace-nowrap">
                          ₦{inv.amount.toLocaleString()}
                          <span className="ml-2 text-cyan-600 text-xs font-bold">
                            ({formatDollar(inv.amount)})
                          </span>
                        </td>
                        <td className="px-2 py-1 capitalize whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            status === "completed"
                              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-green-400 text-white"
                              : "bg-blue-500/60 text-white"
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Security Status</h3>
          <ul className="text-slate-700 space-y-3">
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-400 mr-2"></span>
              2FA Enabled
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 mr-2"></span>
              Email Verified
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-2"></span>
              Withdrawal PIN Set
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
              Device Recognized
            </li>
          </ul>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="max-w-3xl mx-auto mt-16 bg-white border border-blue-100 rounded-2xl p-8 shadow-lg">
        <h2 className="text-xl font-bold text-blue-700 mb-6 text-center">Recent Activity</h2>
        {activityLoading ? (
          <div className="text-blue-500 text-center py-6">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-blue-500 text-center py-6">
            No recent activity yet.
          </div>
        ) : (
          <ul className="divide-y divide-blue-100">
            {activities.map((act, idx) => (
              <li
                key={act._id || idx}
                className="py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-50 rounded transition"
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    act.type === "deposit"
                      ? "bg-cyan-400"
                      : act.type === "withdraw"
                      ? "bg-amber-400"
                      : act.type === "plan"
                      ? "bg-blue-400"
                      : "bg-blue-200"
                  }`}
                ></span>
                <span className="text-slate-700">
                  {act.type === "deposit" && (
                    <>
                      Deposited ₦{act.amount.toLocaleString()}
                      <span className="ml-2 text-cyan-600 text-xs font-bold">
                        ({formatDollar(act.amount)})
                      </span>
                      via Paystack
                    </>
                  )}
                  {act.type === "withdraw" && (
                    <>
                      Withdrew ₦{act.amount.toLocaleString()}
                      <span className="ml-2 text-cyan-600 text-xs font-bold">
                        ({formatDollar(act.amount)})
                      </span>
                      to bank
                    </>
                  )}
                  {act.type === "plan" && (
                    <>Started "{act.planName}" plan</>
                  )}
                  {!["deposit", "withdraw", "plan"].includes(act.type) &&
                    act.description}
                </span>
                <span className="ml-auto text-xs text-blue-400">
                  {new Date(act.date || act.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showBankModal && (
        <BankDetailsModal
          onSuccess={handleBankDetailsSubmitted}
          onClose={() => setShowBankModal(false)}
        />
      )}
      {showGuideModal && (
        <WelcomeGuideModal
          onClose={() => setShowGuideModal(false)}
        />
      )}

      <div className="mt-16 text-center text-blue-500 text-base">
        <span className="font-semibold text-blue-700">CirclePay</span> — Invest with confidence. Multiply your wealth.
      </div>
      <style>{`
        @media (max-width: 900px) {
          .max-w-7xl, .max-w-3xl {
            padding: 0.5rem !important;
          }
        }
        @media (max-width: 640px) {
          main {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .max-w-7xl, .max-w-3xl {
            padding: 0.5rem !important;
          }
          .pt-16 {
            padding-top: 4.5rem !important;
          }
          .pb-10 {
            padding-bottom: 1.5rem !important;
          }
          .mt-16 {
            margin-top: 2.5rem !important;
          }
          .mt-4 {
            margin-top: 1.5rem !important;
          }
          .p-8 {
            padding: 1.2rem !important;
          }
          .p-6 {
            padding: 1rem !important;
          }
          .grid-cols-1, .md\\:grid-cols-2, .lg\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
