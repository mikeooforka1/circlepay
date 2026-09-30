import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaUniversity, 
  FaUsers, 
  FaMoneyBillWave, 
  FaClock, 
  FaReceipt, 
  FaShieldAlt, 
  FaCamera, 
  FaTrash, 
  FaCheckCircle, 
  FaCopy 
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "";
const FEE_PER_HEAD = 350;

// FIXED PLATFORM OWNER (SUPER ADMIN) ACCOUNT
const SUPER_ADMIN_ACCOUNT = {
  bankName: "Moniepoint Microfinance Bank",
  accountNumber: "8143316441",
  accountName: "Michael Oforka Chinonso",
};

const COMMON_BANKS = [
  "Access Bank",
  "GTBank (Guaranty Trust Bank)",
  "Zenith Bank",
  "First Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "OPay (PayCom)",
  "PalmPay",
  "Kuda Microfinance Bank",
  "Moniepoint MFB",
  "Fidelity Bank",
  "Sterling Bank",
  "Wema Bank",
  "FCMB"
];

function fmt(n) {
  return `₦${Number(n || 0).toLocaleString()}`;
}

export default function CreateGroup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Circle Rules | 2: Platform Fee Payment & Receipt
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    groupName: "",
    contributionAmount: "",
    frequency: "Weekly",
    maxMembers: "5", // Supports any custom number
    payoutDuration: "7",
    collectionBankName: "OPay (PayCom)",
    collectionAccountNumber: "",
    collectionAccountName: "",
    creationTransactionRef: "",
    creationReceiptImage: "",
    receiptFileName: ""
  });

  const memberCount = Number(formData.maxMembers) || 0;
  const totalPlatformFee = memberCount * FEE_PER_HEAD;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB. Please choose a smaller screenshot.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        creationReceiptImage: reader.result,
        receiptFileName: file.name
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setFormData(prev => ({
      ...prev,
      creationReceiptImage: "",
      receiptFileName: ""
    }));
  };

  const handleCopyAdminAccount = () => {
    navigator.clipboard.writeText(SUPER_ADMIN_ACCOUNT.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.groupName.trim()) {
      setError("Please enter a group name.");
      return;
    }
    if (!formData.contributionAmount || Number(formData.contributionAmount) <= 0) {
      setError("Please enter a valid contribution amount.");
      return;
    }
    if (memberCount < 2) {
      setError("Member count must be at least 2 members.");
      return;
    }
    if (!formData.collectionAccountNumber.trim() || formData.collectionAccountNumber.length < 10) {
      setError("Please provide a valid 10-digit collection account number for your members to pay you.");
      return;
    }
    if (!formData.collectionAccountName.trim()) {
      setError("Please provide your beneficiary account name.");
      return;
    }

    setStep(2);
  };

  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    if (!formData.creationTransactionRef.trim()) {
      setError("Please enter your bank transfer reference or session ID.");
      return;
    }
    if (!formData.creationReceiptImage) {
      setError("Please attach your payment receipt screenshot.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupName: formData.groupName.trim(),
          contributionAmount: Number(formData.contributionAmount),
          frequency: formData.frequency,
          maxMembers: memberCount,
          payoutDuration: Number(formData.payoutDuration),
          collectionBankName: formData.collectionBankName,
          collectionAccountNumber: formData.collectionAccountNumber.trim(),
          collectionAccountName: formData.collectionAccountName.trim(),
          creationTransactionRef: formData.creationTransactionRef.trim(),
          creationReceiptImage: formData.creationReceiptImage
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert(`Success! Your group "${formData.groupName}" has been submitted for Super Admin verification.`);
        navigate("/dashboard");
      } else {
        setError(data.message || "Failed to create group");
      }
    } catch (err) {
      setError("Network error creating group. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => step === 2 ? setStep(1) : navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-300/70 hover:text-yellow-300 transition mb-6 text-sm font-semibold"
        >
          <FaArrowLeft /> {step === 2 ? "Back to Edit Circle Rules" : "Back to Dashboard"}
        </button>

        <div className="rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-yellow-950/20 via-black to-yellow-950/30 p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
              <span>Step {step} of 2</span> • {step === 1 ? "Configure Circle" : "Platform Activation Fee"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-yellow-300">
              {step === 1 ? "Create Ajo Group" : "Complete Creation Payment"}
            </h1>
            <p className="text-yellow-200/70 text-sm mt-1">
              {step === 1 
                ? "Configure rotation frequency, custom member capacity, and your collection bank." 
                : `Pay the platform creation fee of ₦350 per head (${memberCount} members = ${fmt(totalPlatformFee)}).`}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/40 border border-red-500/50 text-red-300 text-sm font-semibold">
              {error}
            </div>
          )}

          {/* ── STEP 1: CONFIGURE GROUP RULES ── */}
          {step === 1 && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              <div>
                <label className="block text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  name="groupName"
                  placeholder="e.g. Lagos Wealth Circle"
                  value={formData.groupName}
                  onChange={handleInputChange}
                  className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3.5 text-yellow-200 focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2">
                    Contribution Per Head (₦)
                  </label>
                  <input
                    type="number"
                    name="contributionAmount"
                    placeholder="5000"
                    value={formData.contributionAmount}
                    onChange={handleInputChange}
                    min="100"
                    className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3.5 text-yellow-200 font-semibold focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3.5 text-yellow-200 focus:outline-none focus:border-yellow-400 text-sm"
                  >
                    <option value="Daily" className="bg-black">Daily</option>
                    <option value="Weekly" className="bg-black">Weekly</option>
                    <option value="Monthly" className="bg-black">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Custom Member Input & Cycle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-yellow-300 text-xs font-bold uppercase tracking-wider">
                      Number of Members (Custom)
                    </label>
                    <span className="text-[10px] text-yellow-400 font-mono font-bold">₦350/head</span>
                  </div>
                  <input
                    type="number"
                    name="maxMembers"
                    min="2"
                    max="100"
                    placeholder="Enter custom count (e.g. 5, 8, 12)"
                    value={formData.maxMembers}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3.5 text-yellow-200 font-bold focus:outline-none focus:border-yellow-400"
                    required
                  />
                  <p className="text-[11px] text-yellow-200/50 mt-1">
                    Platform Fee: <strong className="text-yellow-300">{fmt(totalPlatformFee)}</strong> ({memberCount} × ₦350)
                  </p>
                </div>

                <div>
                  <label className="block text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2">
                    Days per Turn (Cycle Length)
                  </label>
                  <select
                    name="payoutDuration"
                    value={formData.payoutDuration}
                    onChange={handleInputChange}
                    className="w-full bg-black/60 border border-yellow-400/40 rounded-xl px-4 py-3.5 text-yellow-200 focus:outline-none focus:border-yellow-400 text-sm"
                  >
                    <option value="7" className="bg-black">7 Days (Weekly rotation)</option>
                    <option value="14" className="bg-black">14 Days (Bi-weekly)</option>
                    <option value="21" className="bg-black">21 Days (3 Weeks)</option>
                    <option value="30" className="bg-black">30 Days (Monthly)</option>
                  </select>
                </div>
              </div>

              {/* Group Head Collection Account */}
              <div className="p-5 rounded-2xl bg-yellow-400/5 border border-yellow-400/30 space-y-4">
                <div className="flex items-center gap-2">
                  <FaUniversity className="text-yellow-400 text-lg" />
                  <h3 className="text-base font-bold text-yellow-300">
                    Your Collection Bank Account (Where Members Send Contributions)
                  </h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">Bank Name</label>
                  <select
                    name="collectionBankName"
                    value={formData.collectionBankName}
                    onChange={handleInputChange}
                    className="w-full bg-black/70 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-200 text-sm"
                  >
                    {COMMON_BANKS.map(b => <option key={b} value={b} className="bg-black">{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">10-Digit Account Number</label>
                  <input
                    type="text"
                    maxLength={10}
                    name="collectionAccountNumber"
                    placeholder="0123456789"
                    value={formData.collectionAccountNumber}
                    onChange={(e) => setFormData(p => ({ ...p, collectionAccountNumber: e.target.value.replace(/\D/g, "") }))}
                    className="w-full bg-black/70 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-200 font-mono tracking-wider"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">Beneficiary Account Name</label>
                  <input
                    type="text"
                    name="collectionAccountName"
                    placeholder="e.g. John C. Okafor"
                    value={formData.collectionAccountName}
                    onChange={handleInputChange}
                    className="w-full bg-black/70 border border-yellow-400/40 rounded-xl px-4 py-3 text-yellow-200 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-lg hover:shadow-xl hover:shadow-yellow-500/20 transition"
              >
                Proceed to Platform Fee Payment ({fmt(totalPlatformFee)}) →
              </button>
            </form>
          )}

          {/* ── STEP 2: SUPER ADMIN PAYMENT & RECEIPT UPLOAD ── */}
          {step === 2 && (
            <form onSubmit={handleSubmitFinal} className="space-y-6 animate-in fade-in duration-200">
              
              {/* Summary of Fee */}
              <div className="p-4 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex justify-between items-center">
                <div>
                  <p className="text-xs text-yellow-200/60 uppercase font-bold">Group Creation Fee</p>
                  <p className="text-2xl font-black text-yellow-300">{fmt(totalPlatformFee)}</p>
                </div>
                <div className="text-right text-xs text-yellow-200/60">
                  <p>Members: <strong className="text-yellow-300">{memberCount}</strong></p>
                  <p>Rate: <strong>₦350/head</strong></p>
                </div>
              </div>

              {/* Fixed Admin Account Card */}
              <div className="rounded-3xl border-2 border-yellow-400 bg-black/70 p-6 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-yellow-400/20">
                  <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider">
                    Official CirclePay Activation Account
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">
                    Fixed
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="bg-black/80 border border-yellow-400/20 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Bank Name</p>
                      <p className="font-bold text-yellow-300 text-sm">{SUPER_ADMIN_ACCOUNT.bankName}</p>
                    </div>
                  </div>

                  <div className="bg-black/80 border border-yellow-400/30 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Account Number</p>
                      <p className="text-xl font-black font-mono tracking-widest text-yellow-400">
                        {SUPER_ADMIN_ACCOUNT.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAdminAccount}
                      className="p-2.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 transition"
                      title="Copy"
                    >
                      {copied ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
                    </button>
                  </div>

                  <div className="bg-black/80 border border-yellow-400/20 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Beneficiary Name</p>
                      <p className="font-bold text-yellow-300 text-sm">{SUPER_ADMIN_ACCOUNT.accountName}</p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-yellow-200/60 leading-relaxed pt-1">
                  Transfer exactly <strong>{fmt(totalPlatformFee)}</strong> to the account above. Super Admin will verify your transfer and activate your circle.
                </p>
              </div>

              {/* Upload Proof */}
              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase mb-1.5">
                  Bank Transaction Reference / Session ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100092830182 or Session ID"
                  value={formData.creationTransactionRef}
                  onChange={(e) => setFormData(p => ({ ...p, creationTransactionRef: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-yellow-400/40 text-yellow-200 font-mono text-sm focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase mb-1.5">
                  Upload Payment Screenshot / Receipt <span className="text-red-400">*</span>
                </label>

                {!formData.creationReceiptImage ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-yellow-400/40 rounded-2xl cursor-pointer bg-black/40 hover:bg-yellow-400/5 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaCamera className="w-8 h-8 mb-2 text-yellow-400/70" />
                      <p className="text-xs text-yellow-200 font-semibold">Click to upload transfer receipt screenshot</p>
                      <p className="text-[10px] text-yellow-200/40 mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleReceiptChange} className="hidden" required />
                  </label>
                ) : (
                  <div className="relative rounded-2xl border border-yellow-400/40 overflow-hidden bg-black/60 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-yellow-300 font-mono truncate max-w-[200px]">{formData.receiptFileName}</span>
                      <button type="button" onClick={removeReceipt} className="text-red-400 hover:text-red-300 p-1">
                        <FaTrash />
                      </button>
                    </div>
                    <img src={formData.creationReceiptImage} alt="Receipt Preview" className="w-full max-h-52 object-contain rounded-xl" />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-xl border border-yellow-400/40 text-yellow-300 font-bold hover:bg-yellow-400/10 transition text-sm"
                >
                  ← Edit Rules
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.creationTransactionRef.trim() || !formData.creationReceiptImage}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-base hover:shadow-xl hover:shadow-yellow-500/20 transition disabled:opacity-40"
                >
                  {loading ? "Submitting for Approval..." : "Submit for Super Admin Verification →"}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </main>
  );
}