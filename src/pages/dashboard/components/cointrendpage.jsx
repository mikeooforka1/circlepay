import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;

// Helper to format dollar equivalent
function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// Nigerian stocks data (with more stocks and prices for trend)
const stocks = [
  { symbol: "ZENITHBANK", name: "Zenith Bank Plc", price: 38.50, change: "+0.52%" },
  { symbol: "GTCO", name: "GTCO", price: 41.20, change: "-0.15%" },
  { symbol: "ACCESSCORP", name: "Access Holdings", price: 19.80, change: "+1.10%" },
  { symbol: "UBA", name: "United Bank for Africa", price: 17.50, change: "+0.30%" },
  { symbol: "MTNN", name: "MTN Nigeria", price: 245.00, change: "+0.80%" },
  { symbol: "AIRTELAFRI", name: "Airtel Africa", price: 1650.00, change: "-0.10%" },
  { symbol: "DANGCEM", name: "Dangote Cement", price: 320.00, change: "-0.25%" },
  { symbol: "BUACEMENT", name: "BUA Cement", price: 98.00, change: "+0.40%" },
  { symbol: "WAPCO", name: "Lafarge Africa Plc", price: 31.00, change: "+0.20%" },
  { symbol: "NB", name: "Nigerian Breweries Plc", price: 38.00, change: "+0.15%" },
  { symbol: "GUINNESS", name: "Guinness Nigeria Plc", price: 70.00, change: "-0.05%" },
  { symbol: "CADBURY", name: "Cadbury Nigeria Plc", price: 17.80, change: "+0.25%" },
  { symbol: "DANGSUGAR", name: "Dangote Sugar Refinery", price: 45.00, change: "+0.10%" },
  { symbol: "SEPLAT", name: "Seplat Energy", price: 1450.00, change: "+0.90%" },
  { symbol: "CONOIL", name: "Conoil Plc", price: 55.00, change: "-0.20%" },
  { symbol: "ARADEL", name: "Aradel Holdings", price: 1200.00, change: "+0.60%" },
  { symbol: "TRANSCOHOT", name: "Transcorp Hotels Plc", price: 12.50, change: "+0.05%" },
  { symbol: "NAHCO", name: "NAHCO Plc", price: 19.00, change: "+0.10%" },
  { symbol: "CUSTODIAN", name: "Custodian Investment Plc", price: 7.80, change: "+0.08%" },
];

// Updated plans
const plans = [
  // 48hrs plans
  { name: "48hrs", min: 3000, max: 3000, duration: 2, roi: "100%", desc: "Invest ₦3,000 to get ₦6,000" },
  { name: "48hrs", min: 5000, max: 5000, duration: 2, roi: "100%", desc: "Invest ₦5,000 to get ₦10,000" },
  { name: "48hrs", min: 10000, max: 10000, duration: 2, roi: "100%", desc: "Invest ₦10,000 to get ₦20,000" },
  { name: "48hrs", min: 20000, max: 20000, duration: 2, roi: "100%", desc: "Invest ₦20,000 to get ₦40,000" },
  // 7days plans
  { name: "7days", min: 30000, max: 30000, duration: 7, roi: "100%", desc: "Invest ₦30,000 to get ₦60,000" },
  { name: "7days", min: 40000, max: 40000, duration: 7, roi: "100%", desc: "Invest ₦40,000 to get ₦80,000" },
  { name: "7days", min: 50000, max: 50000, duration: 7, roi: "100%", desc: "Invest ₦50,000 to get ₦100,000" },
  // 3weeks plans
  { name: "3weeks", min: 200000, max: 200000, duration: 21, roi: "100%", desc: "Invest ₦200,000 to get ₦400,000" },
  { name: "3weeks", min: 300000, max: 300000, duration: 21, roi: "100%", desc: "Invest ₦300,000 to get ₦600,000" },
  { name: "3weeks", min: 400000, max: 400000, duration: 21, roi: "100%", desc: "Invest ₦400,000 to get ₦800,000" },
  { name: "3weeks", min: 500000, max: 500000, duration: 21, roi: "100%", desc: "Invest ₦500,000 to get ₦1,000,000" },
];

// Generate mock trend data for all stocks
function getMockChartData(base) {
  let arr = [];
  for (let i = 0; i < 40; i++) {
    const fluctuation = Math.sin(i / 6) * (base * 0.01) + (Math.random() - 0.5) * (base * 0.003);
    arr.push(Number((base + fluctuation).toFixed(2)));
  }
  return arr;
}

