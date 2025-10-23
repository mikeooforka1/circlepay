import React, { useEffect, useState } from "react";

const NGN_TO_USD = 1461.66;
function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

const PLANS = [
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

export default function ActivePlan() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/investment/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.investments)) {
          setInvestments(data.investments);
        } else {
          setInvestments([]);
        }
      } catch {
        setInvestments([]);
      }
      setLoading(false);
    };
    fetchInvestments();
  }, []);

  function getInvestmentStatus(inv) {
    if (inv.status !== "active") return inv.status;
    if (!inv.duration || !inv.createdAt) return inv.status;
    const startDate = new Date(inv.createdAt);
    const endDate = new Date(startDate.getTime() + inv.duration * 24 * 60 * 60 * 1000);
    const now = new Date();
    return now >= endDate ? "completed" : "active";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-start pt-24 px-2">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-blue-100 shadow-2xl p-8 sm:p-12 mt-8 relative overflow-hidden">
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-16 h-16 rounded-full shadow-lg mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1 text-center">Active Investment Plans</h2>
          <p className="text-slate-600 text-center text-base">
            Track all your currently running CirclePay investment plans.
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-blue-700 text-lg font-semibold">Loading active plans...</div>
          </div>
        ) : investments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src="/assets/images/empty-state.svg"
              alt="No active plans"
              className="w-32 h-32 opacity-60 mb-4"
              style={{ filter: "drop-shadow(0 0 12px #0891b2aa)" }}
              onError={e => (e.target.style.display = "none")}
            />
            <div className="text-blue-700 text-lg font-semibold mb-2">
              You have no active investment plans yet.
            </div>
            <div className="text-blue-400 text-sm">
              Start a new investment to see it here.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {investments.map(inv => {
              const startDate = new Date(inv.createdAt);
              const endDate = inv.duration
                ? new Date(startDate.getTime() + inv.duration * 24 * 60 * 60 * 1000)
                : null;
              const status = getInvestmentStatus(inv);
              const plan = PLANS.find(p => p.name === inv.plan && p.min === inv.amount);
              const expectedOutcome = plan ? plan.min * 2 : inv.amount * 2;
              return (
                <div key={inv._id} className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 rounded-2xl shadow-xl p-6 flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="font-bold text-blue-700 text-lg">{inv.plan} Plan</span>
                    <span className="text-xs text-slate-500">
                      {inv.duration} {inv.duration === 1 ? "day" : "days"}
                    </span>
                  </div>
                  <div className="text-xs font-normal text-slate-600 mb-2">
                    {plan ? plan.desc : `Invest ₦${inv.amount.toLocaleString()} to get ₦${expectedOutcome.toLocaleString()}`}
                  </div>
                  <div className="text-xs mt-1 text-slate-600">
                    Amount: ₦{inv.amount.toLocaleString()}
                    <span className="ml-2 text-xs text-cyan-600">
                      ({formatDollar(inv.amount)})
                    </span>
                    <span className="ml-2">→</span>
                    ₦{expectedOutcome.toLocaleString()}
                    <span className="ml-2 text-xs text-green-600">
                      ({formatDollar(expectedOutcome)})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm mt-2">
                    <span className="text-blue-700">Started: <span className="font-semibold">{startDate.toLocaleString()}</span></span>
                    <span className="text-blue-700">Ends: <span className="font-semibold">{endDate ? endDate.toLocaleString() : "--"}</span></span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-blue-700">Status:{" "}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        status === "completed"
                          ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-green-400 text-white"
                          : "bg-blue-500/60 text-white"
                      }`}>
                        {status}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-10 text-center text-blue-700 text-xs sm:text-base">
          <span className="inline-flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block">
              <circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2" fill="#0891b2" fillOpacity="0.2"/>
              <path d="M12 7v5l3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All your currently running investment plans are shown here. For completed or past plans, check your investment history.
          </span>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .max-w-2xl {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
          }
        }
      `}</style>
    </main>
  );
}