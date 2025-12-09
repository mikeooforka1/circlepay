import React, { useState, useEffect } from "react";

const networks = [
  { name: "MTN", value: "mtn", prefixes: ["0803", "0806", "0703", "0706", "0813", "0816", "0810", "0814", "0903", "0906"] },
  { name: "Airtel", value: "airtel", prefixes: ["0802", "0808", "0708", "0701", "0812", "0902", "0907", "0901"] },
  { name: "Glo", value: "glo", prefixes: ["0805", "0807", "0705", "0815", "0811", "0905"] },
  { name: "9mobile", value: "etisalat", prefixes: ["0809", "0817", "0818", "0909", "0908"] }
];

export default function Airtime() {
  const [step, setStep] = useState(1);
  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Get userId from localStorage user object (like data.jsx)
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user._id;
    if (userId) setUserId(userId);
  }, []);

  // Helper to check phone prefix matches network
  function isPhoneNetworkMatch(phone, network) {
    const net = networks.find(n => n.value === network);
    if (!net) return false;
    return net.prefixes.some(prefix => phone.startsWith(prefix));
  }

  const handleNext = () => {
    setErrorMsg("");
    if (step === 1 && !network) {
      setErrorMsg("Please select a network.");
      return;
    }
    if (step === 2) {
      if (!phone || phone.length !== 11) {
        setErrorMsg("Please enter a valid 11-digit phone number.");
        return;
      }
      if (!isPhoneNetworkMatch(phone, network)) {
        setErrorMsg("Phone number does not match selected network.");
        return;
      }
    }
    if (step === 3 && (isNaN(amount) || Number(amount) < 50)) {
      setErrorMsg("Please enter a valid amount (minimum ₦50).");
      return;
    }
    setStep(step + 1);
  };

  const handleBuyAirtime = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!transactionPin || transactionPin.length !== 4) {
      setErrorMsg("Please enter your 4-digit transaction PIN.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/airtime/airtime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          network,
          amount,
          phone,
          userId,
          transactionPin
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Airtime purchase successful! You will receive your recharge shortly.");
        setPhone("");
        setAmount("");
        setNetwork("");
        setTransactionPin("");
        setStep(1);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setErrorMsg(data.message || "Airtime purchase failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-24 flex justify-center items-start bg-black text-yellow-400 px-2">
      <div className="w-full max-w-md bg-black rounded-3xl p-8 sm:p-12 shadow-2xl border border-yellow-400">
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-14 h-14 rounded-full shadow-lg mb-2 border-2 border-yellow-400" />
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-1 text-center">Buy Airtime</h2>
          <p className="text-yellow-200 text-center text-base">
            Instantly recharge any Nigerian phone number.
          </p>
        </div>
        <form onSubmit={handleBuyAirtime} className="flex flex-col gap-5">
          {step === 1 && (
            <section>
              <label className="text-yellow-400 font-medium" htmlFor="network">
                Select Network
              </label>
              <select
                id="network"
                className="rounded-xl px-3 py-2 border border-yellow-400 w-full bg-yellow-900 text-yellow-400 mt-2"
                value={network}
                onChange={e => setNetwork(e.target.value)}
                required
              >
                <option value="">Choose network</option>
                {networks.map(n => (
                  <option key={n.value} value={n.value}>{n.name}</option>
                ))}
              </select>
              <button type="button" className="mt-4 w-full bg-yellow-700 text-black py-2 rounded-xl font-semibold" onClick={handleNext}>
                Next
              </button>
            </section>
          )}
          {step === 2 && (
            <section>
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
              <button type="button" className="mt-4 w-full bg-yellow-700 text-black py-2 rounded-xl font-semibold" onClick={handleNext}>
                Next
              </button>
            </section>
          )}
          {step === 3 && (
            <section>
              <label className="text-yellow-400 font-medium" htmlFor="amount">
                Amount (₦)
              </label>
              <input
                id="amount"
                type="number"
                min={50}
                step="1"
                className="rounded-xl px-3 py-2 border border-yellow-400 w-full bg-yellow-900 text-yellow-400 mt-2"
                placeholder="Enter amount (min ₦50)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
              <button type="button" className="mt-4 w-full bg-yellow-700 text-black py-2 rounded-xl font-semibold" onClick={handleNext}>
                Next
              </button>
            </section>
          )}
          {step === 4 && (
            <section>
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
              <button
                type="submit"
                className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold text-lg rounded-xl shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Processing..." : "Buy Airtime"}
              </button>
            </section>
          )}
        </form>
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
          Airtime is delivered instantly to the provided phone number.<br />
          <span className="text-yellow-300 font-semibold">Powered by CirclePay</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          main {
            padding-top: 4.5rem !important;
          }
          .max-w-md {
            padding: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}