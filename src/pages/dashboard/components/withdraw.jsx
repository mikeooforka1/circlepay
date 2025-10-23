import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const banks = [
  { name: "Access Bank", code: "044" },
  { name: "GTBank Plc", code: "058" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "Zenith Bank Plc", code: "057" },
  { name: "United Bank for Africa", code: "033" },
  { name: "Fidelity Bank", code: "070" },
  { name: "Sterling Bank", code: "232" },
  { name: "Polaris Bank", code: "076" },
  { name: "Citi Bank", code: "023" },
  { name: "Ecobank Bank", code: "050" },
  { name: "Unity Bank", code: "215" },
  { name: "StanbicIBTC Bank", code: "221" },
  { name: "Access Bank (Diamond)", code: "063" },
  { name: "Heritage Bank", code: "030" },
  { name: "Standard Chartered", code: "068" },
  { name: "Suntrust Bank", code: "100" },
  { name: "Providus Bank", code: "101" },
  { name: "Rand Merchant Bank", code: "502" },
  { name: "Titan Trust Bank", code: "102" },
  { name: "Globus Bank", code: "103" },
  { name: "Central Bank of Nigeria", code: "001" },
  { name: "Keystone Bank", code: "082" },
  { name: "Wema Bank", code: "035" },
  { name: "FCMB", code: "214" },
  { name: "Jaiz Bank", code: "301" },
  { name: "Parallex Bank", code: "104" },
  { name: "Premium Trust Bank", code: "105" },
  { name: "Signature Bank", code: "106" },
  { name: "Optimus Bank", code: "107" },
];

const resolvableBanks = banks.filter(b => b.code && b.code !== "302");
const NGN_TO_USD = 1461.66;
const API_BASE = process.env.REACT_APP_API_URL || "";

