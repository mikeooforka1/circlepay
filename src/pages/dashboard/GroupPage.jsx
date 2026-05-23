import React, { useEffect, useState } from "react";
import { FaCopy, FaUsers, FaMoneyBillWave, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaClock, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function GroupPage() {
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // overview, contributions, payout-schedule
  const [contributions, setContributions] = useState(null);
  const [payoutSchedule, setPayoutSchedule] = useState(null);

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/my-group`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setGroup(data.group);
        if (activeTab === "contributions") {
          fetchContributions(data.group._id);
        }
        if (activeTab === "payout-schedule") {
          fetchPayoutSchedule(data.group._id);
        }
      }
    } catch (err) {
      console.error("Fetch group error:", err);
    }

    setLoading(false);
  };

  const fetchContributions = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/${groupId}/contributions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setContributions(data.stats);
      }
    } catch (err) {
      console.error("Fetch contributions error:", err);
    }
  };

  const fetchPayoutSchedule = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/${groupId}/payout-schedule`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setPayoutSchedule(data);
      }
    } catch (err) {
      console.error("Fetch payout schedule error:", err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "contributions" && !contributions) {
      fetchContributions(group._id);
    }
    if (tab === "payout-schedule" && !payoutSchedule) {
      fetchPayoutSchedule(group._id);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.groupCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400/30 border-t-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-200/70">Loading your group...</p>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-300 text-lg mb-4">You haven't joined any group yet</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold hover:scale-105 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 pt-24 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-300/70 hover:text-yellow-300 transition mb-8 text-sm font-semibold"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8 pb-8 border-b border-yellow-400/20">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
                <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase">
                  Active Group
                </p>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-4">
                {group?.groupName}
              </h1>

              <p className="text-yellow-200/70 text-sm md:text-base max-w-2xl leading-relaxed">
                Manage all ajo contributions, payouts, members, and activities. Track savings cycle efficiently and securely.
              </p>
            </div>
          </div>

          {/* Group Invite Code */}
          <div className="rounded-2xl bg-black/40 border border-yellow-400/30 p-6 backdrop-blur-sm max-w-lg">
            <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase mb-3">
              Group Invite Code
            </p>

            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black tracking-widest text-yellow-300 font-mono">
                {group?.groupCode}
              </h2>

              <button
                onClick={handleCopyCode}
                className="text-yellow-400/70 hover:text-yellow-300 transition p-2 hover:bg-yellow-400/10 rounded-lg"
                title="Copy group code"
              >
                <FaCopy size={20} />
              </button>
            </div>

            {copied && (
              <p className="text-green-400 text-sm mt-3 font-semibold flex items-center gap-2">
                ✓ Code copied to clipboard
              </p>
            )}

            <p className="text-yellow-200/60 text-xs mt-4">
              Share this code with friends to invite them to your group
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-10">
          {/* Members Count */}
          <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-blue-500/15 to-blue-900/10 p-6 shadow-lg backdrop-blur-sm hover:border-yellow-400/60 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase">
                Members
              </p>
              <FaUsers className="text-2xl text-blue-400/70" />
            </div>

            <h2 className="text-4xl font-black text-yellow-300">
              {group?.members?.length || 0}
            </h2>

            <p className="text-yellow-200/60 text-xs mt-3">
              Active members in group
            </p>
          </div>

          {/* Capacity */}
          <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-cyan-500/15 to-cyan-900/10 p-6 shadow-lg backdrop-blur-sm hover:border-yellow-400/60 transition">
            <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase mb-4">
              Capacity
            </p>

            <h2 className="text-3xl font-black text-yellow-300 mb-2">
              {group?.members?.length || 0}/{group?.maxMembers}
            </h2>

            <div className="w-full bg-black/40 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all"
                style={{
                  width: `${((group?.members?.length || 0) / (group?.maxMembers || 1)) * 100}%`,
                }}
              ></div>
            </div>

            <p className="text-yellow-200/60 text-xs mt-3">
              {(group?.maxMembers || 0) - (group?.members?.length || 0)} slots available
            </p>
          </div>

          {/* Contribution Amount */}
          <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-green-500/15 to-green-900/10 p-6 shadow-lg backdrop-blur-sm hover:border-yellow-400/60 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase">
                Contribution
              </p>
              <FaMoneyBillWave className="text-2xl text-green-400/70" />
            </div>

            <h2 className="text-3xl font-black text-yellow-300">
              ₦{group?.contributionAmount?.toLocaleString() || 0}
            </h2>

            <p className="text-yellow-200/60 text-xs mt-3">
              Per {group?.frequency?.toLowerCase() || 'cycle'}
            </p>
          </div>

          {/* Payout Cycle */}
          <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-orange-500/15 to-orange-900/10 p-6 shadow-lg backdrop-blur-sm hover:border-yellow-400/60 transition">
            <div className="flex items-center justify-between mb-4">
              <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase">
                Cycle Duration
              </p>
              <FaCalendarAlt className="text-2xl text-orange-400/70" />
            </div>

            <h2 className="text-3xl font-black text-yellow-300">
              {group?.payoutDuration} Days
            </h2>

            <p className="text-yellow-200/60 text-xs mt-3">
              Between each payout
            </p>
          </div>

          {/* Next Payout */}
          <div className="rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-pink-500/15 to-pink-900/10 p-6 shadow-lg backdrop-blur-sm hover:border-yellow-400/60 transition">
            <p className="text-yellow-300/70 text-xs font-semibold tracking-wider uppercase mb-4">
              Next Payout Date
            </p>

            <h2 className="text-xl font-black text-yellow-300">
              {group?.nextPayoutDate ? formatDate(group.nextPayoutDate) : "Coming Soon"}
            </h2>

            <p className="text-yellow-200/60 text-xs mt-3">
              Scheduled payout
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-yellow-400/30">
          <div className="flex gap-8">
            <button
              onClick={() => handleTabChange("overview")}
              className={`py-4 font-semibold text-sm transition border-b-2 ${
                activeTab === "overview"
                  ? "text-yellow-300 border-yellow-400"
                  : "text-yellow-300/60 border-transparent hover:text-yellow-300"
              }`}
            >
              <FaUsers className="inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => handleTabChange("contributions")}
              className={`py-4 font-semibold text-sm transition border-b-2 ${
                activeTab === "contributions"
                  ? "text-yellow-300 border-yellow-400"
                  : "text-yellow-300/60 border-transparent hover:text-yellow-300"
              }`}
            >
              <FaHistory className="inline mr-2" />
              Contributions
            </button>
            <button
              onClick={() => handleTabChange("payout-schedule")}
              className={`py-4 font-semibold text-sm transition border-b-2 ${
                activeTab === "payout-schedule"
                  ? "text-yellow-300 border-yellow-400"
                  : "text-yellow-300/60 border-transparent hover:text-yellow-300"
              }`}
            >
              <FaCalendarAlt className="inline mr-2" />
              Payout Schedule
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Group Members */}
            <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5 p-8 shadow-lg backdrop-blur-sm mb-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  👥 Group Members
                </h2>
                <p className="text-yellow-200/60 text-sm">
                  {group?.members?.length || 0} member{(group?.members?.length || 0) !== 1 ? 's' : ''} in this group
                </p>
              </div>

              {group?.members && group.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member, index) => (
                    <div
                      key={member._id}
                      className="rounded-2xl border border-yellow-400/30 bg-black/40 hover:bg-black/60 backdrop-blur-sm p-5 transition duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-black flex items-center justify-center font-bold text-xl shadow-lg">
                            {(member.fullname || member.username)?.charAt(0)?.toUpperCase()}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-yellow-300">
                              {member.fullname || member.username}
                            </h3>

                            <p className="text-yellow-300/60 text-xs font-semibold">
                              Member #{index + 1}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-yellow-400/20">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            group.owner._id === member._id
                              ? "bg-yellow-500/30 text-yellow-300"
                              : "bg-yellow-900/30 text-yellow-200/70"
                          }`}
                        >
                          {group.owner._id === member._id ? "👤 Admin" : "✓ Member"}
                        </span>
                        <span className="text-yellow-200/50 text-xs">
                          Joined • {Math.floor(Math.random() * 30) + 1}d ago
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-yellow-400/30 bg-black/40 p-8 text-center">
                  <p className="text-yellow-200/60">No members yet.</p>
                </div>
              )}
            </div>

            {/* Group Activities */}
            <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5 p-8 shadow-lg backdrop-blur-sm">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                  📋 Group Activities
                </h2>
                <p className="text-yellow-200/60 text-sm">
                  Recent activity and updates in your group
                </p>
              </div>

              {group?.activities && group.activities.length > 0 ? (
                <div className="space-y-3">
                  {group.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-yellow-400/30 bg-black/40 hover:bg-black/60 backdrop-blur-sm p-5 transition duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {activity.activityType === "contribution_made" && (
                              <FaCheckCircle className="text-green-400" size={14} />
                            )}
                            {activity.activityType === "payout_completed" && (
                              <FaMoneyBillWave className="text-yellow-400" size={14} />
                            )}
                            {activity.activityType === "member_joined" && (
                              <FaUsers className="text-blue-400" size={14} />
                            )}
                            <h3 className="font-bold text-yellow-300 text-base">
                              {activity.title}
                            </h3>
                          </div>

                          <p className="text-yellow-200/70 text-sm mt-2">
                            {activity.description}
                          </p>

                          {activity.metadata?.amount && (
                            <p className="text-yellow-300/80 text-xs font-semibold mt-2">
                              Amount: ₦{activity.metadata.amount.toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-yellow-300/70 text-xs font-semibold">
                            {formatDate(activity.date)}
                          </p>
                          <p className="text-yellow-300/50 text-xs">
                            {formatTime(activity.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-yellow-400/30 bg-black/40 p-8 text-center">
                  <p className="text-yellow-200/60">No activities yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Contributions Tab */}
        {activeTab === "contributions" && (
          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5 p-8 shadow-lg backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">
                💰 Contribution History
              </h2>

              {contributions ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                      <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                        Total Contributions
                      </p>
                      <p className="text-2xl font-black text-yellow-300">
                        {contributions.totalContributions}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                      <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                        Total Amount
                      </p>
                      <p className="text-2xl font-black text-yellow-300">
                        ₦{contributions.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/40 border border-yellow-400/30 p-4">
                      <p className="text-yellow-300/70 text-xs font-semibold uppercase mb-2">
                        Contributors
                      </p>
                      <p className="text-2xl font-black text-yellow-300">
                        {Object.keys(contributions.contributionsByMember).length}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {contributions.recentContributions.map((contrib, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-yellow-400/30 bg-black/40 p-5 flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-bold text-yellow-300">
                            {contrib.userId?.fullname || "Unknown"}
                          </h3>
                          <p className="text-yellow-200/60 text-xs">
                            {formatDate(contrib.contributedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-yellow-300">
                            ₦{contrib.amount.toLocaleString()}
                          </p>
                          <span className="text-xs text-green-400 font-semibold">
                            ✓ Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-yellow-200/60">Loading contributions...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payout Schedule Tab */}
        {activeTab === "payout-schedule" && (
          <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5 p-8 shadow-lg backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                📅 Payout Schedule
              </h2>
              <p className="text-yellow-200/60 text-sm">
                When each member receives their payout
              </p>
            </div>

            {payoutSchedule?.payoutSchedule ? (
              <div className="space-y-4">
                {payoutSchedule.payoutSchedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-yellow-400/30 bg-black/40 p-6 hover:bg-black/60 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-black flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-yellow-300">
                              {schedule.recipientId?.fullname || "Loading..."}
                            </h3>
                            <p className="text-yellow-200/60 text-xs">
                              Cycle #{schedule.cycleNumber}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-yellow-300/70 text-xs font-semibold mb-1">
                              Payout Date
                            </p>
                            <p className="text-yellow-300 font-bold">
                              {formatDate(schedule.payoutDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-yellow-300/70 text-xs font-semibold mb-1">
                              Total Amount
                            </p>
                            <p className="text-yellow-300 font-bold">
                              ₦{(schedule.totalAmount || group.contributionAmount * group.members.length).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                            schedule.status === "completed"
                              ? "bg-green-500/30 text-green-300"
                              : "bg-yellow-900/30 text-yellow-200"
                          }`}
                        >
                          {schedule.status === "completed" ? (
                            <>
                              <FaCheckCircle size={12} /> Completed
                            </>
                          ) : (
                            <>
                              <FaClock size={12} /> Pending
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-yellow-200/60">Loading payout schedule...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}