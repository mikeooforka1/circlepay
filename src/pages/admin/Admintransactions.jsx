import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
  FaHourglass,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaDownload,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function TransactionsManager({ filterTypeDefault = "all" }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState(filterTypeDefault);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterStatus]);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filterType !== "all") params.append("type", filterType);
      if (filterStatus !== "all") params.append("status", filterStatus);

      const res = await fetch(`${API_URL}/api/admin/transactions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (txId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/transactions/${txId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchTransactions();
        alert(`Transaction ${newStatus} successfully`);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const getTransactionIcon = (type) => {
    return type === "deposit" ? (
      <FaArrowDown className="text-green-500" />
    ) : type === "withdraw" ? (
      <FaArrowUp className="text-red-500" />
    ) : (
      <FaArrowRight className="text-blue-500" />
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.userId?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className={`grid ${filterTypeDefault === "all" ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"} gap-4`}>
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by user or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none"
            />
          </div>
          {filterTypeDefault === "all" && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdraw">Withdrawals</option>
              <option value="transfer">Transfers</option>
              <option value="fee">Fees</option>
            </select>
          )}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(tx.type)}
                        <span className="font-semibold capitalize">
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {tx.userId?.fullname || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.userId?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        ₦{tx.amount?.toLocaleString() || 0}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-600">
                        {tx.reference?.slice(-8)}...
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                          tx.status
                        )}`}
                      >
                        {tx.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateTransactionStatus(tx._id, "success")
                              }
                              className="p-2 text-green-500 hover:bg-green-100 rounded-lg transition"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() =>
                                updateTransactionStatus(tx._id, "failed")
                              }
                              className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition"
                          title="View details"
                        >
                          ℹ️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Transaction Details
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-gray-900">{selectedTx._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold capitalize">
                  {selectedTx.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold">
                  ₦{selectedTx.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedTx.status)}`}>
                  {selectedTx.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>
                  {new Date(selectedTx.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}