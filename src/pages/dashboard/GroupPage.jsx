import React, { useEffect, useState } from "react";
import { 
  FaCopy, 
  FaUsers, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaClock, 
  FaShieldAlt, 
  FaTimesCircle, 
  FaEye, 
  FaTimes, 
  FaPlusCircle, 
  FaArrowUp, 
  FaArrowDown, 
  FaLock 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function fmt(n) {
  return `₦${Number(n || 0).toLocaleString()}`;
}

export default function GroupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("rotation");
  const [actionLoading, setActionLoading] = useState(null);

  // Reorder State
  const [memberOrder, setMemberOrder] = useState([]);
  const [reorderSaving, setReorderSaving] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  // Receipt Modal Preview State
  const [previewReceipt, setPreviewReceipt] = useState(null);

  // Group Head Self-Contribution State
  const [showHeadContribute, setShowHeadContribute] = useState(false);
  const [headRef, setHeadRef] = useState("");
  const [headReceiptImage, setHeadReceiptImage] = useState("");
  const [headSubmitting, setHeadSubmitting] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/my-group/first`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGroup(data.group);
        setMemberOrder(data.group.members || []);
        setHasOrderChanged(false);
      }
    } catch (err) {
      console.error("Fetch group error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reorder positions in memberOrder array
  const moveMember = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= memberOrder.length) return;

    const updated = [...memberOrder];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    setMemberOrder(updated);
    setHasOrderChanged(true);
  };

  const saveReorderedRotation = async () => {
    try {
      setReorderSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/${group._id}/reorder-rotation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newMemberOrder: memberOrder.map(m => m._id || m)
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Rotation positions updated successfully!");
        setGroup(data.group);
        setMemberOrder(data.group.members || []);
        setHasOrderChanged(false);
      } else {
        alert(data.message || "Failed to update rotation order");
      }
    } catch {
      alert("Network error saving rotation order");
    } finally {
      setReorderSaving(false);
    }
  };

  const handleVerifyDeposit = async (depositId, action) => {
    try {
      setActionLoading(depositId);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/${group._id}/deposits/${depositId}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchGroup();
      } else {
        alert(data.message || "Failed to update deposit");
      }
    } catch {
      alert("Network error updating deposit");
    } finally {
      setActionLoading(null);
    }
  };

  const handleHeadSelfDeposit = async (e) => {
    e.preventDefault();
    if (!headRef.trim() || !headReceiptImage) {
      alert("Please provide the transaction reference and attach your payment receipt.");
      return;
    }

    try {
      setHeadSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/${group._id}/deposit-confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Number(group.contributionAmount),
          transactionReference: headRef.trim(),
          senderAccountName: `${user?.fullname || "Group Head"} (Head Contribution)`,
          receiptImage: headReceiptImage
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Your contribution and receipt have been recorded and verified on the ledger!");
        setShowHeadContribute(false);
        setHeadRef("");
        setHeadReceiptImage("");
        fetchGroup();
      } else {
        alert(data.message || "Failed to submit Head contribution");
      }
    } catch {
      alert("Network error logging contribution");
    } finally {
      setHeadSubmitting(false);
    }
  };

  const handleHeadReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeadReceiptImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const copyCode = () => {
    if (group?.groupCode) {
      navigator.clipboard.writeText(group.groupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent" />
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-yellow-400 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-black text-yellow-300 mb-2">No Active Group</h2>
          <p className="text-yellow-200/60 text-sm mb-6">Join or create a group to start saving.</p>
          <button
            onClick={() => navigate("/dashboard/join-group")}
            className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-black text-sm"
          >
            Join a Group
          </button>
        </div>
      </main>
    );
  }

  const isGroupHead = group?.groupHead?._id === user?.id || group?.groupHead === user?.id;
  const isCircleFull = group?.members?.length >= group?.maxMembers;
  const canReorder = isGroupHead && !group?.firstPayoutDone && !group?.rotationLocked;
  const pendingDeposits = group?.deposits?.filter(d => d.status === "pending") || [];
  const allDeposits = group?.deposits || [];
  const lumpSumPayout = Number(group.contributionAmount) * Number(group.maxMembers);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] text-yellow-400">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-400/60 hover:text-yellow-300 transition text-sm"
        >
          <FaArrowLeft size={12} /> Back to Dashboard
        </button>

        {/* ── HEADER CARD ── */}
        <div className="rounded-3xl border border-yellow-400/30 bg-gradient-to-br from-yellow-950/20 via-black to-yellow-950/10 p-6 md:p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold text-yellow-400 tracking-wider">Ajo Savings Circle</span>
                {isCircleFull ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <FaCheckCircle /> Full & Active ({group.members?.length}/{group.maxMembers})
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-[10px] font-bold">
                    Filling Spots ({group.members?.length}/{group.maxMembers})
                  </span>
                )}
                {isGroupHead && (
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-400 text-yellow-300 text-[10px] font-bold">
                    👑 Group Head
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-yellow-300 mb-2">{group.groupName || group.name}</h1>
              
              <div className="flex flex-wrap gap-4 text-xs text-yellow-200/70">
                <span className="flex items-center gap-1.5"><FaMoneyBillWave className="text-yellow-400" /> {fmt(group.contributionAmount)} / member / cycle</span>
                <span className="flex items-center gap-1.5"><FaClock className="text-yellow-400" /> {group.payoutDuration} Days per turn ({group.frequency})</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">Lump Sum Payout: {fmt(lumpSumPayout)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="bg-black/60 border border-yellow-400/30 p-4 rounded-2xl flex items-center gap-3">
                <div>
                  <p className="text-[10px] text-yellow-200/50 uppercase font-bold">Invite Code</p>
                  <p className="text-xl font-black font-mono tracking-widest text-yellow-400">{group.groupCode}</p>
                </div>
                <button
                  onClick={copyCode}
                  className="p-2.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 transition"
                  title="Copy Code"
                >
                  {copied ? <FaCheckCircle className="text-emerald-400" /> : <FaCopy />}
                </button>
              </div>

              {isGroupHead && (
                <button
                  onClick={() => setShowHeadContribute(!showHeadContribute)}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <FaPlusCircle /> {showHeadContribute ? "Close Deposit" : "Log Head Contribution"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── GROUP HEAD SELF-CONTRIBUTION SUBMISSION CARD ── */}
        {isGroupHead && showHeadContribute && (
          <div className="rounded-3xl border-2 border-yellow-400/50 bg-black/80 p-6 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-yellow-400/20">
              <h3 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
                <FaShieldAlt className="text-yellow-400" /> Log Group Head's Own Contribution Proof
              </h3>
              <span className="text-xs text-yellow-200/60">Amount: {fmt(group.contributionAmount)}</span>
            </div>
            <p className="text-xs text-yellow-200/70">
              Attach your receipt proof so all group members can confirm you deposited your share into the pot.
            </p>

            <form onSubmit={handleHeadSelfDeposit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">Transaction Ref / Session ID</label>
                  <input
                    type="text"
                    value={headRef}
                    onChange={(e) => setHeadRef(e.target.value)}
                    placeholder="e.g. 1000293019 or HEAD-DEPOSIT"
                    className="w-full px-4 py-3 rounded-xl bg-black/70 border border-yellow-400/40 text-yellow-200 font-mono text-sm focus:outline-none focus:border-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-yellow-300 uppercase mb-1">Attach Receipt Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeadReceiptChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/70 border border-yellow-400/40 text-yellow-200 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              {headReceiptImage && (
                <div className="p-2 border border-yellow-400/20 rounded-xl max-w-xs">
                  <img src={headReceiptImage} alt="Head Receipt" className="h-32 object-contain rounded-lg" />
                </div>
              )}

              <button
                type="submit"
                disabled={headSubmitting || !headRef.trim() || !headReceiptImage}
                className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-black text-xs hover:shadow-lg transition disabled:opacity-40"
              >
                {headSubmitting ? "Logging Proof..." : "Confirm & Post Proof to Circle"}
              </button>
            </form>
          </div>
        )}

        {/* ── GROUP HEAD VERIFICATION PANEL ── */}
        {isGroupHead && pendingDeposits.length > 0 && (
          <div className="rounded-3xl border-2 border-amber-500/50 bg-amber-950/20 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-amber-400 text-xl" />
              <h3 className="text-lg font-black text-amber-300">
                Pending Transfer Approvals ({pendingDeposits.length})
              </h3>
            </div>
            <p className="text-xs text-yellow-200/70">
              Review receipts and verify transfer proofs against your bank alerts before approving:
            </p>

            <div className="space-y-3">
              {pendingDeposits.map((dep) => (
                <div key={dep._id} className="p-4 rounded-2xl bg-black/60 border border-yellow-400/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-yellow-300 text-base">{fmt(dep.amount)}</span>
                      <span className="text-xs text-yellow-200/60">by {dep.userId?.fullname || dep.senderAccountName || "Member"}</span>
                    </div>
                    <p className="text-xs font-mono text-yellow-400 mt-1">Ref: {dep.transactionReference}</p>
                    <p className="text-[11px] text-yellow-200/40">Timestamp: {new Date(dep.timestamp).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {dep.receiptImage && (
                      <button
                        onClick={() => setPreviewReceipt(dep)}
                        className="px-3.5 py-2 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 text-yellow-300 font-bold text-xs transition flex items-center gap-1.5"
                      >
                        <FaEye /> View Receipt
                      </button>
                    )}

                    <button
                      onClick={() => handleVerifyDeposit(dep._id, "confirmed")}
                      disabled={actionLoading === dep._id}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <FaCheckCircle /> Confirm
                    </button>
                    <button
                      onClick={() => handleVerifyDeposit(dep._id, "rejected")}
                      disabled={actionLoading === dep._id}
                      className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <FaTimesCircle /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-3 border-b border-yellow-400/20 pb-3">
          <button
            onClick={() => setActiveTab("rotation")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "rotation" ? "bg-yellow-400 text-black" : "text-yellow-200/60 hover:text-yellow-300"}`}
          >
            🔄 Payout Rotation Schedule ({memberOrder.length})
          </button>
          <button
            onClick={() => setActiveTab("contributions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "contributions" ? "bg-yellow-400 text-black" : "text-yellow-200/60 hover:text-yellow-300"}`}
          >
            💰 Public Contributions Ledger ({allDeposits.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === "activity" ? "bg-yellow-400 text-black" : "text-yellow-200/60 hover:text-yellow-300"}`}
          >
            📜 Audit History
          </button>
        </div>

        {/* ── TAB 1: ROTATION CYCLE & PAYOUT ORDER (WITH REORDERING CONTROLS) ── */}
        {activeTab === "rotation" && (
          <div className="rounded-3xl border border-yellow-400/30 bg-black/50 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-black text-yellow-300">Rotational Cycle & Turns</h3>
                <p className="text-xs text-yellow-200/60">
                  Every {group.payoutDuration} days, one member receives the lump sum pot of <strong>{fmt(lumpSumPayout)}</strong>.
                </p>
              </div>

              {canReorder && hasOrderChanged && (
                <button
                  onClick={saveReorderedRotation}
                  disabled={reorderSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-xs hover:shadow-lg transition"
                >
                  {reorderSaving ? "Saving..." : "Save New Turn Order"}
                </button>
              )}
            </div>

            {/* Cycle Explanation Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-black/70 border border-yellow-400/20">
                <span className="text-[10px] text-yellow-200/50 uppercase font-bold">Turn Cycle</span>
                <p className="text-base font-bold text-yellow-300">{group.payoutDuration} Days per rotation</p>
                <p className="text-[11px] text-yellow-200/40 mt-0.5">{group.frequency} contributions</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/70 border border-yellow-400/20">
                <span className="text-[10px] text-yellow-200/50 uppercase font-bold">Total Pot Per Turn</span>
                <p className="text-base font-bold text-emerald-400">{fmt(lumpSumPayout)}</p>
                <p className="text-[11px] text-yellow-200/40 mt-0.5">({fmt(group.contributionAmount)} × {group.maxMembers} members)</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/70 border border-yellow-400/20">
                <span className="text-[10px] text-yellow-200/50 uppercase font-bold">Rotation Status</span>
                <p className="text-base font-bold text-yellow-300">
                  {canReorder ? "Reordering Open" : "Positions Locked"}
                </p>
                <p className="text-[11px] text-yellow-200/40 mt-0.5">
                  {canReorder ? "Head can adjust turns prior to first payout" : "Cycle has commenced"}
                </p>
              </div>
            </div>

            {/* Rotation Schedule List */}
            <div className="space-y-3">
              {memberOrder.map((m, idx) => {
                const turnNumber = idx + 1;
                const turnDate = new Date(new Date(group.startDate).getTime() + (idx * group.payoutDuration * 24 * 60 * 60 * 1000));
                const isCurrentUser = m._id === user?.id || m === user?.id;

                return (
                  <div 
                    key={m._id || idx} 
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                      isCurrentUser ? "bg-yellow-400/10 border-yellow-400" : "bg-black/60 border-yellow-400/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center font-black text-yellow-400 font-mono text-base flex-shrink-0">
                        #{turnNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-yellow-300 text-sm">
                            {m.fullname || m.username || "Member"} {isCurrentUser && "(You)"}
                          </p>
                          {group.groupHead?._id === m._id || group.groupHead === m._id ? (
                            <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-300 text-[10px] font-bold">Head</span>
                          ) : null}
                        </div>
                        <p className="text-xs text-yellow-200/60 mt-0.5">
                          Payout Date: <strong className="text-yellow-300">{turnDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong> • Receives <strong className="text-emerald-400 font-bold">{fmt(lumpSumPayout)}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Group Head Position Reordering Arrows */}
                    {canReorder ? (
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => moveMember(idx, -1)}
                          disabled={idx === 0}
                          className="p-2 rounded-xl bg-black/80 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 disabled:opacity-20 text-xs transition"
                          title="Move Turn Earlier"
                        >
                          <FaArrowUp />
                        </button>
                        <button
                          onClick={() => moveMember(idx, 1)}
                          disabled={idx === memberOrder.length - 1}
                          className="p-2 rounded-xl bg-black/80 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 disabled:opacity-20 text-xs transition"
                          title="Move Turn Later"
                        >
                          <FaArrowDown />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-yellow-200/40 font-mono self-end sm:self-center">
                        Position Locked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: TRANSPARENT PUBLIC CONTRIBUTIONS LEDGER ── */}
        {activeTab === "contributions" && (
          <div className="rounded-3xl border border-yellow-400/30 bg-black/50 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-yellow-300">Public Contributions Audit</h3>
                <p className="text-xs text-yellow-200/60">Every member can view all payments, receipts, session references, and confirmation states.</p>
              </div>
              <button
                onClick={() => navigate("/dashboard/contribute")}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-black font-black text-xs hover:shadow-lg transition"
              >
                + Contribute
              </button>
            </div>

            {allDeposits.length === 0 ? (
              <div className="text-center py-10 text-yellow-200/40 text-xs">No contributions logged yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-yellow-400/20 text-yellow-200/50 uppercase">
                      <th className="py-3 px-3">Member</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Session Ref</th>
                      <th className="py-3 px-3">Timestamp</th>
                      <th className="py-3 px-3 text-center">Receipt Proof</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-400/10">
                    {allDeposits.map((d) => (
                      <tr key={d._id} className="hover:bg-yellow-400/5 transition">
                        <td className="py-3 px-3 font-semibold text-yellow-300">
                          {d.userId?.fullname || d.senderAccountName || "Member"}
                        </td>
                        <td className="py-3 px-3 font-bold text-yellow-400">{fmt(d.amount)}</td>
                        <td className="py-3 px-3 font-mono text-yellow-200/70">{d.transactionReference}</td>
                        <td className="py-3 px-3 text-yellow-200/50">{new Date(d.timestamp).toLocaleString()}</td>
                        
                        <td className="py-3 px-3 text-center">
                          {d.receiptImage ? (
                            <button
                              onClick={() => setPreviewReceipt(d)}
                              className="px-2.5 py-1 rounded-lg bg-yellow-400/15 hover:bg-yellow-400/30 border border-yellow-400/30 text-yellow-300 font-bold text-[11px] inline-flex items-center gap-1.5 transition"
                            >
                              <FaEye /> View
                            </button>
                          ) : (
                            <span className="text-yellow-200/30 text-[11px]">No Receipt</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            d.status === "confirmed" 
                              ? "bg-emerald-950 border border-emerald-500 text-emerald-400" 
                              : d.status === "rejected"
                              ? "bg-red-950 border border-red-500 text-red-400"
                              : "bg-yellow-950 border border-yellow-500 text-yellow-400"
                          }`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: AUDIT TRAIL ── */}
        {activeTab === "activity" && (
          <div className="rounded-3xl border border-yellow-400/30 bg-black/50 p-6 space-y-3">
            <h3 className="text-lg font-black text-yellow-300 mb-2">Circle Activity History</h3>
            <div className="space-y-2">
              {group.activities?.map((act, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-black/60 border border-yellow-400/10 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-yellow-300">{act.title}</p>
                    <p className="text-yellow-200/60 text-[11px]">{act.description}</p>
                  </div>
                  <span className="text-[10px] text-yellow-200/40">{new Date(act.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── FULL SCREEN RECEIPT MODAL PREVIEW ── */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-yellow-400/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-yellow-400/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-yellow-300 text-sm">Payment Receipt Proof</h3>
                <p className="text-[11px] text-yellow-200/60">
                  {previewReceipt.userId?.fullname || previewReceipt.senderAccountName || "Member"} • {fmt(previewReceipt.amount)}
                </p>
              </div>
              <button
                onClick={() => setPreviewReceipt(null)}
                className="w-8 h-8 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 bg-black/90 flex items-center justify-center max-h-[60vh] overflow-y-auto">
              <img 
                src={previewReceipt.receiptImage} 
                alt="Payment Receipt" 
                className="max-h-[55vh] w-auto rounded-xl object-contain border border-yellow-400/30"
              />
            </div>

            <div className="p-4 bg-black/50 border-t border-yellow-400/20 font-mono text-[11px] text-yellow-200/70 space-y-1">
              <div className="flex justify-between">
                <span>Session Ref:</span>
                <span className="text-yellow-400 font-bold">{previewReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between">
                <span>Timestamp:</span>
                <span>{new Date(previewReceipt.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}