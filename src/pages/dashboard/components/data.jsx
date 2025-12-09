import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import at the top

// Map frontend network value to Peyflex identifier
const networkMap = {
  mtn: ["mtn_gifting_data", "mtn_data_share"],
  glo: ["glo_data"],
  airtel: ["airtel_data"],
  "9mobile": ["9mobile_data", "9mobile_gifting"]
};

const networks = [
  { value: "mtn", name: "MTN" },
  { value: "glo", name: "Glo" },
  { value: "airtel", name: "Airtel" },
  { value: "9mobile", name: "9mobile" }
];

// Helper to categorize plans
function getCategory(label = "") {
  label = label.toLowerCase();
  if (label.includes("day")) return "Daily";
  if (label.includes("week")) return "Weekly";
  if (label.includes("month") || label.includes("30")) return "Monthly";
  if (label.includes("year")) return "Yearly";
  return "Other";
}

const categories = ["Daily", "Weekly", "Monthly", "Yearly", "Other"];

export default function Data() {
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1);
  const [transactionPin, setTransactionPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Daily");
  const [selectedBundle, setSelectedBundle] = useState(null);
  const navigate = useNavigate(); // Add this hook

  // Fetch plans on mount
  useEffect(() => {
    async function fetchPlans() {
      setLoadingPlans(true);
      try {
        const res = await fetch("/api/data/plans");
        const data = await res.json();
        if (data.success) {
          setPlans(data.plans);
        }
      } catch (err) {
        setErrorMsg("Failed to load data plans.");
      }
      setLoadingPlans(false);
    }
    fetchPlans();
  }, []);

  // Filter plans for selected network
  const filteredPlans = network
    ? plans.filter(plan =>
        (networkMap[network] || []).includes(plan.network)
      )
    : [];

  // Categorize plans
  const plansByCategory = {};
  categories.forEach(cat => (plansByCategory[cat] = []));
  filteredPlans.forEach(plan => {
    const cat = getCategory(plan.label);
    plansByCategory[cat].push(plan);
  });

  // Step 1: Select network and phone
  const handleProceed = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!network || !phone || phone.length !== 11) {
      setErrorMsg("Please select a network and enter a valid 11-digit phone number.");
      return;
    }
    setStep(2);
  };

  // Step 2: Select bundle
  const handleSelectBundle = (plan) => {
    setSelectedBundle(plan);
    setErrorMsg("");
    setStep(3);
  };

  // Step 3: Enter PIN and pay
  const handleBuyData = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!/^\d{4}$/.test(transactionPin)) {
      setErrorMsg("Please enter your 4-digit transaction PIN.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.id || user._id;
      const res = await fetch("/api/data/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_code: selectedBundle?.plan_code, // must be present
          phone,                                // must be present
          userId,                               // must be present
          transactionPin,                       // must be present
          amount: selectedBundle?.amount,       // optional, but good to send
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Data purchase successful! You will receive your bundle shortly.");
        setPhone("");
        setSelectedBundle(null);
        setNetwork("");
        setTransactionPin("");
        setStep(1);
        setTimeout(() => {
          navigate("/dashboard"); // Redirect after 2 seconds
        }, 2000);
      } else {
        setErrorMsg(data.message || "Data purchase failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-24 flex justify-center items-start bg-black text-yellow-400 px-2">
      <div className="w-full max-w-md bg-black rounded-3xl p-4 sm:p-8 shadow-2xl border border-yellow-400">
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-14 h-14 rounded-full shadow-lg mb-2 border-2 border-yellow-400" />
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-1 text-center">Buy Data</h2>
          <p className="text-yellow-200 text-center text-base">
            Instantly buy data for any Nigerian phone number.
          </p>
        </div>
        {/* Step 1: Network and phone */}
        {step === 1 && (
          <form onSubmit={handleProceed} className="flex flex-col gap-5">
            <div>
              <label className="text-yellow-400 font-medium" htmlFor="network">
                Select Network
              </label>
              <select
                id="network"
                className="rounded-xl px-3 py-2 border border-yellow-400 w-full bg-yellow-900 text-yellow-400 mt-2"
                value={network}
                onChange={e => {
                  setNetwork(e.target.value);
                  setSelectedBundle(null);
                  setErrorMsg("");
                }}
                required
              >
                <option value="">Choose network</option>
                {networks.map(n => (
                  <option key={n.value} value={n.value}>{n.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-yellow-400 font-medium" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="text"
                maxLength={11}
                className="rounded-xl px-3 py-2 border border-yellow-400 w-full bg-yellow-900 text-yellow-400 mt-2"
                placeholder="Enter 11-digit phone number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/, ""))}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </form>
        )}
        {/* Step 2: Bundle selection */}
        {step === 2 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <button
                className="text-yellow-400 underline"
                onClick={() => setStep(1)}
              >
                &larr; Back
              </button>
              <span className="font-semibold">Select Data Bundle</span>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-yellow-900 text-yellow-400 border-yellow-400"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
            {loadingPlans ? (
              <div className="text-center py-8">Loading bundles...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {plansByCategory[selectedCategory].length === 0 && (
                  <div className="col-span-full text-center text-yellow-300">No bundles found.</div>
                )}
                {plansByCategory[selectedCategory].map((b, idx) => (
                  <button
                    key={b.plan_code + "-" + idx}
                    className={`rounded-xl border-2 p-3 flex flex-col items-center shadow transition cursor-pointer ${
                      selectedBundle?.plan_code === b.plan_code && selectedBundle?.amount === b.amount
                        ? "border-yellow-400 bg-yellow-900"
                        : "border-yellow-700 bg-black hover:border-yellow-400"
                    }`}
                    onClick={() => handleSelectBundle(b)}
                  >
                    <span className="font-semibold text-base text-yellow-300 text-center">{b.label}</span>
                    <span className="text-lg font-bold text-yellow-400 mt-2">₦{b.amount}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Step 3: PIN confirmation */}
        {step === 3 && (
          <form onSubmit={handleBuyData} className="flex flex-col gap-5">
            <div className="mb-2">
              <div className="text-yellow-300 font-semibold mb-1">Network: <span className="text-yellow-400">{network.toUpperCase()}</span></div>
              <div className="text-yellow-300 font-semibold mb-1">Phone: <span className="text-yellow-400">{phone}</span></div>
              <div className="text-yellow-300 font-semibold mb-1">Bundle: <span className="text-yellow-400">{selectedBundle?.label}</span></div>
              <div className="text-yellow-300 font-semibold mb-1">Amount: <span className="text-yellow-400">₦{selectedBundle?.amount}</span></div>
            </div>
            <div>
              <label className="text-yellow-400 font-medium" htmlFor="transactionPin">
                Transaction PIN
              </label>
              <input
                id="transactionPin"
                type="password"
                maxLength={4}
                className="rounded-xl px-3 py-2 border border-yellow-400 w-full bg-yellow-900 text-yellow-400 mt-2"
                placeholder="Enter 4-digit PIN"
                value={transactionPin}
                onChange={e => setTransactionPin(e.target.value.replace(/\D/, ""))}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay for Data"}
            </button>
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-xl bg-yellow-900 text-yellow-400 border border-yellow-400 font-semibold text-lg shadow"
              onClick={() => setStep(2)}
              disabled={loading}
            >
              Back
            </button>
          </form>
        )}
        {successMsg && (
          <div className="mt-4 py-3 px-4 rounded-xl bg-emerald-900 text-emerald-300 text-center font-semibold shadow animate-bounce">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mt-4 py-3 px-4 rounded-xl bg-rose-900 text-rose-300 text-center font-semibold shadow">
            {errorMsg}
          </div>
        )}
        <div className="mt-8 text-center text-yellow-400 text-sm">
          Data is delivered instantly to the provided phone number.<br />
          <span className="text-yellow-300 font-semibold">Powered by CirclePay</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          main {
            padding-top: 4.5rem !important;
          }
          .max-w-md {
            padding: 1rem !important;
          }
          .grid-cols-3 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </main>
  );
}