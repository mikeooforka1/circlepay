import React, { useState, useEffect } from "react";
import {
  FaCoins,
  FaChartLine,
  FaArrowUp,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function DepositFees() {
  const [fees, setFees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [channel, setChannel] = useState("fixed_account_fee");

  useEffect(() => {
    fetchDepositFees();
  }, [currentPage, channel]);

  const fetchDepositFees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("page", currentPage);
      params.append("limit", 15);
      params.append("channel", channel);

      const res = await fetch(
        `${API_URL}/api/admin/fees/deposits?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    let data = {};

try {
  data = await res.json();
} catch (err) {
  console.error("Invalid JSON response");
}

      if (res.ok) {
        setFees(data.deposits || []);
        setStats(data.stats || {});
        setTotalPages(data.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching deposit fees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFees = fees.filter(
    (fee) =>
      fee.userId?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChannelLabel = (channel) => {
    const labels = {
      fixed_account_fee: "Fixed Account",
      paystack_fee: "Paystack",
      flutterwave_fee: "Flutterwave",
    };
    return labels[channel] || channel;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Fees */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-300/70 text-sm font-semibold uppercase tracking-wider">
                Total Fees Collected
              </p>
              <p className="text-3xl font-black text-emerald-300 mt-2">
                ₦{stats?.totalFees?.toLocaleString() || "0"}
              </p>
              <p className="text-emerald-200/60 text-xs mt-1">
                Admin accumulation
              </p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <FaCoins className="text-emerald-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Average Fee */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-300/70 text-sm font-semibold uppercase tracking-wider">
                Average Fee
              </p>
              <p className="text-3xl font-black text-blue-300 mt-2">
                ₦{Math.round(stats?.avgFee || 0).toLocaleString()}
              </p>
              <p className="text-blue-200/60 text-xs mt-1">
                Per transaction
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <FaChartLine className="text-blue-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Min Fee */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-300/70 text-sm font-semibold uppercase tracking-wider">
                Min Fee
              </p>
              <p className="text-3xl font-black text-purple-300 mt-2">
                ₦{stats?.minFee?.toLocaleString() || "0"}
              </p>
              <p className="text-purple-200/60 text-xs mt-1">
                Lowest amount
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <FaArrowUp className="text-purple-400 text-2xl" />
            </div>
          </div>
        </div>

        {/* Max Fee */}
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/50 transition">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-orange-300/70 text-sm font-semibold uppercase tracking-wider">
                Max Fee
              </p>
              <p className="text-3xl font-black text-orange-300 mt-2">
                ₦{stats?.maxFee?.toLocaleString() || "0"}
              </p>
              <p className="text-orange-200/60 text-xs mt-1">
                Highest amount
              </p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <FaArrowUp className="text-orange-400 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user name, email, or reference..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none transition"
            />
          </div>

          {/* Channel Filter */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-3.5 text-gray-400 pointer-events-none" />
            <select
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none transition appearance-none bg-white"
            >
              <option value="fixed_account_fee">Fixed Account Fees</option>
              <option value="paystack_fee">Paystack Fees</option>
              <option value="flutterwave_fee">Flutterwave Fees</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Fee Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Source Deposit
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Reference
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin text-yellow-500" />
                      <span className="text-gray-600">Loading deposit fees...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredFees.length > 0 ? (
                filteredFees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                          {fee.userId?.fullname?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {fee.userId?.fullname || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {fee.userId?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Fee Amount */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-emerald-600">
                          ₦{fee.amount?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </td>

                    {/* Source Description */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {getChannelLabel(fee.channel)}
                      </span>
                    </td>

                    {/* Reference */}
                    <td className="px-6 py-4">
                      <p className="font-mono text-sm text-gray-600 truncate max-w-xs">
                        {fee.reference?.substring(0, 20)}...
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" size={14} />
                        {new Date(fee.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {fee.status || "Success"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaCoins className="text-2xl text-gray-300" />
                      <p className="text-lg font-semibold">No deposit fees found</p>
                      <p className="text-sm">
                        Deposit fees will appear here when users add funds
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg">
          <p className="text-gray-600 text-sm">
            Page <span className="font-bold">{currentPage}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentPage === page
                    ? "bg-yellow-500 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex gap-4">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">About Deposit Fees</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              All deposit fees collected from users are credited directly to the admin wallet.
              These fees represent the 10% charge applied to fixed account deposits and other payment channels.
              The admin can withdraw these fees anytime to a designated bank account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}