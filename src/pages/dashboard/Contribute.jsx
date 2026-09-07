import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUniversity,
  FaCopy,
  FaCheckCircle,
  FaExclamationCircle,
  FaReceipt,
  FaShieldAlt,
  FaCamera,
  FaTrash,
  FaLock,
  FaUsers
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function fmt(n) {
  return `₦${Number(n || 0).toLocaleString()}`;
}

export default function ContributePage() {
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [amount, setAmount] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [senderAccountName, setSenderAccountName] = useState("");
  const [receiptImage, setReceiptImage] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");

  useEffect(() => {
    fetchActiveGroup();
  }, []);

  const fetchActiveGroup = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/groups/my-group/first`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.success && data.group) {
        setGroup(data.group);
        setAmount(data.group.contributionAmount || "");
      } else {
        setError(data.message || "You must join or create an Ajo group before contributing.");
      }
    } catch (err) {
      setError("Network error loading group information.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB. Please choose a smaller screenshot.");
      return;
    }

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptImage(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptImage("");
    setReceiptFileName("");
  };

  const handleConfirmDeposit = async (e) => {
    e.preventDefault();
    if (!group?._id) return;

    if (!transactionReference.trim()) {
      setError("Please enter your bank transfer reference or session ID");
      return;
    }

    if (!receiptImage) {
      setError("Please upload a screenshot or photo of your payment receipt.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/groups/${group._id}/deposit-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Number(amount),
          transactionReference: transactionReference.trim(),
          senderAccountName: senderAccountName.trim(),
          receiptImage: receiptImage
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessData(data.deposit);
      } else {
        setError(data.message || "Failed to record deposit confirmation");
      }
    } catch (err) {
      setError("Network error submitting deposit confirmation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400/30 border-t-yellow-400 mx-auto mb-4" />
          <p className="text-yellow-200/70 text-sm">Loading group collection details...</p>
        </div>
      </main>
    );
  }

  if (error && !group) {
    return (
      <main className="min-h-screen pt-28 pb-10 px-4 bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] text-yellow-400">
        <div className="max-w-md mx-auto text-center rounded-3xl border border-yellow-400/30 bg-black/60 p-8">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-yellow-300 mb-2">No Active Group</h2>
          <p className="text-yellow-200/70 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard/join-group")}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm"
          >
            Join a Group Now
          </button>
        </div>
      </main>
    );
  }

  const isGroupFull = group?.members?.length >= group?.maxMembers;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] text-yellow-400">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition mb-6 text-sm"
        >
          <FaArrowLeft size={12} /> Back to Dashboard
        </button>

        {/* ── CASE 1: CIRCLE NOT FULL (CONTRIBUTIONS LOCKED) ── */}
        {!isGroupFull ? (
          <div className="rounded-3xl border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-950/30 via-black to-yellow-950/20 p-8 text-center shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center mx-auto text-yellow-400 text-3xl">
              <FaLock />
            </div>
            
            <div>
              <span className="px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 text-xs font-bold uppercase tracking-wider">
                Contributions Locked
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-yellow-300 mt-2">
                Waiting for Circle to Fill
              </h2>
              <p className="text-yellow-200/70 text-sm mt-1 max-w-md mx-auto leading-relaxed">
                To keep payouts fair, contributions start only when all <strong>{group?.maxMembers} members</strong> have joined.
              </p>
            </div>

            {/* Membership Progress */}
            <div className="bg-black/60 rounded-2xl border border-yellow-400/20 p-5 max-w-md mx-auto">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-yellow-200/60">Circle Capacity</span>
                <span className="text-yellow-400 font-mono text-sm">{group?.members?.length || 0} / {group?.maxMembers} Joined</span>
              </div>
              <div className="w-full bg-black/80 rounded-full h-3 overflow-hidden border border-yellow-400/30">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((group?.members?.length || 0) / group?.maxMembers) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-yellow-200/50 mt-2">
                {group?.maxMembers - (group?.members?.length || 0)} spot(s) remaining before Turn #1 begins.
              </p>
            </div>

            {/* Invite Box */}
            <div className="flex items-center justify-between gap-3 bg-black/80 border border-yellow-400/30 p-4 rounded-2xl max-w-md mx-auto text-left">
              <div>
                <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Invite Code</p>
                <p className="text-xl font-black font-mono tracking-widest text-yellow-400">{group?.groupCode}</p>
              </div>
              <button
                onClick={() => handleCopy(group?.groupCode)}
                className="px-4 py-2 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 font-bold text-xs transition"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <button
              onClick={() => navigate("/dashboard/group")}
              className="px-6 py-3 rounded-xl border border-yellow-400/40 text-yellow-300 font-bold hover:bg-yellow-400/10 text-sm"
            >
              View Rotation Schedule & Members →
            </button>
          </div>
        ) : successData ? (
          /* ── CASE 2: SUCCESS RECEIPT ── */
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-black to-black p-8 shadow-2xl animate-in fade-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 text-emerald-400 text-3xl">
                <FaCheckCircle />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-400">Deposit Proof Recorded!</h2>
              <p className="text-yellow-200/70 text-xs sm:text-sm mt-1">
                Your receipt image and bank reference are publicly logged with an exact timestamp.
              </p>
            </div>

            <div className="bg-black/60 rounded-2xl border border-yellow-400/20 p-5 space-y-3 mb-6 font-mono text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-yellow-400/10">
                <span className="text-yellow-200/50">Amount:</span>
                <span className="text-yellow-300 font-bold">{fmt(successData.amount)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-yellow-400/10">
                <span className="text-yellow-200/50">Group:</span>
                <span className="text-yellow-300">{group?.groupName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-yellow-400/10">
                <span className="text-yellow-200/50">Reference:</span>
                <span className="text-yellow-400 font-bold">{successData.transactionReference}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-yellow-400/10">
                <span className="text-yellow-200/50">Timestamp:</span>
                <span className="text-emerald-300 font-bold">
                  {new Date(successData.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-200/50">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold uppercase">
                  {successData.status}
                </span>
              </div>

              {successData.receiptImage && (
                <div className="pt-3 border-t border-yellow-400/10 text-center">
                  <p className="text-[11px] text-yellow-200/60 mb-2">Attached Receipt Image:</p>
                  <img 
                    src={successData.receiptImage} 
                    alt="Receipt" 
                    className="w-full max-h-48 object-contain rounded-xl border border-yellow-400/30 mx-auto"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/dashboard/group")}
                className="flex-1 py-3.5 rounded-xl border border-yellow-400/30 text-yellow-300 font-bold hover:bg-yellow-400/10 text-sm"
              >
                View Group Ledger
              </button>
            </div>
          </div>
        ) : (
          /* ── CASE 3: CONTRIBUTION FORM (ACTIVE WHEN FULL) ── */
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Circle Ready ({group?.members?.length}/{group?.maxMembers})
              </div>
              <h1 className="text-3xl font-black text-yellow-300 mb-1">Make Group Contribution</h1>
              <p className="text-yellow-200/60 text-sm">
                Transfer to the designated Group Head account, attach your payment screenshot, and submit proof.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-sm flex items-center gap-2">
                <FaExclamationCircle className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Collection Account Card */}
            <div className="rounded-3xl border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-950/30 via-black to-yellow-950/20 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-yellow-400/20 mb-5">
                <div className="flex items-center gap-2">
                  <FaUniversity className="text-yellow-400 text-xl" />
                  <span className="font-bold text-yellow-200 text-sm">Group Head Collection Account</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-yellow-400/15 text-yellow-300 text-xs font-bold">
                  {group?.groupName}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-black/60 border border-yellow-400/30 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Bank Name</p>
                    <p className="text-lg font-bold text-yellow-300">{group?.collectionBankName || "Not set"}</p>
                  </div>
                </div>

                <div className="bg-black/60 border border-yellow-400/40 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Account Number</p>
                    <p className="text-2xl font-black font-mono tracking-widest text-yellow-400">
                      {group?.collectionAccountNumber || "Not set"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(group?.collectionAccountNumber)}
                    className="p-3 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 transition"
                    title="Copy Account Number"
                  >
                    {copied ? <FaCheckCircle className="text-emerald-400" size={18} /> : <FaCopy size={18} />}
                  </button>
                </div>

                <div className="bg-black/60 border border-yellow-400/30 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Beneficiary Name</p>
                    <p className="text-sm font-bold text-yellow-300 truncate max-w-[280px]">
                      {group?.collectionAccountName || "Group Head"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-yellow-400/10 text-xs text-yellow-200/70 flex items-center gap-2">
                <FaShieldAlt className="text-yellow-400 flex-shrink-0" />
                Required contribution: <strong className="text-yellow-300 font-bold">{fmt(group?.contributionAmount)}</strong> per cycle ({group?.frequency}).
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleConfirmDeposit} className="rounded-3xl border border-yellow-400/30 bg-black/60 p-6 sm:p-8 space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-yellow-300 flex items-center gap-2">
                <FaReceipt /> Submit Transfer Proof & Receipt
              </h3>

              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">
                  Amount Transferred (₦)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-200 font-bold text-lg focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">
                  Bank Transaction Reference / Session ID
                </label>
                <input
                  type="text"
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="e.g. 100004291039 or Session ID"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-200 font-mono tracking-wider focus:outline-none focus:border-yellow-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">
                  Sender Account Name (Optional)
                </label>
                <input
                  type="text"
                  value={senderAccountName}
                  onChange={(e) => setSenderAccountName(e.target.value)}
                  placeholder="e.g. Michael Oforka"
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-yellow-400/30 text-yellow-200 focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-1.5">
                  Upload Payment Receipt Screenshot <span className="text-red-400">*</span>
                </label>
                
                {!receiptImage ? (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-yellow-400/40 rounded-2xl cursor-pointer bg-black/40 hover:bg-yellow-400/5 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaCamera className="w-8 h-8 mb-2 text-yellow-400/70" />
                      <p className="text-xs text-yellow-200 font-semibold">Click to upload transfer receipt image</p>
                      <p className="text-[10px] text-yellow-200/40 mt-1">PNG, JPG, or WEBP (Max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleReceiptChange} 
                      className="hidden" 
                      required 
                    />
                  </label>
                ) : (
                  <div className="relative rounded-2xl border border-yellow-400/40 overflow-hidden bg-black/60 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-yellow-300 font-mono truncate max-w-[200px]">{receiptFileName || "receipt.png"}</span>
                      <button
                        type="button"
                        onClick={removeReceipt}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg text-sm transition"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <img 
                      src={receiptImage} 
                      alt="Receipt Preview" 
                      className="w-full max-h-56 object-contain rounded-xl border border-yellow-400/20"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !amount || !transactionReference.trim() || !receiptImage}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-base hover:shadow-xl hover:shadow-yellow-500/20 transition disabled:opacity-40"
              >
                {submitting ? "Uploading Proof & Logging Timestamp..." : "Submit Proof with Receipt →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}