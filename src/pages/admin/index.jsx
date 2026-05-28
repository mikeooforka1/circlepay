import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaWallet,
  FaCreditCard,
  FaChartLine,
  FaGifts,
  FaShieldAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaMoneyBillWave,
  FaUserClock,
  FaExclamationTriangle,
  FaDownload,
  FaFilter,
} from "react-icons/fa";
import TransactionsManager from "./Admintransactions";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    platformFees: 0,
    activeTransactions: 0,
    pendingKYC: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("ADMIN USERS RESPONSE:", data);

    if (res.ok) {
      setUsers(Array.isArray(data) ? data : data.users || []);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

const filteredUsers = Array.isArray(users)
  ? users.filter((user) => {
      const matchesSearch =
        user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || user.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
  : [];

  // SIDEBAR MENU
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: FaChartLine },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "transactions", label: "Transactions", icon: FaMoneyBillWave },
    { id: "deposits", label: "Deposits", icon: FaWallet },
    { id: "withdrawals", label: "Withdrawals", icon: FaCreditCard },
    { id: "kyc", label: "KYC Management", icon: FaShieldAlt },
    { id: "fees", label: "Fee Management", icon: FaGifts },
    { id: "reports", label: "Reports", icon: FaClipboardList },
    { id: "settings", label: "Settings", icon: FaCog },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-2xl overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h2 className="text-2xl font-black text-yellow-400">Circle</h2>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? "bg-yellow-500/20 text-yellow-400 border-l-4 border-yellow-400"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <FaSignOutAlt size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h1 className="text-3xl font-black text-gray-800">
            {menuItems.find((item) => item.id === activeTab)?.label ||
              "Dashboard"}
          </h1>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
              <FaBell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition">
              A
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-auto p-8">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">
                        Total Users
                      </p>
                      <p className="text-4xl font-black text-gray-900 mt-2">
                        {dashboardData.totalUsers}
                      </p>
                      <p className="text-xs text-green-500 mt-2">
                        ↑ 12% from last month
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUsers size={32} className="text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Total Deposits */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">
                        Total Deposits
                      </p>
                      <p className="text-4xl font-black text-gray-900 mt-2">
                        ₦{dashboardData.totalDeposits?.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-500 mt-2">
                        ↑ 8% from last month
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <FaWallet size={32} className="text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Platform Fees */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">
                        Platform Fees
                      </p>
                      <p className="text-4xl font-black text-gray-900 mt-2">
                        ₦{dashboardData.platformFees?.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-500 mt-2">
                        ↑ 5% from last month
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FaMoneyBillWave size={32} className="text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* Total Withdrawals */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">
                        Total Withdrawals
                      </p>
                      <p className="text-4xl font-black text-gray-900 mt-2">
                        ₦{dashboardData.totalWithdrawals?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        →  No change
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <FaCreditCard size={32} className="text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Pending KYC */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">
                        Pending KYC
                      </p>
                      <p className="text-4xl font-black text-gray-900 mt-2">
                        {dashboardData.pendingKYC}
                      </p>
                      <p className="text-xs text-red-500 mt-2">
                        Action required
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <FaUserClock size={32} className="text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Active Transactions */}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border-l-4 border-indigo-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-semibold">
                        Active Transactions
                      </p>
                      <p className="text-4xl font-black text-gray-900 mt-2">
                        {dashboardData.activeTransactions}
                      </p>
                      <p className="text-xs text-green-500 mt-2">
                        Processing now
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaClipboardList size={32} className="text-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    📊 Revenue Trend
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Connect to Chart.js or Recharts</p>
                  </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    👥 User Growth
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart placeholder - Connect to Chart.js or Recharts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[250px]">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <button className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold flex items-center gap-2">
                    <FaDownload /> Export
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          User Info
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Wallet Balance
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          KYC Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            Loading users...
                          </td>
                        </tr>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                                  {user.fullname?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">
                                    {user.fullname}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ID: {user._id?.slice(-6)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {user.email}
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-bold text-gray-900">
                                ₦{user.walletBalance?.toLocaleString() || 0}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  user.kycStatus === "verified"
                                    ? "bg-green-100 text-green-700"
                                    : user.kycStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {user.kycStatus || "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  user.status === "active"
                                    ? "bg-blue-100 text-blue-700"
                                    : user.status === "inactive"
                                    ? "bg-gray-100 text-gray-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {user.status || "Active"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition"
                                  title="View details"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="p-2 text-green-500 hover:bg-green-100 rounded-lg transition"
                                  title="Edit"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                                  title="Suspend/Delete"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TRANSACTIONS TAB */}
          {activeTab === "transactions" && (
            <TransactionsManager />
          )}

         {activeTab === "deposits" && (
  <div className="space-y-6">

    {/* Added Fees Section */}
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h3 className="text-2xl font-bold text-gray-800">
            Deposit Fees Management
          </h3>

          <p className="text-gray-500 mt-1">
            View all added fees attached to user deposits.
          </p>
        </div>

        <button
          onClick={() => window.location.href = "/admin/deposit-fees"}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-semibold transition shadow-md"
        >
          View Added Fees
        </button>

      </div>
    </div>

    {/* Deposit Transactions */}
    <TransactionsManager filterTypeDefault="deposit" />
  </div>
)}

          {/* WITHDRAWALS TAB */}
          {activeTab === "withdrawals" && (
            <TransactionsManager filterTypeDefault="withdraw" />
          )}

          {/* KYC TAB */}
          {activeTab === "kyc" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  🛡️ KYC Management
                </h3>
                <p className="text-gray-600">KYC management UI coming soon...</p>
              </div>
            </div>
          )}

          {/* FEES TAB */}
          {activeTab === "fees" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  💳 Fee Management
                </h3>
                <p className="text-gray-600">Fee management UI coming soon...</p>
              </div>
            </div>
          )}

          {/* REPORTS TAB */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  📈 Reports & Analytics
                </h3>
                <p className="text-gray-600">Reports UI coming soon...</p>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  ⚙️ Admin Settings
                </h3>
                <p className="text-gray-600">Settings UI coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}