import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function formatAmount(amount) {
  return `₦${Number(amount).toLocaleString()}`;
}

const typeColors = {
  deposit: "bg-green-100 text-green-700",
  withdraw: "bg-red-100 text-red-700",
  airtime: "bg-blue-100 text-blue-700",
  data: "bg-purple-100 text-purple-700",
  bill: "bg-yellow-100 text-yellow-700",
  "transfer-in": "bg-green-100 text-green-700",
  "transfer-out": "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-700",
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [receiptImg, setReceiptImg] = useState(null);
  const receiptRef = useRef();

  // Add a hidden receipt for image capture
  const hiddenReceiptRef = useRef();

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/transactions/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(res.ok && Array.isArray(data) ? data : []);
    } catch {
      setTransactions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
    // Poll for new transactions every 30 seconds instead of 10
    const interval = setInterval(fetchTransactions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Share transaction receipt
  const handleShare = (tx) => {
    const receipt = `
CirclePay Transaction Receipt

Type: ${tx.type}
Amount: ${formatAmount(tx.amount)}
Description: ${tx.description || "-"}
Reference: ${tx.reference || "-"}
Date: ${formatDate(tx.createdAt)}
Status: ${tx.status}
    `;
    if (navigator.share) {
      navigator
        .share({
          title: "CirclePay Transaction Receipt",
          text: receipt,
        })
        .catch(() => {});
    } else {
      // fallback: copy to clipboard
      navigator.clipboard.writeText(receipt);
      alert("Receipt copied to clipboard!");
    }
  };

  // Share as image (capture hidden receipt, not modal)
  const handleShareImage = async () => {
    if (!hiddenReceiptRef.current) return;
    const canvas = await html2canvas(hiddenReceiptRef.current, { backgroundColor: "#fff" });
    const dataUrl = canvas.toDataURL("image/png");
    setReceiptImg(dataUrl);
    setShowImageModal(true);
  };

  const handleDownload = () => {
    if (!receiptImg) return;
    const link = document.createElement("a");
    link.href = receiptImg;
    link.download = "CirclePay-Receipt.png";
    link.click();
  };

  const handleNativeShare = () => {
    if (navigator.canShare && receiptImg) {
      fetch(receiptImg)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "CirclePay-Receipt.png", { type: "image/png" });
          navigator.share({
            files: [file],
            title: "CirclePay Transaction Receipt",
            text: "Here is my CirclePay transaction receipt.",
          });
        });
    } else {
      alert("Sharing as image is not supported on this device. You can download the receipt.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">Transaction History</h2>
      {loading ? (
        <div className="text-center text-yellow-300 py-8">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-yellow-300 py-8">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow border border-yellow-400 bg-black">
          <table className="min-w-full divide-y divide-yellow-400">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-yellow-400">Type</th>
                <th className="px-4 py-2 text-left text-yellow-400">Amount</th>
                <th className="px-4 py-2 text-left text-yellow-400">Description</th>
                <th className="px-4 py-2 text-left text-yellow-400">Reference</th>
                <th className="px-4 py-2 text-left text-yellow-400">Date</th>
                <th className="px-4 py-2 text-left text-yellow-400">Status</th>
                <th className="px-4 py-2 text-yellow-400"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-yellow-900/20 transition">
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        typeColors[tx.type] || typeColors.default
                      }`}
                    >
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-bold text-yellow-200">
                    {formatAmount(tx.amount)}
                  </td>
                  <td className="px-4 py-2 text-yellow-300">
                    {tx.description ||
                      (tx.type === "deposit"
                        ? `Deposit from ${tx.sender || "N/A"}`
                        : tx.type === "transfer-in"
                        ? `Received from ${tx.sender || "N/A"}`
                        : tx.type === "transfer-out"
                        ? `Sent to ${tx.recipient || "N/A"}`
                        : tx.planName
                        ? `Plan: ${tx.planName}`
                        : "-")}
                  </td>
                  <td className="px-4 py-2 text-yellow-300">
                    <span className="break-all">{tx.reference || "-"}</span>
                  </td>
                  <td className="px-4 py-2 text-yellow-300">
                    {formatDate(tx.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.status === "success"
                          ? "bg-green-200 text-green-800"
                          : tx.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="px-3 py-1 rounded bg-yellow-400 text-black font-semibold text-xs shadow hover:bg-yellow-500 transition"
                      onClick={() => {
                        setSelectedTx(tx);
                        setShowModal(true);
                      }}
                    >
                      View
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-yellow-700 text-white font-semibold text-xs shadow hover:bg-yellow-800 transition"
                      onClick={() => {
                        setSelectedTx(tx);
                        setShowModal(true);
                        setTimeout(handleShareImage, 300); // open modal, then capture
                      }}
                    >
                      Share
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction Modal */}
      {showModal && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-yellow-50 rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-yellow-700 text-lg font-bold"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            {/* Receipt with black & gold background, NO gold outline */}
            <div
              ref={receiptRef}
              className="rounded-lg p-4 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #090b14 80%, #FFD700 100%)",
                color: "#FFD700",
              }}
            >
              <div className="flex flex-col items-center mb-4">
                <img src="/assets/images/site-logo.png" alt="CirclePay" className="w-14 h-14 mb-2" />
                <h3 className="text-lg font-bold mb-1" style={{ color: "#FFD700" }}>
                  CirclePay Transaction Receipt
                </h3>
                <span className="text-xs" style={{ color: "#ffe066" }}>
                  {formatDate(selectedTx.createdAt)}
                </span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Type:</strong> <span style={{ color: "#fff" }}>{selectedTx.type}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Amount:</strong> <span style={{ color: "#fff" }}>{formatAmount(selectedTx.amount)}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Description:</strong> <span style={{ color: "#fff" }}>{selectedTx.description || "-"}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Reference:</strong> <span className="break-all" style={{ color: "#fff" }}>{selectedTx.reference || "-"}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold align-middle ${
                    selectedTx.status === "success"
                      ? "bg-green-200 text-green-800"
                      : selectedTx.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                  style={{
                    color:
                      selectedTx.status === "success"
                        ? "#166534"
                        : selectedTx.status === "pending"
                        ? "#854d0e"
                        : "#991b1b",
                    background:
                      selectedTx.status === "success"
                        ? "#bbf7d0"
                        : selectedTx.status === "pending"
                        ? "#fef08a"
                        : "#fecaca",
                    marginLeft: "0.5rem",
                  }}
                >
                  {selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-yellow-700 text-white font-semibold text-xs shadow hover:bg-yellow-800 transition"
                onClick={handleShareImage}
              >
                Share as Image
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-yellow-800 font-semibold text-xs shadow hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && receiptImg && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-yellow-700 text-lg font-bold"
              onClick={() => setShowImageModal(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold text-yellow-700 mb-2">Share Receipt</h3>
            <div
              className="w-full flex justify-center mb-4"
              style={{
                background: "linear-gradient(135deg, #090b14 80%, #FFD700 100%)",
                borderRadius: "0.75rem",
                padding: "1.5rem 1rem",
                color: "#FFD700",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "350px",
              }}
            >
              <div className="flex flex-col items-center mb-4">
                <img src="/assets/images/site-logo.png" alt="CirclePay" className="w-14 h-14 mb-2" />
                <h3 className="text-lg font-bold mb-1" style={{ color: "#FFD700" }}>
                  CirclePay Transaction Receipt
                </h3>
                <span className="text-xs" style={{ color: "#ffe066" }}>
                  {formatDate(selectedTx.createdAt)}
                </span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Type:</strong> <span style={{ color: "#fff" }}>{selectedTx.type}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Amount:</strong> <span style={{ color: "#fff" }}>{formatAmount(selectedTx.amount)}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Description:</strong> <span style={{ color: "#fff" }}>{selectedTx.description || "-"}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700" }}>
                <strong>Reference:</strong> <span className="break-all" style={{ color: "#fff" }}>{selectedTx.reference || "-"}</span>
              </div>
              <div className="mb-2" style={{ color: "#FFD700", display: "flex", alignItems: "center" }}>
                <strong>Status:</strong>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold align-middle ${
                    selectedTx.status === "success"
                      ? "bg-green-200 text-green-800"
                      : selectedTx.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                  style={{
                    color:
                      selectedTx.status === "success"
                        ? "#166534"
                        : selectedTx.status === "pending"
                        ? "#854d0e"
                        : "#991b1b",
                    background:
                      selectedTx.status === "success"
                        ? "#bbf7d0"
                        : selectedTx.status === "pending"
                        ? "#fef08a"
                        : "#fecaca",
                    marginLeft: "0.5rem",
                  }}
                >
                  {selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 rounded bg-yellow-700 text-white font-semibold text-xs shadow hover:bg-yellow-800 transition"
                onClick={handleNativeShare}
              >
                Share
              </button>
              <button
                className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold text-xs shadow hover:bg-yellow-500 transition"
                onClick={handleDownload}
              >
                Download
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-yellow-800 font-semibold text-xs shadow hover:bg-gray-400 transition"
                onClick={() => setShowImageModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Receipt for Image Capture */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        {selectedTx && (
          <div
            ref={hiddenReceiptRef}
            className="rounded-lg p-4 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #090b14 80%, #FFD700 100%)",
              color: "#FFD700",
              width: 350,
              fontFamily: "inherit",
            }}
          >
            <div className="flex flex-col items-center mb-4">
              <img src="/assets/images/site-logo.png" alt="CirclePay" className="w-14 h-14 mb-2" />
              <h3 className="text-lg font-bold mb-1" style={{ color: "#FFD700" }}>
                CirclePay Transaction Receipt
              </h3>
              <span className="text-xs" style={{ color: "#ffe066" }}>
                {formatDate(selectedTx.createdAt)}
              </span>
            </div>
            <div className="mb-2" style={{ color: "#FFD700" }}>
              <strong>Type:</strong> <span style={{ color: "#fff" }}>{selectedTx.type}</span>
            </div>
            <div className="mb-2" style={{ color: "#FFD700" }}>
              <strong>Amount:</strong> <span style={{ color: "#fff" }}>{formatAmount(selectedTx.amount)}</span>
            </div>
            <div className="mb-2" style={{ color: "#FFD700" }}>
              <strong>Description:</strong> <span style={{ color: "#fff" }}>{selectedTx.description || "-"}</span>
            </div>
            <div className="mb-2" style={{ color: "#FFD700" }}>
              <strong>Reference:</strong> <span className="break-all" style={{ color: "#fff" }}>{selectedTx.reference || "-"}</span>
            </div>
            <div
              className="mb-2"
              style={{
                color: "#FFD700",
                display: "flex",
                alignItems: "center",
              }}
            >
              <strong>Status:</strong>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold align-middle ${
                  selectedTx.status === "success"
                    ? "bg-green-200 text-green-800"
                    : selectedTx.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
                style={{
                  color:
                    selectedTx.status === "success"
                      ? "#166534"
                      : selectedTx.status === "pending"
                      ? "#854d0e"
                      : "#991b1b",
                  background:
                    selectedTx.status === "success"
                      ? "#bbf7d0"
                      : selectedTx.status === "pending"
                      ? "#fef08a"
                      : "#fecaca",
                  marginLeft: "0.5rem",
                }}
              >
                {selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}