import React, { useState } from "react";
import { FaTimes, FaCopy, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function FixedAccountModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("instructions"); // instructions, verify
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const fixedAccount = {
    accountNumber: "8143316441",
    accountName: "michael oforka chinonso",
    bankName: "moniepoint Microfinance Bank",
  };

  const [formData, setFormData] = useState({
    amount: "",
    transactionReference: "",
    senderName: "",
  });

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleVerifyDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.amount || formData.amount <= 0) {
      setError("Please enter a valid amount");
      setLoading(false);
      return;
    }

    if (!formData.transactionReference.trim()) {
      setError("Transaction reference is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/wallet/verify-fixed-account-deposit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(formData.amount),
          transactionReference: formData.transactionReference,
          recipientName: formData.senderName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data);
          onClose();
        }, 2000);
      } else {
        setError(data.message || "Failed to verify deposit");
      }
    } catch (err) {
      console.error("Verify deposit error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
  <div className="bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 rounded-2xl sm:rounded-3xl border border-yellow-400/50 p-4 sm:p-6 lg:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5 sm:mb-8">
         <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-yellow-300">
            Fund Your Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-yellow-300/70 hover:text-yellow-300 transition p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Success State */}
        {success && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-500/30 border-2 border-green-400 flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-400" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-green-300 mb-2">
              Deposit Verified!
            </h3>
            <p className="text-yellow-200/70">
              ₦{Number(formData.amount).toLocaleString()} has been credited to your wallet
            </p>
          </div>
        )}

        {!success && (
          <>
            {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 border-b border-yellow-400/30 pb-4">
              <button
                onClick={() => setStep("instructions")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  step === "instructions"
                    ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50"
                    : "text-yellow-300/60 hover:text-yellow-300"
                }`}
              >
                Instructions
              </button>
              <button
                onClick={() => setStep("verify")}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  step === "verify"
                    ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/50"
                    : "text-yellow-300/60 hover:text-yellow-300"
                }`}
              >
                Verify Payment
              </button>
            </div>

            {/* Instructions Step */}
            {step === "instructions" && (
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6">
                  <p className="text-yellow-300 font-semibold mb-4">
                    ℹ️ Complete these steps to fund your wallet:
                  </p>
                  <ol className="space-y-3 text-yellow-200/80 text-sm">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/30 text-yellow-300 flex items-center justify-center font-bold text-xs">
                        1
                      </span>
                      <span>
                        Copy the account details below (Account Number, Bank Name, Account Name)
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/30 text-yellow-300 flex items-center justify-center font-bold text-xs">
                        2
                      </span>
                      <span>
                        Go to your bank app and initiate a transfer to the account details provided
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/30 text-yellow-300 flex items-center justify-center font-bold text-xs">
                        3
                      </span>
                      <span>
                        Complete the payment and take note of your transaction reference number
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/30 text-yellow-300 flex items-center justify-center font-bold text-xs">
                        4
                      </span>
                      <span>
                        Return here, click "Verify Payment", and enter your transaction details
                      </span>
                    </li>
                  </ol>
                </div>

                {/* Fixed Account Details */}
                <div className="space-y-4">
                  <p className="text-yellow-300 font-semibold">
                    Bank Account Details:
                  </p>

                  {/* Account Number */}
                  <div className="bg-black/40 border border-yellow-400/30 rounded-xl p-4">
                    <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                      Account Number
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black font-mono text-yellow-300">
                        {fixedAccount.accountNumber}
                      </p>
                      <button
                        onClick={() =>
                          handleCopy(fixedAccount.accountNumber, "accountNumber")
                        }
                        className="text-yellow-400/70 hover:text-yellow-300 transition p-2 hover:bg-yellow-400/10 rounded-lg"
                      >
                        <FaCopy size={18} />
                      </button>
                    </div>
                    {copiedField === "accountNumber" && (
                      <p className="text-green-400 text-xs mt-2 font-semibold">
                        ✓ Copied to clipboard
                      </p>
                    )}
                  </div>

                  {/* Bank Name */}
                  <div className="bg-black/40 border border-yellow-400/30 rounded-xl p-4">
                    <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                      Bank Name
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-yellow-300">
                        {fixedAccount.bankName}
                      </p>
                      <button
                        onClick={() => handleCopy(fixedAccount.bankName, "bankName")}
                        className="text-yellow-400/70 hover:text-yellow-300 transition p-2 hover:bg-yellow-400/10 rounded-lg"
                      >
                        <FaCopy size={18} />
                      </button>
                    </div>
                    {copiedField === "bankName" && (
                      <p className="text-green-400 text-xs mt-2 font-semibold">
                        ✓ Copied to clipboard
                      </p>
                    )}
                  </div>

                  {/* Account Name */}
                  <div className="bg-black/40 border border-yellow-400/30 rounded-xl p-4">
                    <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                      Account Name
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-yellow-300">
                        {fixedAccount.accountName}
                      </p>
                      <button
                        onClick={() =>
                          handleCopy(fixedAccount.accountName, "accountName")
                        }
                        className="text-yellow-400/70 hover:text-yellow-300 transition p-2 hover:bg-yellow-400/10 rounded-lg"
                      >
                        <FaCopy size={18} />
                      </button>
                    </div>
                    {copiedField === "accountName" && (
                      <p className="text-green-400 text-xs mt-2 font-semibold">
                        ✓ Copied to clipboard
                      </p>
                    )}
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-orange-500/10 border border-orange-400/30 rounded-2xl p-4 flex gap-3">
                  <FaExclamationCircle className="text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-orange-300 text-xs font-semibold mb-1">
                      Important
                    </p>
                    <p className="text-orange-200/70 text-xs">
                      Ensure you copy the exact account details. Any errors may cause deposit delays.
                    </p>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setStep("verify")}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
                >
                  Proceed to Verify Payment
                </button>
              </div>
            )}

            {/* Verify Step */}
            {step === "verify" && (
              <form onSubmit={handleVerifyDeposit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Amount */}
                <div>
                  <label className="block text-yellow-300 text-sm font-semibold mb-3">
                    Amount Sent (₦)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="e.g., 5000"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="100"
                    className="w-full bg-black/40 border border-yellow-400/50 rounded-xl px-4 py-3 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition"
                  />
                  <p className="text-yellow-200/60 text-xs mt-2">
                    The exact amount you transferred
                  </p>
                </div>

                {/* Transaction Reference */}
                <div>
                  <label className="block text-yellow-300 text-sm font-semibold mb-3">
                    Transaction Reference
                  </label>
                  <input
                    type="text"
                    name="transactionReference"
                    placeholder="e.g., TRF123456789"
                    value={formData.transactionReference}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-yellow-400/50 rounded-xl px-4 py-3 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition"
                  />
                  <p className="text-yellow-200/60 text-xs mt-2">
                    Check your bank receipt or app for this reference
                  </p>
                </div>

                {/* Sender Name (Optional) */}
                <div>
                  <label className="block text-yellow-300 text-sm font-semibold mb-3">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    placeholder="Your full name"
                    value={formData.senderName}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-yellow-400/50 rounded-xl px-4 py-3 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition"
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-4 flex gap-3">
                  <div className="text-blue-400 text-lg mt-1">ℹ️</div>
                  <div>
                    <p className="text-blue-300 text-xs font-semibold mb-1">
                      Verification Process
                    </p>
                    <p className="text-blue-200/70 text-xs">
                      Your deposit will be verified and credited to your wallet within a few moments. You'll receive a confirmation message.
                    </p>
                  </div>
                </div>

                {/* Button Group */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep("instructions")}
                    className="flex-1 py-3 rounded-xl border border-yellow-400/50 text-yellow-300 font-bold hover:bg-yellow-400/10 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify & Credit Wallet"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}