export default function StockTrendPage() {
  const { symbol } = useParams();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [outcome, setOutcome] = useState(null);

  // Find stock data
  const stock = stocks.find(s => s.symbol.toLowerCase() === symbol?.toLowerCase());
  // Always generate a mock trend for every stock
  const trend = stock ? getMockChartData(stock.price) : [];

  useEffect(() => {
    setAmount("");
    setError("");
    setSuccess("");
    setOutcome(null);
  }, [selectedPlan, symbol]);

  useEffect(() => {
    if (selectedPlan && amount && !isNaN(amount)) {
      const amt = Number(amount);
      if (amt === selectedPlan.min && amt === selectedPlan.max) {
        // For fixed plans, calculate expected ROI
        const expected = amt * 2;
        setOutcome(expected);
      } else {
        setOutcome(null);
      }
    } else {
      setOutcome(null);
    }
  }, [amount, selectedPlan]);

  // Handle invest (mock)
  const handleInvest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!selectedPlan) {
      setError("Please select an investment plan.");
      return;
    }
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount.");
      return;
    }
    const amt = Number(amount);
    if (amt !== selectedPlan.min || amt !== selectedPlan.max) {
      setError(`Amount must be exactly ₦${selectedPlan.min.toLocaleString()}.`);
      return;
    }
    setInvesting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/investment/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          plan: selectedPlan.name,
          amount: amt,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Investment failed");
      }
      setSuccess("Investment successful!");
      setAmount("");
      setSelectedPlan(null);
      setOutcome(null);
    } catch (err) {
      setError(err.message || "Investment failed. Please try again.");
    } finally {
      setInvesting(false);
    }
  };

  // Trend chart (mock)
  const TrendChart = () => {
    if (!trend.length) {
      return (
        <div className="text-slate-400 w-full text-center py-10 bg-white/10 rounded mb-4">
          No trend data
        </div>
      );
    }
    const slicedTrend = trend.slice(-40);
    return (
      <div className="bg-white/10 rounded mb-4 p-2">
        <Line
          data={{
            labels: slicedTrend.map((_, i) => `T${i + 1}`),
            datasets: [
              {
                label: `${stock.symbol} Price`,
                data: slicedTrend,
                borderColor: "#06b6d4",
                backgroundColor: "rgba(6,182,212,0.2)",
                tension: 0.4,
                pointRadius: 0,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { display: false },
              y: {
                display: true,
                ticks: {
                  color: "#334155",
                  callback: (v) => `₦${v.toLocaleString()}`,
                },
                grid: { color: "rgba(51,65,85,0.05)" },
              },
            },
          }}
          height={120}
        />
      </div>
    );
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="max-w-2xl mx-auto px-2 py-8 pt-[7.5rem] sm:pt-[7.5rem]">
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 rounded-2xl shadow-2xl p-6 sm:p-10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 mb-1 capitalize">{stock ? stock.name : symbol}</h1>
            <div className="text-slate-700 text-lg mb-2">
              Current Price:{" "}
              <span className="font-semibold text-cyan-600">
                ₦{stock ? stock.price.toLocaleString(undefined, {maximumFractionDigits: 2}) : "N/A"}
                {" "}
                <span className="text-xs text-slate-500 ml-2">
                  ({stock ? formatDollar(stock.price) : "$0.00"})
                </span>
              </span>
              {" "}
              <span className={`${stock && stock.change.startsWith("+") ? "text-green-600" : "text-red-600"} text-base font-semibold`}>
                {stock ? (stock.change.startsWith("+") ? "▲" : "▼") : ""} {stock ? stock.change.replace("+", "").replace("-", "") : ""}
              </span>
            </div>
          </div>
        </div>
        <TrendChart />
      </div>

      <form
        onSubmit={handleInvest}
        className="bg-white border border-blue-100 rounded-2xl shadow-xl p-6 flex flex-col gap-4"
      >
        <h2 className="text-lg font-bold text-blue-700 mb-2">Select Investment Plan</h2>
        <div className="flex flex-col gap-3">
          {plans.map((plan, idx) => (
            <button
              type="button"
              key={idx}
              className={`rounded-lg px-4 py-3 border transition font-semibold ${
                selectedPlan === plan
                  ? "bg-cyan-500 border-cyan-400 text-white"
                  : "bg-blue-50 border-blue-100 text-blue-700 hover:bg-cyan-100"
              }`}
              onClick={() => setSelectedPlan(plan)}
              disabled={investing}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span>
                  {plan.name} Plan
                  <span className="ml-2 text-xs text-slate-500">
                    {plan.duration} {plan.duration === 1 ? "day" : "days"}
                  </span>
                </span>
                <span className="text-xs font-normal text-slate-600">
                  {plan.desc}
                </span>
              </div>
              <div className="text-xs mt-1 text-slate-600">
                Amount: ₦{plan.min.toLocaleString()} 
                <span className="ml-2 text-xs text-slate-500">
                  ({formatDollar(plan.min)})
                </span>
                <span className="ml-2">→</span>
                ₦{(plan.min * 2).toLocaleString()}
                <span className="ml-2 text-xs text-green-600">
                  ({formatDollar(plan.min * 2)})
                </span>
              </div>
            </button>
          ))}
        </div>
        {selectedPlan && (
          <div className="flex flex-col gap-2 mt-2">
            <label htmlFor="amount" className="text-blue-700 text-sm">
              Enter Amount (₦{selectedPlan.min.toLocaleString()})
              <span className="ml-2 text-xs text-slate-500">
                ({formatDollar(selectedPlan.min)})
              </span>
            </label>
            <input
              id="amount"
              type="number"
              min={selectedPlan.min}
              max={selectedPlan.max}
              step="1"
              className="rounded px-3 py-2 bg-blue-50 text-blue-700 w-full outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder={`Enter amount`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={investing}
              required
            />
            <div className="text-xs text-slate-500">
              Duration: <span className="font-semibold">{selectedPlan.duration} {selectedPlan.duration === 1 ? "day" : "days"}</span>
            </div>
            {outcome !== null && (
              <div className="text-sm text-green-600 font-semibold flex flex-col gap-1">
                <span>
                  Expected Outcome: ₦{outcome.toLocaleString()} 
                  <span className="ml-2 text-xs text-green-600">
                    ({formatDollar(outcome)})
                  </span>
                </span>
                <span>
                  ROI: 100%
                </span>
              </div>
            )}
          </div>
        )}
        {error && (
          <div className="text-center text-rose-400 font-semibold">{error}</div>
        )}
        {success && (
          <div className="text-center font-semibold py-3 rounded bg-green-600/90 text-white text-lg shadow mb-2 animate-bounce">
            {success} <br />
            Your investment has been processed. You can track its progress in your dashboard.
          </div>
        )}
        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={!selectedPlan || investing}
        >
          {investing ? "Processing..." : "Invest"}
        </button>
      </form>
      <style>{`
        @media (max-width: 640px) {
          .max-w-2xl {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}