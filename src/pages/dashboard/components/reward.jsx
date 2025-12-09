import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const BONUS_PER_REFERRAL = 400;
const REFERRAL_TARGET = 25;
const TOTAL_BONUS = BONUS_PER_REFERRAL * REFERRAL_TARGET;

export default function Reward() {
  const [user, setUser] = useState({});
  const [bonus, setBonus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cashoutMsg, setCashoutMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get user from localStorage
    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userObj);

    // 2. If user is authenticated but has no referralCode, check backend
    if (userObj && userObj.id && !userObj.referralCode) {
      fetch(`${API_URL}/api/users/${userObj.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.referralCode) {
            // Clear localStorage and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login?forceRelogin=1");
          } else {
            // Update local user object with referralCode
            userObj.referralCode = data.referralCode;
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser({ ...userObj });
          }
        })
        .catch(() => {
          // On error, force logout as well
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login?forceRelogin=1");
        });
    }

    // Fetch referral bonus (replace with your API if needed)
    fetch(`${API_URL}/api/rewards/bonus`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setBonus(data.bonus || 0);
      });

    // Fetch referral count (number of times user's code has been used)
    fetch(`${API_URL}/api/rewards/referral-count`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setReferralCount(data.count || 0);
      });
  }, []);

  const handleCopy = () => {
    if (user.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleCashout = async () => {
    setLoading(true);
    setCashoutMsg("");
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/rewards/cashout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCashoutMsg("Bonus cashed out to your wallet!");
        setBonus(0);
      } else {
        setErrorMsg(data.message || "Cashout failed.");
      }
    } catch {
      setErrorMsg("Network error. Try again.");
    }
    setLoading(false);
  };

  // Calculate progress
  const progress = Math.min((referralCount / REFERRAL_TARGET) * 100, 100);

  return (
    <div className="max-w-xl mx-auto mt-16 bg-yellow-900 border border-yellow-400 rounded-2xl shadow-xl p-8 text-center">
      <h2 className="text-2xl font-bold text-yellow-300 mb-2">Referral Reward Bonus</h2>
      <div className="mb-4 text-yellow-200">
        <span className="font-semibold text-yellow-300">Invite 25 friends</span> to CirclePay using your referral code and earn up to <span className="font-bold text-yellow-400">₦{TOTAL_BONUS.toLocaleString()}</span>!
        <br />
        <span className="text-yellow-300">You get ₦400 for each successful referral.</span>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-yellow-200 text-sm">Referrals: <span className="font-bold text-yellow-300">{referralCount}</span> / {REFERRAL_TARGET}</span>
          <span className="text-yellow-200 text-sm">₦{(referralCount * BONUS_PER_REFERRAL).toLocaleString()} / ₦{TOTAL_BONUS.toLocaleString()}</span>
        </div>
        <div className="w-full bg-yellow-800 rounded-full h-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {/* Referral Code */}
      <div className="mb-6">
        <div className="font-semibold text-yellow-400">Your Referral Code:</div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-2xl font-bold tracking-widest bg-yellow-800 px-4 py-2 rounded-xl">
            {user.referralCode || "------"}
          </span>
          {user.referralCode && (
            <button
              className="text-yellow-300 hover:text-yellow-100"
              onClick={handleCopy}
              aria-label="Copy referral code"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a2 2 0 0 0-2 2v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1V4a2 2 0 0 0-2-2H8zm0 2h4v2H8V4zm7 4v6a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H6V8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1zm-3 4a1 1 0 0 1 1 1v1H6a1 1 0 0 1-1-1v-1h8z"/>
              </svg>
            </button>
          )}
          {copied && <span className="text-emerald-400 text-xs font-semibold ml-2">Copied!</span>}
        </div>
      </div>
      {/* Bonus and Cashout */}
      <div className="mb-6">
        <div className="font-semibold text-yellow-400">Your Referral Bonus:</div>
        <div className="text-3xl font-extrabold text-yellow-300 mt-1 mb-2">₦{bonus}</div>
        <button
          className="mt-2 px-6 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow hover:from-yellow-500 hover:to-yellow-700 transition"
          onClick={handleCashout}
          disabled={loading || bonus < 400}
        >
          {loading ? "Processing..." : "Cashout"}
        </button>
        <div className="text-xs text-yellow-200 mt-2">
          Minimum cashout: ₦400
        </div>
      </div>
      {cashoutMsg && (
        <div className="mt-4 py-2 px-4 rounded-xl bg-emerald-900 text-emerald-300 text-center font-semibold shadow">
          {cashoutMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mt-4 py-2 px-4 rounded-xl bg-rose-900 text-rose-300 text-center font-semibold shadow">
          {errorMsg}
        </div>
      )}
    </div>
  );
}