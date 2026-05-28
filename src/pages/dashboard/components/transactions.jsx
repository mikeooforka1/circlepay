import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  FaDownload,
  FaShare,
  FaEye,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function formatDate(date) {
  return new Date(date).toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

const typeIcons = {
  deposit: "💰",
  withdraw: "💸",
  transfer: "🔄",
  investment: "📈",
  airtime: "📱",
  data: "📡",
  bill: "💡",
  ajo_contribution: "👥",
  fee: "💳",
};

const typeColors = {
  deposit: "bg-green-100 text-green-700",
  withdraw: "bg-red-100 text-red-700",
  transfer: "bg-blue-100 text-blue-700",
  investment: "bg-purple-100 text-purple-700",
  airtime: "bg-cyan-100 text-cyan-700",
  data: "bg-indigo-100 text-indigo-700",
  bill: "bg-yellow-100 text-yellow-700",
  ajo_contribution: "bg-pink-100 text-pink-700",
  fee: "bg-orange-100 text-orange-700",
  default: "bg-gray-100 text-gray-700",
};

const statusConfig = {
  success: { icon: FaCheckCircle, color: "bg-green-100 text-green-700", label: "Success" },
  pending: { icon: FaClock, color: "bg-yellow-100 text-yellow-700", label: "Pending" },
  failed: { icon: FaTimesCircle, color: "bg-red-100 text-red-700", label: "Failed" },
  reversed: { icon: FaTimesCircle, color: "bg-red-100 text-red-700", label: "Reversed" },
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [receiptImg, setReceiptImg] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const hiddenReceiptRef = useRef();

  // ═══════════════════════════════════════════════════════════════════════════
  // FETCH TRANSACTIONS WITH PROPER API INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════════
  const fetchTransactions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      // Build query string with filters
      const params = new URLSearchParams();
      params.append("page", pageNum);
      params.append("limit", 15);
      if (filterType !== "all") params.append("type", filterType);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const res = await fetch(`${API_URL}/api/transactions/my?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok && data.transactions) {
        setTransactions(data.transactions);
        setTotalPages(data.pagination?.pages || 1);
        setPage(pageNum);
      } else {
        console.error("Failed to fetch transactions:", data.message);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Fetch transactions error:", error);
      setTransactions([]);
    }
    setLoading(false);
  };

  // Fetch on component mount and when filters change
  useEffect(() => {
    fetchTransactions(1);
  }, [filterType, filterStatus]);

  // Auto-refresh transactions every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions(page);
    }, 30000);
    return () => clearInterval(interval);
  }, [page, filterType, filterStatus]);

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFESSIONAL RECEIPT SHARING LOGIC
  // ═══════════════════════════════════════════════════════════════════════════

  // Share transaction as text
  const handleShareText = async (tx) => {
    try {
      const receipt = `CirclePay Transaction Receipt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transaction Type: ${(tx.type).toUpperCase()}
Amount: ${formatAmount(tx.amount)}
Reference: ${tx.reference || "N/A"}
Description: ${tx.description || "N/A"}
Date & Time: ${formatDate(tx.createdAt)}
Status: ${(tx.status).toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This receipt confirms your transaction on CirclePay.
For support, visit circlePay.com`;

      if (navigator.share) {
        await navigator.share({
          title: "CirclePay Receipt",
          text: receipt,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(receipt);
        alert("Receipt copied to clipboard!");
      }
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  // Share transaction as image
  const handleShareImage = async (tx) => {
    if (!hiddenReceiptRef.current) return;

    setShareLoading(true);
    try {
      const canvas = await html2canvas(hiddenReceiptRef.current, {
        backgroundColor: "#fff",
        scale: 2,
        logging: false,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setReceiptImg(dataUrl);
      setSelectedTx(tx);
      setShowImageModal(true);
    } catch (error) {
      console.error("Receipt generation error:", error);
      alert("Failed to generate receipt image");
    } finally {
      setShareLoading(false);
    }
  };

  // Download receipt image
  const handleDownload = () => {
    if (!receiptImg) return;
    const link = document.createElement("a");
    link.href = receiptImg;
    link.download = `CirclePay-Receipt-${selectedTx?.reference || "unknown"}.png`;
    link.click();
  };

  // Share receipt image (native share)
  const handleNativeShare = async () => {
    if (!navigator.canShare || !receiptImg) {
      alert("Image sharing is not supported on this device. You can download instead.");
      return;
    }

    try {
      setShareLoading(true);
      const response = await fetch(receiptImg);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `CirclePay-Receipt-${selectedTx?.reference || "unknown"}.png`,
        { type: "image/png" }
      );

      await navigator.share({
        files: [file],
        title: "CirclePay Receipt",
        text: `Transaction Receipt - ${selectedTx?.type}`,
      });
    } catch (error) {
      console.error("Share error:", error);
    } finally {
      setShareLoading(false);
    }
  };

  // Copy transaction reference to clipboard
  const handleCopyReference = (reference) => {
    if (!reference) return;
    navigator.clipboard.writeText(reference);
    alert("Reference copied to clipboard!");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-300 mb-2">
            Transaction History
          </h1>
          <p className="text-yellow-200/70">
            View and manage all your transactions in one place
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-lg border border-yellow-400/30 bg-black/40 p-4">
            <label className="text-yellow-300 text-sm font-semibold mb-2 block">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 rounded-lg bg-black border border-yellow-400/30 text-yellow-300 focus:outline-none focus:border-yellow-400 transition"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdraw">Withdrawals</option>
              <option value="transfer">Transfers</option>
              <option value="investment">Investments</option>
              <option value="ajo_contribution">Ajo Contributions</option>
              <option value="airtime">Airtime</option>
              <option value="data">Data</option>
              <option value="bill">Bills</option>
              <option value="fee">Fees</option>
            </select>
          </div>

          <div className="rounded-lg border border-yellow-400/30 bg-black/40 p-4">
            <label className="text-yellow-300 text-sm font-semibold mb-2 block">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 rounded-lg bg-black border border-yellow-400/30 text-yellow-300 focus:outline-none focus:border-yellow-400 transition"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="reversed">Reversed</option>
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="rounded-2xl border border-yellow-400/30 bg-black/40 p-12 text-center">
            <FaSpinner className="text-4xl text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-yellow-300">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="rounded-2xl border border-yellow-400/30 bg-black/40 p-12 text-center">
            <p className="text-yellow-300 text-lg">No transactions found</p>
            <p className="text-yellow-200/60 text-sm mt-2">
              {filterType !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Start making transactions to see them here"}
            </p>
          </div>
        ) : (
          <>
            {/* TRANSACTIONS TABLE */}
            <div className="rounded-2xl border border-yellow-400/30 bg-black/40 overflow-hidden shadow-xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max">
                  <thead className="bg-yellow-400/10 border-b border-yellow-400/30 sticky top-0">
                    <tr>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-yellow-300">Type</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-yellow-300">Amount</th>
                      <th className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-yellow-300">Desc</th>
                      <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-yellow-300">Ref</th>
                      <th className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-yellow-300">Date</th>
                      <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-yellow-300">Status</th>
                      <th className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-yellow-300 w-12 sticky right-0 bg-yellow-400/10">Act</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-yellow-400/20">
                    {transactions.map((tx) => {
                      const StatusIcon = statusConfig[tx.status]?.icon || FaClock;
                      return (
                        <tr
                          key={tx._id}
                          className="hover:bg-yellow-400/5 transition border-yellow-400/20"
                        >
                          {/* Type */}
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span className="text-lg sm:text-2xl flex-shrink-0">
                                {typeIcons[tx.type] || "📊"}
                              </span>
                              <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold hidden sm:inline-block ${typeColors[tx.type] || typeColors.default}`}>
                                {tx.type.replace(/_/g, " ").substring(0, 5).toUpperCase()}
                              </span>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-yellow-200 font-bold text-xs sm:text-base whitespace-nowrap">
                            {formatAmount(tx.amount)}
                          </td>

                          {/* Description - Hidden on small screens */}
                          <td className="hidden sm:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-yellow-300 text-xs sm:text-sm max-w-xs truncate">
                            {(tx.description || "N/A").substring(0, 20)}...
                          </td>

                          {/* Reference - Hidden on small/medium screens */}
                          <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-yellow-300 text-xs font-mono">
                            <button
                              onClick={() => handleCopyReference(tx.reference)}
                              className="hover:text-yellow-400 transition"
                              title="Click to copy"
                            >
                              {(tx.reference || "N/A").substring(0, 10)}...
                            </button>
                          </td>

                          {/* Date - Hidden on small/medium screens */}
                          <td className="hidden lg:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-yellow-300 text-xs sm:text-sm whitespace-nowrap">
                            {formatDate(tx.createdAt).substring(0, 12)}
                          </td>

                          {/* Status */}
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="flex items-center gap-1">
                              <StatusIcon className="text-sm sm:text-lg flex-shrink-0" />
                              <span className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-bold hidden sm:inline-block ${statusConfig[tx.status]?.color}`}>
                                {statusConfig[tx.status]?.label?.substring(0, 3) || tx.status}
                              </span>
                            </div>
                          </td>

                          {/* Actions - Sticky, always visible */}
                          <td className="px-2 sm:px-4 md:px-6 py-3 sm:py-4 sticky right-0 bg-black/40 z-10 text-center">
                            <button
                              className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition inline-flex items-center justify-center flex-shrink-0"
                              onClick={() => {
                                setSelectedTx(tx);
                                setShowModal(true);
                              }}
                              title="View details"
                            >
                              <FaEye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() => fetchTransactions(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400/20 transition"
                >
                  ← Previous
                </button>
                <span className="text-yellow-300 font-semibold">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => fetchTransactions(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400/20 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* DETAILS MODAL */}
        {showModal && selectedTx && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-400/30 p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-yellow-300 mb-6">
                {typeIcons[selectedTx.type]} Transaction Details
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-yellow-300/70">Type:</span>
                  <span className="text-yellow-300 font-semibold">
                    {selectedTx.type.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-300/70">Amount:</span>
                  <span className="text-yellow-300 font-bold text-lg">
                    {formatAmount(selectedTx.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-300/70">Description:</span>
                  <span className="text-yellow-300">{selectedTx.description || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-300/70">Reference:</span>
                  <span className="text-yellow-300 font-mono text-sm">{selectedTx.reference || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-300/70">Date:</span>
                  <span className="text-yellow-300">{formatDate(selectedTx.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-300/70">Status:</span>
                  <div className="flex items-center gap-2">
                    {React.createElement(statusConfig[selectedTx.status]?.icon || FaClock, {
                      className: "text-lg",
                    })}
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusConfig[selectedTx.status]?.color}`}>
                      {statusConfig[selectedTx.status]?.label || selectedTx.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShareText(selectedTx)}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <FaShare size={14} />
                  Text
                </button>
                <button
                  onClick={() => handleShareImage(selectedTx)}
                  disabled={shareLoading}
                  className="px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {shareLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaShare size={14} />}
                  Image
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="col-span-2 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMAGE PREVIEW MODAL */}
        {showImageModal && receiptImg && selectedTx && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
              {/* Receipt Image Preview - Scrollable */}
              <div className="p-3 sm:p-4 flex-shrink-0">
                <img
                  src={receiptImg}
                  alt="Receipt Preview"
                  className="w-full rounded-lg max-h-[50vh] object-contain"
                />
              </div>

              {/* Action Buttons - Sticky at bottom */}
              <div className="bg-gray-100 px-3 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 flex-shrink-0 border-t border-gray-200">
                <button
                  onClick={handleNativeShare}
                  disabled={shareLoading}
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                  {shareLoading ? <FaSpinner className="animate-spin" size={14} /> : <FaShare size={14} />}
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <FaDownload size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 transition font-semibold text-xs sm:text-sm whitespace-nowrap"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HIDDEN RECEIPT FOR IMAGE CAPTURE */}
        {selectedTx && (
          <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <div
              ref={hiddenReceiptRef}
              style={{
                width: "400px",
                background: "linear-gradient(135deg, #1a1a2e 0%, #ffd700 100%)",
                padding: "2rem",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {/* Receipt Header */}
             {/* Receipt Header */}
<div style={{ textAlign: "center", marginBottom: "2rem" }}>

  <div
    style={{
      width: "80px",
      height: "80px",
      margin: "0 auto 1rem",
      borderRadius: "20px",
      overflow: "hidden",
      background: "#fff",
      padding: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    }}
  >
    <img
      src="/assets/images/site-logo.png"
      alt="CirclePay Logo"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </div>

  <h3
    style={{
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#fff",
      marginBottom: "0.25rem",
    }}
  >
    CirclePay Receipt
  </h3>

  <p
    style={{
      fontSize: "0.875rem",
      color: "#ffe066",
    }}
  >
    {formatDate(selectedTx.createdAt)}
  </p>
</div>

              {/* Receipt Details */}
              <div style={{ color: "#fff", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "2px solid #ffd700" }}>
                  <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: "0.25rem" }}>
                    Transaction Type
                  </div>
                  <div>{selectedTx.type.replace(/_/g, " ").toUpperCase()}</div>
                </div>

                <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "2px solid #ffd700" }}>
                  <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: "0.25rem" }}>
                    Amount
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {formatAmount(selectedTx.amount)}
                  </div>
                </div>

                <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "2px solid #ffd700" }}>
                  <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: "0.25rem" }}>
                    Description
                  </div>
                  <div>{selectedTx.description || "N/A"}</div>
                </div>

                <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "2px solid #ffd700" }}>
                  <div style={{ color: "#ffd700", fontWeight: "bold", marginBottom: "0.25rem" }}>
                    Reference Number
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: "0.9rem", wordBreak: "break-all" }}>
                    {selectedTx.reference || "N/A"}
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: "2rem", paddingTop: "1rem", borderTop: "2px solid #ffd700" }}>
                  <div style={{ color: "#ffd700", fontWeight: "bold", fontSize: "1.1rem" }}>
                    Status: {selectedTx.status.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#ffe066", marginTop: "0.5rem" }}>
                    This receipt confirms your transaction on CirclePay
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}