function formatDollar(ngn) {
  const usd = ngn / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function Withdraw() {
  const location = useLocation();
  const maxAmount = location.state?.maxAmount || 0;

  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [bankError, setBankError] = useState("");
  const [hasValidated, setHasValidated] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const bankDropdownRef = React.useRef(null);

  const minWithdraw = 20000;
  const canWithdraw = maxAmount >= minWithdraw;
  const amountValid = Number(amount) >= minWithdraw && Number(amount) <= maxAmount;

  // Fetch user's saved bank details on mount
  useEffect(() => {
    async function fetchBankDetails() {
      try {
        const res = await fetch(`${API_BASE}/api/users/bank-details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok && data.hasBankDetails && data.bankName && data.accountNumber) {
          setBankName(data.bankName);
          setAccountNumber(data.accountNumber);
          setBankCode(
            banks.find(b => b.name === data.bankName)?.code || ""
          );
          setHasValidated(true);
          setAccountName(data.accountName || "");
        }
      } catch {
        // ignore
      }
    }
    fetchBankDetails();
  }, []);

  // Filtered banks for search
  const filteredBanks = bankSearch
    ? resolvableBanks.filter(b =>
        b.name.toLowerCase().includes(bankSearch.toLowerCase())
      )
    : resolvableBanks;

  // Handle selecting a bank from the dropdown
  const handleBankSelect = (e) => {
    const selected = banks.find(b => b.name === e.target.value);
    setBankName(selected.name);
    setBankCode(selected.code);
    setBankSearch("");
    setShowBankDropdown(false);
  };

  // Open dropdown on input focus
  const handleBankInputFocus = () => {
    setShowBankDropdown(true);
    setBankSearch("");
  };

  // Allow changing bank after selection
  const handleChangeBank = () => {
    setBankName("");
    setBankCode("");
    setBankSearch("");
    setShowBankDropdown(true);
    setAccountName("");
    setAccountNumber("");
    setHasValidated(false);
  };

  // Validate and resolve bank account (send both code and name)
  const resolveBankAccount = async (accNum, bankCode, bankName) => {
    setAccountName("");
    setBankError("");
    setHasValidated(false);
    if (!accNum || accNum.length !== 10 || !bankCode) return;
    setResolving(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/withdraw/bank/resolve?account_number=${accNum}&bank_code=${bankCode}&bank_name=${encodeURIComponent(bankName)}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = await res.json();
      if (res.ok && data.status && data.data && data.data.account_name) {
        setAccountName(data.data.account_name);
        setBankError("");
        setHasValidated(true);
      } else {
        setAccountName("");
        setBankError("Invalid bank details. Please check and try again.");
        setHasValidated(true);
      }
    } catch {
      setAccountName("");
      setBankError("Unable to verify bank details. Try again later.");
      setHasValidated(true);
    }
    setResolving(false);
  };

  // Watch for account number or bank change
  useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      resolveBankAccount(accountNumber, bankCode, bankName);
    } else {
      setAccountName("");
      setBankError("");
      setHasValidated(false);
    }
    // eslint-disable-next-line
  }, [accountNumber, bankCode, bankName]);

  // Save bank details to user profile if changed
  const saveBankDetails = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bankName,
          accountNumber,
          accountName,
        }),
      });
      // Optionally handle response
    } catch {
      // ignore
    }
  };

  // Save bank details before withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    if (!amountValid) {
      alert(`Minimum withdrawal is ₦${minWithdraw.toLocaleString()}`);
      return;
    }
    if (!accountName || !!bankError) {
      setBankError("Please enter valid bank details.");
      return;
    }
    setLoading(true);

    // Save bank details if changed
    await saveBankDetails();

    const payload = {
      method: "bank",
      amount,
      bankCode,
      bankName,
      accountNumber,
      accountName,
    };
    fetch(`${API_BASE}/api/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        setLoading(false);
        if (res.ok) {
          setSuccessMsg("Withdrawal successful! You will receive your money in the next 3hrs.");
        } else {
          const data = await res.json();
          alert(data.message || "Withdrawal failed");
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Withdrawal failed. Please try again.");
      });
  };

  return (
    <main className="min-h-screen pt-24 flex justify-center items-start bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-blue-100">
        <div className="flex flex-col items-center mb-8">
          <img src="/assets/images/site-logo.png" alt="CirclePay Logo" className="w-16 h-16 rounded-full shadow-lg mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-700 mb-1 text-center">Withdraw Funds</h2>
          <p className="text-slate-600 text-center text-base">
            Withdraw your CirclePay earnings directly to your Nigerian bank account.
          </p>
        </div>
        <div className="mb-6 flex flex-col gap-1 text-center">
          <div className="text-blue-700 text-sm">
            <span className="font-semibold">Maximum withdrawable:</span> ₦{maxAmount.toLocaleString()}
            <span className="ml-2 text-cyan-500 font-semibold">{formatDollar(maxAmount)}</span>
          </div>
          <div className="text-blue-500 text-xs">
            Minimum withdrawal: ₦{minWithdraw.toLocaleString()} ({formatDollar(minWithdraw)})
          </div>
        </div>
        {successMsg && (
          <div className="mb-4 py-3 px-4 rounded-xl bg-emerald-100 text-emerald-700 text-center font-semibold shadow animate-bounce">
            {successMsg}
          </div>
        )}
        <form onSubmit={handleWithdraw} className="flex flex-col gap-5">
          <div>
            <label className="text-blue-700 font-medium" htmlFor="bankName">
              Bank Name
            </label>
            <div className="relative mt-2">
              {!bankName ? (
                <>
                  <input
                    id="bankSearchInput"
                    type="text"
                    className="rounded-xl px-3 py-2 border border-blue-200 mb-2 w-full bg-blue-50 text-blue-700"
                    placeholder="Search bank..."
                    value={bankSearch}
                    onChange={e => setBankSearch(e.target.value)}
                    onFocus={handleBankInputFocus}
                    autoComplete="off"
                    readOnly={false}
                    style={{ cursor: "pointer" }}
                  />
                  {showBankDropdown && (
                    <select
                      ref={bankDropdownRef}
                      id="bankName"
                      className="absolute z-20 left-0 right-0 rounded-xl px-3 py-2 border border-blue-200 bg-white text-blue-700 w-full"
                      value=""
                      onChange={handleBankSelect}
                      size={filteredBanks.length > 8 ? 8 : filteredBanks.length}
                      style={{
                        minHeight: "44px",
                        maxHeight: "220px",
                        overflowY: "auto",
                        marginBottom: "0.5rem",
                        top: "44px"
                      }}
                    >
                      {filteredBanks.length === 0 ? (
                        <option value="">No bank found</option>
                      ) : (
                        filteredBanks.map(b => (
                          <option key={b.name} value={b.name} className="bg-white text-blue-700">
                            {b.name}
                          </option>
                        ))
                      )}
                    </select>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-xl px-3 py-2 mb-2 w-full flex items-center">
                    <span className="text-blue-700 font-semibold">{bankName}</span>
                  </div>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 rounded bg-blue-200 text-blue-700 text-xs"
                    onClick={handleChangeBank}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-blue-700 font-medium" htmlFor="accountNumber">
              Account Number
            </label>
            <input
              id="accountNumber"
              type="text"
              maxLength={10}
              className={`rounded-xl px-3 py-2 border w-full bg-blue-50 text-blue-700 ${
                hasValidated
                  ? accountName
                    ? "border-emerald-400"
                    : "border-rose-400"
                  : "border-blue-200"
              }`}
              placeholder="Enter your account number"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value.replace(/\D/, ""))}
              disabled={loading}
              required
            />
            {resolving && (
              <div className="flex items-center gap-2 text-cyan-500 text-xs mt-1">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></span>
                Validating account...
              </div>
            )}
            {hasValidated && accountName && !bankError && (
              <div className="text-emerald-500 text-xs mt-1">
                <span className="font-semibold">Account Name:</span> {accountName}
              </div>
            )}
            {hasValidated && bankError && (
              <div className="text-rose-500 text-xs mt-1">{bankError}</div>
            )}
          </div>
          <div>
            <label className="text-blue-700 font-medium" htmlFor="amount">
              Amount (₦)
            </label>
            <input
              id="amount"
              type="number"
              min={minWithdraw}
              max={maxAmount}
              step="1"
              className="rounded-xl px-3 py-2 border border-blue-200 w-full bg-blue-50 text-blue-700"
              placeholder={`Enter amount (min ₦${minWithdraw.toLocaleString()})`}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={loading}
              required
            />
            <div className="text-xs text-blue-500 mb-2 text-center">
              {amount
                ? <>You will withdraw <span className="font-semibold text-blue-700">₦{Number(amount).toLocaleString()}</span> <span className="ml-1 text-cyan-500 font-semibold">{formatDollar(Number(amount))}</span></>
                : null}
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={
              loading ||
              !accountName ||
              !!bankError ||
              !canWithdraw ||
              !amountValid
            }
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
          {(!canWithdraw || !amountValid) && (
            <div className="text-rose-500 text-sm mt-2 text-center">
              Minimum withdrawal is ₦{minWithdraw.toLocaleString()} ({formatDollar(minWithdraw)}).
            </div>
          )}
        </form>
        <div className="mt-8 text-center text-blue-700 text-sm">
          Withdrawals are processed securely to your bank account.<br />
          <span className="text-cyan-600 font-semibold">You will receive your money in the next 3hrs after withdrawal.</span>
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          Powered by <span className="font-bold text-blue-700">CirclePay</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          main {
            padding-top: 2.5rem !important;
          }
          .max-w-lg {
            padding: 2rem !important;
          }
        }
        select, option {
          background: #fff !important;
          color: #1e293b !important;
        }
      `}</style>
    </main>
  );
}