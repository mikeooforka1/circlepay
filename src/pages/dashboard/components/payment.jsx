import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || "your_paystack_public_key";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const NGN_TO_USD = 1461.66;
const MIN_DEPOSIT_NGN = 100;

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function Payment() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendReferenceToBackend = async (reference) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Wallet credited successfully! New balance: ₦" + data.balance);
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to credit wallet.");
      }
    } catch (err) {
      alert("Error crediting wallet. Please contact support.");
    }
  };

  const handlePaystack = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) < MIN_DEPOSIT_NGN) {
      alert(`Please enter a valid amount (minimum ₦${MIN_DEPOSIT_NGN.toLocaleString(undefined, { maximumFractionDigits: 2 })})`);
      return;
    }
    setLoading(true);

    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user?.email,
      amount: Math.round(Number(amount) * 100),
      currency: "NGN",
      ref: "CPAY-" + Math.floor(Math.random() * 1000000000 + 1),
      callback: function (response) {
        setLoading(false);
        if (response.status === "success") {
          alert("Payment successful! Reference: " + response.reference);
          sendReferenceToBackend(response.reference);
        } else {
          alert("Payment failed. Please try again.");
        }
      },
      onClose: function () {
        setLoading(false);
        alert("Payment window closed.");
      },
    });

    if (handler) handler.openIframe();
    else {
      setLoading(false);
      alert("Paystack is not loaded. Please check your internet connection.");
    }
  };

  return (
    <main className="min-h-screen pt-24 flex justify-center items-start bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-blue-100 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 rounded-t-3xl opacity-70"></div>
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-16 h-16 rounded-full shadow-lg mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1 text-center">Add Funds</h2>
          <p className="text-slate-600 text-center text-base">
            Fund your CirclePay account securely using Paystack.
          </p>
        </div>
        <form onSubmit={handlePaystack} className="flex flex-col gap-5">
          <div>
            <label className="text-blue-700 font-medium" htmlFor="amount">
              Amount (₦)
            </label>
            <input
              id="amount"
              type="number"
              min={MIN_DEPOSIT_NGN}
              step="0.01"
              className="rounded-xl px-3 py-2 border border-blue-200 w-full bg-blue-50 text-blue-700"
              placeholder={`Enter amount (min ₦${MIN_DEPOSIT_NGN.toLocaleString(undefined, { maximumFractionDigits: 2 })})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              required
            />
            <div className="text-xs text-blue-500 mb-2 text-center">
              {amount && !isNaN(amount) && Number(amount) > 0 ? (
                <>
                  You are depositing <span className="font-semibold text-blue-700">₦{Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  <span className="ml-2 text-cyan-500 font-semibold">
                    ({formatDollar(Number(amount))})
                  </span>
                </>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-amber-400 to-yellow-400 hover:from-cyan-500 hover:to-yellow-500 text-slate-900 font-semibold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={
              loading ||
              !amount ||
              isNaN(amount) ||
              Number(amount) < MIN_DEPOSIT_NGN
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-cyan-400" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#0891b2" strokeWidth="4" fill="none" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="#fbbf24" strokeWidth="4" fill="none" />
                </svg>
                Processing...
              </span>
            ) : (
              "Pay with Paystack"
            )}
          </button>
        </form>
        <div className="mt-8 text-center text-blue-700 text-sm">
          <div>
            <span className="font-semibold">Minimum deposit: ₦{MIN_DEPOSIT_NGN.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className="ml-2 text-cyan-500 font-semibold">({formatDollar(MIN_DEPOSIT_NGN)})</span>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="inline-block">
                <circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2" fill="#0891b2" fillOpacity="0.2"/>
                <path d="M12 7v5l3 3" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Payments are processed securely via Paystack. Your wallet will be credited instantly after confirmation.
            </span>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          Powered by <span className="font-bold text-blue-700">CirclePay</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          main {
            padding-top: 4.5rem !important;
          }
          .max-w-lg {
            padding: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}