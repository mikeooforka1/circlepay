import React, { useState } from "react";

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

const resolvableBanks = banks.filter((b) => b.code && b.code !== "302");
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function BankDetailsModal({ onSuccess, onClose }) {
  const [bankCode, setBankCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankError, setBankError] = useState("");
  const [hasValidated, setHasValidated] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bankDropdownRef = React.useRef(null);

  // Filtered banks for search
  const filteredBanks = bankSearch
    ? resolvableBanks.filter((b) =>
        b.name.toLowerCase().includes(bankSearch.toLowerCase())
      )
    : resolvableBanks;

  // Handle selecting a bank from the dropdown
  const handleBankSelect = (e) => {
    const selected = banks.find((b) => b.name === e.target.value);
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
        `${API_BASE}/api/withdraw/bank/resolve?account_number=${accNum}&bank_code=${bankCode}&bank_name=${encodeURIComponent(
          bankName
        )}`,
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
  React.useEffect(() => {
    if (accountNumber.length === 10 && bankCode) {
      resolveBankAccount(accountNumber, bankCode, bankName);
    } else {
      setAccountName("");
      setBankError("");
      setHasValidated(false);
    }
    // eslint-disable-next-line
  }, [accountNumber, bankCode, bankName]);

  // Save bank details to user profile and update globally (e.g., in context/localStorage)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!accountName || !!bankError) {
      setError("Please enter valid bank details.");
      setLoading(false);
      return;
    }
    try {
      // Ensure this matches your backend route!
      const res = await fetch(`${API_BASE}/api/users/bank-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bankName, accountNumber, accountName }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to add bank details");
        setLoading(false);
        return;
      }
      // Save bank details globally (example: localStorage)
      localStorage.setItem("bankDetails", JSON.stringify({ bankName, accountNumber, accountName }));
      // If you use context, call context setter here
      // e.g. setBankDetails({ bankName, accountNumber, accountName });
      onSuccess();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          Add Bank Details
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-blue-700 font-medium" htmlFor="bankName">
            Bank Name
          </label>
          <div className="relative">
            {!bankName ? (
              <>
                <input
                  id="bankSearchInput"
                  type="text"
                  className="rounded px-3 py-2 border border-blue-200 mb-2"
                  placeholder="Search bank..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  onFocus={handleBankInputFocus}
                  autoComplete="off"
                  readOnly={false}
                  style={{ cursor: "pointer" }}
                />
                {showBankDropdown && (
                  <select
                    ref={bankDropdownRef}
                    id="bankName"
                    className="absolute z-20 left-0 right-0 rounded px-3 py-2 border border-blue-200 bg-white"
                    value=""
                    onChange={handleBankSelect}
                    size={filteredBanks.length > 8 ? 8 : filteredBanks.length}
                    style={{
                      minHeight: "44px",
                      maxHeight: "220px",
                      overflowY: "auto",
                      marginBottom: "0.5rem",
                      top: "44px",
                    }}
                  >
                    {filteredBanks.length === 0 ? (
                      <option value="">No bank found</option>
                    ) : (
                      filteredBanks.map((b) => (
                        <option
                          key={b.name}
                          value={b.name}
                          className="bg-white text-blue-700"
                        >
                          {b.name}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 rounded px-3 py-2 mb-2 w-full flex items-center">
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
          <label className="text-blue-700 font-medium" htmlFor="accountNumber">
            Account Number
          </label>
          <input
            id="accountNumber"
            type="text"
            maxLength={10}
            className={`rounded px-3 py-2 border w-full ${
              hasValidated
                ? accountName
                  ? "border-emerald-400"
                  : "border-rose-400"
                : "border-blue-200"
            }`}
            placeholder="Enter your account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/, ""))}
            disabled={loading}
            required
          />
          {resolving && (
            <div className="flex items-center gap-2 text-blue-400 text-xs mt-1">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>
              Validating account...
            </div>
          )}
          {hasValidated && accountName && !bankError && (
            <div className="text-emerald-400 text-xs mt-1">
              <span className="font-semibold">Account Name:</span> {accountName}
            </div>
          )}
          {hasValidated && bankError && (
            <div className="text-rose-400 text-xs mt-1">{bankError}</div>
          )}
          {error && <div className="text-rose-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="mt-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold"
            disabled={loading || !accountName || !!bankError}
          >
            {loading ? "Saving..." : "Save Bank Details"}
          </button>
          <button
            type="button"
            className="mt-2 px-4 py-2 rounded-full bg-gray-200 text-blue-700 font-semibold"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </div>
      <style>{`
        select, option {
          background: #fff !important;
          color: #1e293b !important;
        }
      `}</style>
    </div>
  );
}