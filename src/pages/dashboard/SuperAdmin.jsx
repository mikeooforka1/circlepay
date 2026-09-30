import React, { useState, useEffect } from "react";
import { 
  FaShieldAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaUsers, 
  FaMoneyBillWave, 
  FaTrash, 
  FaTimes, 
  FaLock
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "";

function fmt(n) {
  return `₦${Number(n || 0).toLocaleString()}`;
}

export default function SuperAdmin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  // Preview Modal State
  const [previewGroup, setPreviewGroup] = useState(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Parallel streamlined fetch
      const [statsRes, pendingRes, groupsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/overview`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/pending-groups`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/all-groups`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/all-users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (statsRes.status === 403) {
        alert("Access Denied: You do not have Super Admin privileges.");
        handleAdminLogout();
        return;
      }

      const [statsData, pendingData, groupsData, usersData] = await Promise.all([
        statsRes.json(),
        pendingRes.json(),
        groupsRes.json(),
        usersRes.json()
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (pendingData.success) setPendingGroups(pendingData.pendingGroups);
      if (groupsData.success) setAllGroups(groupsData.groups);
      if (usersData.success) setAllUsers(usersData.users);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (logout) logout();
    navigate("/login", { replace: true });
  };

  // Instant on-demand receipt loader
  const handleOpenReceiptPreview = async (group) => {
    try {
      setReceiptLoading(true);
      setPreviewGroup(group);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/groups/${group._id}/receipt`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPreviewGroup(data.group);
      }
    } catch {
      alert("Failed to load receipt image");
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleConfirmGroup = async (groupId, action) => {
    try {
      setActionLoading(groupId);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/groups/${groupId}/confirm-creation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        setPreviewGroup(null);
        fetchAdminData();
      } else {
        alert(data.message || "Action failed");
      }
    } catch {
      alert("Network error processing request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm("⚠️ DAMAGE CONTROL: Are you sure you want to permanently shutdown and delete this group?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/groups/${groupId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Group permanently deleted.");
        fetchAdminData();
      }
    } catch {
      alert("Error deleting group");
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/toggle-admin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAdminData();
    } catch {
      alert("Error toggling admin status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("⚠️ DAMAGE CONTROL: Permanently ban and delete this user from CirclePay?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("User permanently removed.");
        fetchAdminData();
      }
    } catch {
      alert("Error deleting user");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24 sm:pt-28 pb-16 px-4 bg-gradient-to-b from-[#080a0f] via-black to-[#080a0f] text-yellow-400">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-yellow-400/20 pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <FaLock size={10} /> Master Administrator Suite
            </span>
            <span className="text-xs text-yellow-200/50">CirclePay Platform Headquarters</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-yellow-300">Executive Control Panel</h1>
        </div>

        {/* Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-black/60 border border-yellow-400/30 p-5 rounded-2xl">
            <span className="text-xs text-yellow-200/50 uppercase font-bold">Creation Revenue</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{fmt(stats?.totalCreationRevenue)}</p>
            <p className="text-[10px] text-yellow-200/40 mt-1">₦350 per head collected</p>
          </div>

          <div className="bg-black/60 border border-yellow-400/30 p-5 rounded-2xl">
            <span className="text-xs text-yellow-200/50 uppercase font-bold">Pending Groups</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{stats?.pendingGroupsCount || 0}</p>
            <p className="text-[10px] text-yellow-200/40 mt-1">Awaiting manual approval</p>
          </div>

          <div className="bg-black/60 border border-yellow-400/30 p-5 rounded-2xl">
            <span className="text-xs text-yellow-200/50 uppercase font-bold">Active Circles</span>
            <p className="text-2xl font-black text-yellow-300 mt-1">{stats?.activeGroupsCount || 0}</p>
            <p className="text-[10px] text-yellow-200/40 mt-1">Currently running</p>
          </div>

          <div className="bg-black/60 border border-yellow-400/30 p-5 rounded-2xl">
            <span className="text-xs text-yellow-200/50 uppercase font-bold">Total Platform Users</span>
            <p className="text-2xl font-black text-yellow-300 mt-1">{stats?.totalUsers || 0}</p>
            <p className="text-[10px] text-yellow-200/40 mt-1">Registered members</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 border-b border-yellow-400/20 pb-3">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "pending" ? "bg-yellow-400 text-black shadow-lg" : "text-yellow-200/60 hover:text-yellow-300"
            }`}
          >
            ⏳ Pending Approvals ({pendingGroups.length})
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "groups" ? "bg-yellow-400 text-black shadow-lg" : "text-yellow-200/60 hover:text-yellow-300"
            }`}
          >
            🌐 All Circles ({allGroups.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === "users" ? "bg-yellow-400 text-black shadow-lg" : "text-yellow-200/60 hover:text-yellow-300"
            }`}
          >
            👥 User Management ({allUsers.length})
          </button>
        </div>

        {/* Tab 1: Pending Approvals */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingGroups.length === 0 ? (
              <div className="text-center py-16 rounded-3xl border border-yellow-400/20 bg-black/40">
                <FaCheckCircle className="text-emerald-400 text-3xl mx-auto mb-2" />
                <p className="text-yellow-200/70 text-sm font-semibold">No pending group requests!</p>
                <p className="text-xs text-yellow-200/40 mt-1">All creation fees have been verified and activated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingGroups.map((g) => (
                  <div key={g._id} className="p-6 rounded-3xl border-2 border-amber-500/50 bg-black/70 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-yellow-300">{g.name || g.groupName}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                          Fee: {fmt(g.creationFeePaid)}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-200/70">
                        Group Head: <strong className="text-yellow-300">{g.groupHead?.fullname || "Head"}</strong> ({g.groupHead?.email})
                      </p>
                      <p className="text-xs font-mono text-yellow-400 mt-1">
                        Bank Session Ref: {g.creationTransactionRef}
                      </p>
                      <p className="text-[11px] text-yellow-200/40">
                        Capacity: {g.maxMembers} Members • Contribution: {fmt(g.contributionAmount)} ({g.frequency})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleOpenReceiptPreview(g)}
                        className="px-4 py-2 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/40 text-yellow-300 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <FaEye /> View Receipt
                      </button>
                      <button
                        onClick={() => handleConfirmGroup(g._id, 'approve')}
                        disabled={actionLoading === g._id}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs transition"
                      >
                        ✓ Confirm & Activate
                      </button>
                      <button
                        onClick={() => handleConfirmGroup(g._id, 'reject')}
                        disabled={actionLoading === g._id}
                        className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: All Circles */}
        {activeTab === "groups" && (
          <div className="rounded-3xl border border-yellow-400/30 bg-black/60 p-6 overflow-x-auto">
            <div className="mb-4">
              <h3 className="text-base font-bold text-yellow-300">Active and Completed Circles</h3>
              <p className="text-xs text-yellow-200/50">Emergency shutdown available for any circle with dispute.</p>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-yellow-400/20 text-yellow-200/50 uppercase">
                  <th className="py-3 px-3">Circle Name</th>
                  <th className="py-3 px-3">Invite Code</th>
                  <th className="py-3 px-3">Group Head</th>
                  <th className="py-3 px-3">Members</th>
                  <th className="py-3 px-3">Fee Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Shutdown / Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/10">
                {allGroups.map((g) => (
                  <tr key={g._id} className="hover:bg-yellow-400/5 transition">
                    <td className="py-3.5 px-3 font-bold text-yellow-300">{g.name || g.groupName}</td>
                    <td className="py-3.5 px-3 font-mono text-yellow-400">{g.groupCode || "PENDING"}</td>
                    <td className="py-3.5 px-3 text-yellow-200/80">{g.groupHead?.fullname || "Head"}</td>
                    <td className="py-3.5 px-3">{g.members?.length || 0}/{g.maxMembers}</td>
                    <td className="py-3.5 px-3 font-bold text-emerald-400">{fmt(g.creationFeePaid)}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        g.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' : 'bg-yellow-950 text-yellow-400 border border-yellow-500'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteGroup(g._id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900 transition text-[11px] font-bold inline-flex items-center gap-1"
                      >
                        <FaTrash size={11} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: All Users */}
        {activeTab === "users" && (
          <div className="rounded-3xl border border-yellow-400/30 bg-black/60 p-6 overflow-x-auto">
            <div className="mb-4">
              <h3 className="text-base font-bold text-yellow-300">Platform User Directory</h3>
              <p className="text-xs text-yellow-200/50">Manage roles, suspend bad actors, or inspect accounts.</p>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-yellow-400/20 text-yellow-200/50 uppercase">
                  <th className="py-3 px-3">Full Name</th>
                  <th className="py-3 px-3">Username</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3 text-right">Control Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/10">
                {allUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-yellow-400/5 transition">
                    <td className="py-3.5 px-3 font-bold text-yellow-300">{u.fullname}</td>
                    <td className="py-3.5 px-3 text-yellow-200/60">@{u.username}</td>
                    <td className="py-3.5 px-3 text-yellow-200/80">{u.email}</td>
                    <td className="py-3.5 px-3 text-yellow-200/60">{u.phone}</td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isAdmin ? 'bg-red-950 border border-red-500 text-red-400' : 'bg-black/60 border border-yellow-400/30 text-yellow-300'
                      }`}>
                        {u.isAdmin ? 'Super Admin' : 'Member'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleAdmin(u._id)}
                        className="px-2.5 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/20 text-[10px] font-bold transition"
                      >
                        {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900 transition text-[10px] font-bold inline-flex items-center gap-1"
                      >
                        <FaTrash size={10} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* On-Demand Receipt Preview Modal */}
      {previewGroup && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e121a] border border-yellow-400/50 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-yellow-400/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-yellow-300 text-sm">Creation Payment Receipt Proof</h3>
                <p className="text-[11px] text-yellow-200/60">
                  {previewGroup.name} • {fmt(previewGroup.creationFeePaid)} ({previewGroup.maxMembers} Members × ₦350)
                </p>
              </div>
              <button
                onClick={() => setPreviewGroup(null)}
                className="w-8 h-8 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 flex items-center justify-center transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-4 bg-black/90 flex items-center justify-center min-h-[220px] max-h-[55vh] overflow-y-auto">
              {receiptLoading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto mb-2" />
                  <p className="text-xs text-yellow-200/50">Fetching receipt photo...</p>
                </div>
              ) : previewGroup.creationReceiptImage ? (
                <img 
                  src={previewGroup.creationReceiptImage} 
                  alt="Payment Receipt" 
                  className="max-h-[50vh] w-auto rounded-xl object-contain border border-yellow-400/30"
                />
              ) : (
                <p className="text-xs text-yellow-200/50">No receipt photo attached.</p>
              )}
            </div>

            {/* Modal Verification Details */}
            <div className="p-5 bg-black/70 border-t border-yellow-400/20 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-yellow-200/80 bg-black/80 p-3 rounded-xl border border-yellow-400/20">
                <div>
                  <span className="text-[10px] text-yellow-200/50 uppercase block">Bank Reference / Session ID:</span>
                  <span className="text-yellow-400 font-bold text-sm">{previewGroup.creationTransactionRef}</span>
                </div>
                <div>
                  <span className="text-[10px] text-yellow-200/50 uppercase block">Submission Timestamp:</span>
                  <span className="text-emerald-400 font-bold text-xs">
                    {new Date(previewGroup.createdAt).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleConfirmGroup(previewGroup._id, 'approve')}
                  disabled={actionLoading === previewGroup._id}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  <FaCheckCircle /> Confirm Payment & Activate Circle
                </button>
                <button
                  onClick={() => handleConfirmGroup(previewGroup._id, 'reject')}
                  disabled={actionLoading === previewGroup._id}
                  className="px-5 py-3.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs transition"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}