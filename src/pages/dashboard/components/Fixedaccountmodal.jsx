import React, { useState } from "react";
import { FaTimes, FaCopy, FaCheckCircle, FaQuestionCircle } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const DEPOSIT_FEE_PERCENTAGE = 10;

export default function FixedAccountModal({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState("amount"); // amount, account, verify, success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  const [showBankGuide, setShowBankGuide] = useState(false);

  const fixedAccount = {
    accountNumber: "8143316441",
    accountName: "michael oforka chinonso",
    bankName: "moniepoint Microfinance Bank",
  };

  const [formData, setFormData] = useState({
    amount: "",
    transactionReference: "",
  });

  // Calculate fee and total
  const walletAmount = formData.amount ? Number(formData.amount) : 0;
  const depositFee = Math.round(walletAmount * (DEPOSIT_FEE_PERCENTAGE / 100));
  const totalToPay = walletAmount + depositFee;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleNextStep = () => {
    if (currentStep === "amount") {
      if (!formData.amount || formData.amount <= 0) {
        setError("❌ Please enter a valid amount");
        return;
      }
      setCurrentStep("account");
      setError("");
    }
  };

  const handleVerifyDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.transactionReference.trim()) {
      setError("❌ Please enter the transaction reference from your bank");
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
          totalPaid: totalToPay,
          depositFee: depositFee,
          transactionReference: formData.transactionReference.trim(),
          recipientName: "",
        }),
      });

      const data = await res.json();

      // Check both res.ok and data.success flag
     if (res.ok) {
  console.log("✅ Deposit verified successfully:", data);

  setCurrentStep("success");

  // Refresh dashboard balance immediately
  if (onSuccess) {
    onSuccess(data);
  }

  // Close modal automatically
  setTimeout(() => {
    onClose();
  }, 2000);
} else {
        // Show error message from response
        const errorMsg = data.message || "Failed to verify deposit";
        console.error("❌ Deposit verification failed:", errorMsg);
        setError(`❌ ${errorMsg}`);
      }
    } catch (err) {
      console.error("Verify deposit error:", err);
      setError("❌ An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 rounded-2xl sm:rounded-3xl border border-yellow-400/50 p-6 sm:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-yellow-300">
            Add Money to Wallet 💰
          </h2>
          <button
            onClick={onClose}
            className="text-yellow-300/70 hover:text-yellow-300 transition p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Progress Indicator */}
        {currentStep !== "success" && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm mb-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep === "amount" ? "bg-yellow-400/30 text-yellow-300" : "bg-green-500/30 text-green-400"}`}>
                1
              </div>
              <span className={currentStep === "amount" ? "text-yellow-300 font-bold" : "text-green-400"}>Enter Amount</span>
              
              <div className="flex-1 h-1 mx-2 bg-gray-600 rounded"></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep === "account" || currentStep === "verify" ? "bg-yellow-400/30 text-yellow-300" : "bg-gray-600 text-gray-400"}`}>
                2
              </div>
              <span className={currentStep === "account" || currentStep === "verify" ? "text-yellow-300 font-bold" : "text-gray-400"}>Transfer Money</span>
              
              <div className="flex-1 h-1 mx-2 bg-gray-600 rounded"></div>
              
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${currentStep === "verify" ? "bg-yellow-400/30 text-yellow-300" : "bg-gray-600 text-gray-400"}`}>
                3
              </div>
              <span className={currentStep === "verify" ? "text-yellow-300 font-bold" : "text-gray-400"}>Confirm</span>
            </div>
          </div>
        )}

        {/* STEP 1: AMOUNT */}
        {currentStep === "amount" && (
          <div className="space-y-6">
            {/* Simple Explanation */}
            <div className="bg-blue-500/15 border border-blue-400/30 rounded-2xl p-5 flex gap-3">
              <FaQuestionCircle className="text-blue-400 text-2xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 text-sm leading-relaxed">
                  💡 <strong>How it works:</strong> You enter the amount you want in your wallet. We'll add a 10% fee on top, so you know exactly what to pay your bank.
                </p>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-yellow-300 text-sm font-bold mb-2">
                How much do you want to add? (₦)
              </label>
              <input
                type="number"
                name="amount"
                placeholder="e.g., 1000"
                value={formData.amount}
                onChange={handleInputChange}
                min="100"
                className="w-full bg-black/40 border-2 border-yellow-400/50 rounded-xl px-4 py-4 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition text-lg font-semibold"
              />
              <p className="text-yellow-200/60 text-xs mt-2">
                Minimum: ₦100
              </p>
            </div>

            {/* Fee Breakdown */}
            {walletAmount > 0 && (
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-5">
                <p className="text-yellow-200/80 text-sm font-semibold mb-4">
                  📊 Here's what you'll pay:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Your wallet gets:</span>
                    <span className="text-green-400 font-bold text-lg">₦{walletAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-200">Deposit fee (10%):</span>
                    <span className="text-orange-400 font-bold text-lg">₦{depositFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-yellow-400/20 pt-2 flex justify-between items-center">
                    <span className="text-yellow-300 font-bold">Total to pay to bank:</span>
                    <span className="text-yellow-300 font-black text-2xl">₦{totalToPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNextStep}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:shadow-xl hover:scale-105 transition duration-300 text-lg"
            >
              Next →
            </button>
          </div>
        )}

        {/* STEP 2: ACCOUNT DETAILS */}
        {currentStep === "account" && (
          <div className="space-y-6">
            {/* What to Do */}
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-5">
              <p className="text-yellow-200 text-sm font-semibold mb-3">
                📱 Copy these details and transfer ₦{totalToPay.toLocaleString()} from your bank app:
              </p>
            </div>

            {/* Account Details - Big and Easy to Copy */}
            <div className="space-y-4">
              {/* Bank Name */}
              <div className="bg-black/40 border-2 border-yellow-400/30 rounded-xl p-5 hover:border-yellow-400/60 transition">
                <p className="text-yellow-300/70 text-xs font-bold uppercase mb-3">Bank</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg sm:text-xl font-bold text-yellow-300">
                    {fixedAccount.bankName}
                  </p>
                  <button
                    onClick={() => handleCopy(fixedAccount.bankName, "bankName")}
                    className="flex-shrink-0 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 p-3 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <FaCopy size={20} />
                  </button>
                </div>
                {copiedField === "bankName" && (
                  <p className="text-green-400 text-xs mt-2 font-bold">✓ Copied!</p>
                )}
              </div>

              {/* Account Number */}
              <div className="bg-black/40 border-2 border-yellow-400/30 rounded-xl p-5 hover:border-yellow-400/60 transition">
                <p className="text-yellow-300/70 text-xs font-bold uppercase mb-3">Account Number</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg sm:text-2xl font-black text-yellow-300 font-mono">
                    {fixedAccount.accountNumber}
                  </p>
                  <button
                    onClick={() => handleCopy(fixedAccount.accountNumber, "accountNumber")}
                    className="flex-shrink-0 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 p-3 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <FaCopy size={20} />
                  </button>
                </div>
                {copiedField === "accountNumber" && (
                  <p className="text-green-400 text-xs mt-2 font-bold">✓ Copied!</p>
                )}
              </div>

              {/* Account Name */}
              <div className="bg-black/40 border-2 border-yellow-400/30 rounded-xl p-5 hover:border-yellow-400/60 transition">
                <p className="text-yellow-300/70 text-xs font-bold uppercase mb-3">Account Name</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg sm:text-xl font-bold text-yellow-300">
                    {fixedAccount.accountName}
                  </p>
                  <button
                    onClick={() => handleCopy(fixedAccount.accountName, "accountName")}
                    className="flex-shrink-0 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 p-3 rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <FaCopy size={20} />
                  </button>
                </div>
                {copiedField === "accountName" && (
                  <p className="text-green-400 text-xs mt-2 font-bold">✓ Copied!</p>
                )}
              </div>
            </div>

            {/* Helper Guide */}
            <div className="bg-purple-500/15 border border-purple-400/30 rounded-2xl p-5">
              <button
                onClick={() => setShowBankGuide(!showBankGuide)}
                className="w-full flex items-center justify-between text-left"
              >
                <span className="text-yellow-300 font-semibold">📲 How do I transfer in my bank app?</span>
                <span className={`text-yellow-300 transition ${showBankGuide ? "rotate-180" : ""}`}>▼</span>
              </button>
              
              {showBankGuide && (
                <div className="mt-4 space-y-2 text-yellow-200/80 text-sm">
                  <p>1️⃣ Open your bank app</p>
                  <p>2️⃣ Click "Transfer" or "Send Money"</p>
                  <p>3️⃣ Paste the account number: {fixedAccount.accountNumber}</p>
                  <p>4️⃣ Select bank: {fixedAccount.bankName}</p>
                  <p>5️⃣ Enter amount: ₦{totalToPay.toLocaleString()}</p>
                  <p>6️⃣ Complete the transfer</p>
                  <p>7️⃣ Save the transaction reference (it will show in your app)</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep("amount")}
                className="flex-1 py-3 rounded-xl border-2 border-yellow-400/50 text-yellow-300 font-bold hover:bg-yellow-400/10 transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep("verify")}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:shadow-xl transition text-lg"
              >
                I Sent the Money →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFY */}
        {currentStep === "verify" && (
          <form onSubmit={handleVerifyDeposit} className="space-y-6">
            {/* Instruction */}
            <div className="bg-green-500/15 border border-green-400/30 rounded-2xl p-5">
              <p className="text-yellow-200 text-sm font-semibold">
                ✅ Enter your bank's transaction reference to complete the deposit
              </p>
            </div>

            {/* Transaction Reference Input */}
            <div>
              <label className="block text-yellow-300 text-sm font-bold mb-2">
                Transaction Reference / Receipt Number
              </label>
              <input
                type="text"
                name="transactionReference"
                placeholder="e.g., TRF123456789 or 2461902"
                value={formData.transactionReference}
                onChange={handleInputChange}
                className="w-full bg-black/40 border-2 border-yellow-400/50 rounded-xl px-4 py-4 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition text-lg font-semibold"
              />
              <p className="text-yellow-200/60 text-xs mt-2">
                You'll see this in your bank app after you complete the transfer
              </p>
            </div>

            {/* Amount Reminder */}
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                💬 <strong>Make sure you transferred exactly:</strong> <span className="font-black text-lg text-yellow-300">₦{totalToPay.toLocaleString()}</span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep("account")}
                className="flex-1 py-3 rounded-xl border-2 border-yellow-400/50 text-yellow-300 font-bold hover:bg-yellow-400/10 transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold shadow-lg hover:shadow-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? "⏳ Verifying..." : "✓ Complete Deposit"}
              </button>
            </div>
          </form>
        )}

        {/* SUCCESS */}
        {currentStep === "success" && (
          <div className="text-center py-8 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/30 border-4 border-green-400 flex items-center justify-center">
                <FaCheckCircle className="text-green-400" size={48} />
              </div>
            </div>
            
            <div>
              <h3 className="text-3xl font-black text-green-300 mb-3">
                Success! 🎉
              </h3>
              <p className="text-yellow-200/80 text-lg mb-2">
                ₦{walletAmount.toLocaleString()} added to your wallet
              </p>
              <p className="text-yellow-200/50 text-sm">
                Fee: ₦{depositFee.toLocaleString()}
              </p>
            </div>

            <p className="text-yellow-200/70 text-sm">
              Your wallet will be updated in a few seconds. Thanks for using CirclePay! 💚
            </p>
          </div>
        )}
      </div>
    </div>
  );
}1