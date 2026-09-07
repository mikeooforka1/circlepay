import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaUniversity, 
  FaSearch, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaTimes, 
  FaArrowLeft, 
  FaShieldAlt,
  FaBolt
} from "react-icons/fa";

const NGN_TO_USD = 1461.66;
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_BANKS = [
  { name: "Access Bank", code: "044" },
  { name: "GTBank (Guaranty Trust Bank)", code: "058" },
  { name: "Zenith Bank", code: "057" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "United Bank for Africa (UBA)", code: "033" },
  { name: "OPay (PayCom)", code: "999992" },
  { name: "PalmPay", code: "999991" },
  { name: "Kuda Microfinance Bank", code: "50211" },
  { name: "Moniepoint MFB", code: "50515" },
  { name: "Fidelity Bank", code: "070" },
  { name: "Sterling Bank", code: "232" },
  { name: "Polaris Bank", code: "076" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "Wema Bank", code: "035" },
  { name: "FCMB", code: "214" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Providus Bank", code: "101" },
  { name: "Jaiz Bank", code: "301" }
];

const POPULAR_BANK_CODES = ["999992", "999991", "50211", "058", "057", "044"];

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function Withdraw() {
  const location = useLocation();
  const navigate = useNavigate();
  const maxAmount = location.state?.maxAmount || 0;

  const [banksList, setBanksList] = useState(DEFAULT_BANKS);
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");

  const [resolving, setResolving] = useState(false);
  const [bankError, setBankError] = useState("");
  const [hasValidated, setHasValidated] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const minWithdraw = 20000;
  const canWithdraw = maxAmount >= minWithdraw;
  const amountValid = Number(amount) >= minWithdraw && Number(amount) <= maxAmount;

  // 1. Fetch live bank list and saved user details
  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Fetch dynamic banks
      try {
        const banksRes = await fetch(`${API_BASE}/api/withdraw/banks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const banksData = await banksRes.json();
        if (banksData.status && banksData.banks?.length) {
          setBanksList(banksData.banks);
        }
      } catch (err) {
        console.warn("Could not load dynamic bank list", err);
      }

      // Fetch saved user details
      try {
        const userRes = await fetch(`${API_BASE}/api/users/bank-details`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await userRes.json();
        if (userData.hasBankDetails && userData.bankName && userData.accountNumber) {
          setBankName(userData.bankName);
          setAccountNumber(userData.accountNumber);
          const found = banksList.find(b => b.name.toLowerCase() === userData.bankName.toLowerCase());
          if (found) setBankCode(found.code);
        }
      } catch (err) {
        console.warn("Could not load saved user bank details", err);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Filter banks in modal
  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banksList;
    const q = searchQuery.toLowerCase();
    return banksList.filter(b => b.name.toLowerCase().includes(q) || b.code.includes(q));
  }, [banksList, searchQuery]);

  // 3. Resolve Account Logic
  const resolveAccount = async (accNum, bCode, bName) => {
    if (!accNum || accNum.length !== 10 || !bCode) return;
    
    setResolving(true);
    setBankError("");
    setAccountName("");
    setHasValidated(false);

    try {
      const token = localStorage.getItem("token");
      const url = `${API_BASE}/api/withdraw/bank/resolve?account_number=${encodeURIComponent(accNum)}&bank_code=${encodeURIComponent(bCode)}&bank_name=${encodeURIComponent(bName)}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.status && data.data?.account_name) {
        setAccountName(data.data.account_name);
        setBankError("");
        setHasValidated(true);
      } else {
        setAccountName("");
        setBankError(data.message || "Could not resolve bank account details.");
        setHasValidated(true);
      }
    } catch (err) {
      setAccountName("");
      setBankError("Network error verifying account. Please check your connection.");
      setHasValidated(true);
    } finally {
      setResolving(false);
    }
  };

  // Trigger verification automatically when account reaches 10 digits
  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      resolveAccount(accountNumber, bankCode, bankName);
    } else {
      setAccountName("");
      setBankError("");
      setHasValidated(false);
    }
  }, [accountNumber, bankCode, bankName]);

  const handleSelectBank = (bank) => {
    setBankName(bank.name);
    setBankCode(bank.code);
    setIsModalOpen(false);
    setSearchQuery("");
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!amountValid || !accountName || bankError) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/withdraw`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          bankCode,
          bankName,
          accountNumber,
          accountName
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Withdrawal initiated successfully! Payout will arrive within 3 hours.");
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        alert(data.message || "Withdrawal failed");
      }
    } catch (err) {
      alert("Network error processing withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 flex justify-center items-start bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] text-yellow-400">
      <div className="w-full max-w-lg bg-black/70 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-yellow-400/30">
        
        {/* Header */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm"
        >
          <FaArrowLeft size={12} /> Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 mb-4 shadow-lg">
            <FaUniversity className="text-yellow-400 text-3xl" />
          </div>
          <h1 className="text-3xl font-black text-yellow-300">Withdraw Earnings</h1>
          <p className="text-yellow-200/60 text-sm mt-1">
            Direct payout to your Nigerian bank account
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-xs text-yellow-200/50 uppercase tracking-wider">Available to Withdraw</p>
            <p className="text-2xl font-black text-yellow-300">₦{Number(maxAmount).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-yellow-200/50">USD Equivalent</p>
            <p className="text-sm font-semibold text-yellow-400">{formatDollar(maxAmount)}</p>
          </div>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-sm flex items-center gap-3">
            <FaCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />
            <div>{successMsg}</div>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-5">
          {/* Bank Selection Trigger */}
          <div>
            <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
              Select Destination Bank
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-3.5 rounded-xl border border-yellow-400/40 bg-black/60 text-left flex items-center justify-between hover:border-yellow-400 transition"
            >
              <div className="flex items-center gap-3">
                <FaUniversity className="text-yellow-400" />
                <span className={bankName ? "text-yellow-200 font-semibold" : "text-yellow-200/40"}>
                  {bankName || "Choose your bank..."}
                </span>
              </div>
              <span className="text-xs text-yellow-400/70 border border-yellow-400/30 px-2.5 py-1 rounded-md">
                Change
              </span>
            </button>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
              10-Digit NUBAN Account Number
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={10}
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                className={`w-full px-4 py-3.5 rounded-xl bg-black/60 border text-yellow-200 placeholder-yellow-200/20 font-mono text-lg tracking-wider focus:outline-none transition ${
                  hasValidated
                    ? accountName
                      ? "border-emerald-500 focus:border-emerald-400"
                      : "border-rose-500 focus:border-rose-400"
                    : "border-yellow-400/40 focus:border-yellow-400"
                }`}
                disabled={loading}
                required
              />

              {resolving && (
                <div className="absolute right-4 top-4 flex items-center gap-2 text-xs text-yellow-400 animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              )}
            </div>

            {/* Verification Result */}
            {hasValidated && accountName && (
              <div className="mt-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2.5">
                <FaCheckCircle className="text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                  {accountName}
                </span>
              </div>
            )}

            {hasValidated && bankError && (
              <div className="mt-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2.5 text-xs text-rose-300">
                <FaExclamationCircle className="text-rose-400 flex-shrink-0" />
                {bankError}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
              Withdrawal Amount (₦)
            </label>
            <input
              type="number"
              min={minWithdraw}
              max={maxAmount}
              placeholder={`Min ₦${minWithdraw.toLocaleString()}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-black/60 border border-yellow-400/40 text-yellow-200 placeholder-yellow-200/20 text-lg font-semibold focus:outline-none focus:border-yellow-400"
              disabled={loading}
              required
            />
            <p className="text-xs text-yellow-200/40 mt-1">
              Minimum: ₦{minWithdraw.toLocaleString()} ({formatDollar(minWithdraw)})
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !amountValid || !accountName || !!bankError}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-lg shadow-xl hover:shadow-yellow-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaShieldAlt /> Confirm & Withdraw
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-yellow-200/40 mt-6 flex items-center justify-center gap-1.5">
          <FaBolt className="text-yellow-400" /> Automatic payouts verified via Paystack NUBAN API
        </p>
      </div>

      {/* Premium Bank Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-yellow-400/40 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-yellow-400/20 flex justify-between items-center">
              <h2 className="text-xl font-black text-yellow-300 flex items-center gap-2">
                <FaUniversity /> Select Your Bank
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Quick Select Chips */}
            <div className="p-4 border-b border-yellow-400/10">
              <p className="text-xs font-semibold text-yellow-200/50 mb-2.5">POPULAR</p>
              <div className="flex flex-wrap gap-2">
                {banksList
                  .filter(b => POPULAR_BANK_CODES.includes(b.code))
                  .map(b => (
                    <button
                      key={b.code}
                      onClick={() => handleSelectBank(b)}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-bold transition"
                    >
                      {b.name.split(" ")[0]}
                    </button>
                  ))}
              </div>
            </div>

            {/* Search Box */}
            <div className="p-4 pb-2">
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-3.5 text-yellow-400/50" />
                <input
                  type="text"
                  placeholder="Search bank name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-yellow-400/30 text-yellow-200 text-sm placeholder-yellow-200/30 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Bank Items List */}
            <div className="overflow-y-auto flex-1 p-4 pt-2 space-y-1">
              {filteredBanks.length === 0 ? (
                <div className="text-center py-10 text-yellow-200/40 text-sm">
                  No bank found matching "{searchQuery}"
                </div>
              ) : (
                filteredBanks.map(b => (
                  <button
                    key={b.code + b.name}
                    onClick={() => handleSelectBank(b)}
                    className="w-full text-left p-3 rounded-xl hover:bg-yellow-400/10 transition flex items-center justify-between group border border-transparent hover:border-yellow-400/20"
                  >
                    <span className="text-yellow-200 text-sm font-medium group-hover:text-yellow-300">
                      {b.name}
                    </span>
                    <span className="text-xs font-mono text-yellow-200/40 group-hover:text-yellow-400">
                      {b.code}
                    </span>
                  </button>
                ))
              )}
            </div>

          </div>
        </div>
      )}
    </main>
  );
}