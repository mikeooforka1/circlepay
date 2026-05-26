import React, { useEffect, useState } from "react";
import { FaCopy, FaUsers, FaMoneyBillWave, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaClock, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Format currency
function fmt(n) {
  return `₦${Number(n).toLocaleString()}`;
}

export default function GroupPage() {
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [contributions, setContributions] = useState(null);
  const [payoutSchedule, setPayoutSchedule] = useState(null);

  useEffect(() => {
    fetchGroup();
  }, []);

  // Fixed endpoint: use /my-group/first instead of /my-group
  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/groups/my-group/first`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGroup(data.group);
        if (activeTab === "contributions") {
          fetchContributions(data.group._id);
        }
        if (activeTab === "payout-schedule") {
          fetchPayoutSchedule(data.group._id);
        }
      } else {
        console.error(data.message || "Failed to fetch group");
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
      if (res.ok && data.success) {
        setPayoutSchedule(data);
      }
    } catch (err) {
      console.error("Fetch payout schedule error:", err);
    }
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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10141a] to-[#1e293b]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400/30 border-t-yellow-400 mx-auto mb-4"></div>
          <p className="text-yellow-200/70">Loading group details...</p>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10141a] to-[#1e293b] p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-2">No Groups Yet</h2>
          <p className="text-yellow-200/70 mb-6">
            You haven't joined any Ajo groups yet. Join one to start saving with a community!
          </p>
          <button
            onClick={() => navigate("/join-group")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold hover:shadow-lg transition"
          >
            Join a Group
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-10 px-4 bg-gradient-to-br from-[#10141a] via-[#0f1419] to-[#1a1f2e]">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-300/70 hover:text-yellow-300 transition mb-8 text-sm font-semibold"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Header Card */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-500/5 to-orange-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-yellow-900/20 via-black/40 to-yellow-900/10 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-yellow-300 mb-3">
                  {group.groupName}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-yellow-200/70">
                    <FaUsers className="text-yellow-400" />
                    <span>{group.members?.length || 0}/{group.maxMembers} Members</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-200/70">
                    <FaMoneyBillWave className="text-yellow-400" />
                    <span>{fmt(group.contributionAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-200/70">
                    <FaClock className="text-yellow-400" />
                    <span>{group.payoutDuration} Days</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-200/70">
                    <FaCalendarAlt className="text-yellow-400" />
                    <span>{group.frequency}</span>
                  </div>
                </div>
              </div>

              {/* Group Code Box */}
              <div className="bg-black/40 border border-yellow-400/30 rounded-2xl p-6 min-w-fit">
                <p className="text-yellow-200/60 text-sm mb-2">Group Code</p>
                <div className="flex items-center gap-3">
                  <code className="text-2xl font-black text-yellow-400 tracking-widest">
                    {group.groupCode}
                  </code>
                  <button
                    onClick={copyCode}
                    className="p-2 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 transition"
                    title="Copy code"
                  >
                    <FaCopy size={18} />
                  </button>
                </div>
                {copied && <p className="text-green-400 text-xs mt-2">✓ Copied!</p>}
                <p className="text-yellow-200/60 text-xs mt-2">
                  Share with friends to invite them
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-yellow-400/20">
          {["overview", "contributions", "payout-schedule", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "contributions") fetchContributions(group._id);
                if (tab === "payout-schedule") fetchPayoutSchedule(group._id);
              }}
              className={`px-6 py-3 font-semibold transition border-b-2 ${
                activeTab === tab
                  ? "border-yellow-400 text-yellow-300"
                  : "border-transparent text-yellow-200/60 hover:text-yellow-300"
              }`}
            >
              {tab === "overview" && "📊 Overview"}
              {tab === "contributions" && "💰 Contributions"}
              {tab === "payout-schedule" && "📅 Payout Schedule"}
              {tab === "activity" && "📜 Activity"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-yellow-400/20 bg-black/40 p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-300 mb-6">Group Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Group Status */}
                  <div className="bg-yellow-900/20 border border-yellow-400/20 rounded-xl p-6">
                    <h3 className="text-yellow-300 font-bold mb-4 flex items-center gap-2">
                      <FaCheckCircle /> Group Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-yellow-200/60">Status</span>
                        <span className="text-yellow-300 font-semibold capitalize">
                          {group.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-200/60">Frequency</span>
                        <span className="text-yellow-300 font-semibold">
                          {group.frequency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-200/60">Contribution</span>
                        <span className="text-yellow-300 font-semibold">
                          {fmt(group.contributionAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-200/60">Cycle Duration</span>
                        <span className="text-yellow-300 font-semibold">
                          {group.payoutDuration} days
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="bg-yellow-900/20 border border-yellow-400/20 rounded-xl p-6">
                    <h3 className="text-yellow-300 font-bold mb-4 flex items-center gap-2">
                      <FaUsers /> Members ({group.members?.length || 0}/{group.maxMembers})
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {group.members && group.members.length > 0 ? (
                        group.members.map((member, idx) => (
                          <div key={idx} className="text-yellow-300 text-sm p-2 rounded bg-black/30">
                            {member.fullname || member.username}
                          </div>
                        ))
                      ) : (
                        <p className="text-yellow-200/60 text-sm">No members yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Next Payout */}
                  <div className="bg-gradient-to-br from-green-900/30 to-black/40 border border-green-400/20 rounded-xl p-6">
                    <h3 className="text-green-300 font-bold mb-4 flex items-center gap-2">
                      <FaClock /> Next Payout
                    </h3>
                    {group.nextPayoutMemberId ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-yellow-200/60 text-sm mb-1">Recipient</p>
                          <p className="text-green-300 font-semibold text-lg">
                            {group.nextPayoutMemberId.fullname ||
                              group.nextPayoutMemberId.username}
                          </p>
                        </div>
                        <div>
                          <p className="text-yellow-200/60 text-sm mb-1">Payout Date</p>
                          <p className="text-green-300 font-semibold">
                            {group.nextPayoutDate
                              ? new Date(group.nextPayoutDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "TBD"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-yellow-200/60 text-sm">No payout scheduled yet</p>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="bg-yellow-900/20 border border-yellow-400/20 rounded-xl p-6">
                    <h3 className="text-yellow-300 font-bold mb-4">Dates</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-yellow-200/60 text-sm mb-1">Created</p>
                        <p className="text-yellow-300 font-semibold">
                          {group.startDate
                            ? new Date(group.startDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-yellow-200/60 text-sm mb-1">Next Payout</p>
                        <p className="text-yellow-300 font-semibold">
                          {group.nextPayoutDate
                            ? new Date(group.nextPayoutDate).toLocaleDateString()
                            : "TBD"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contributions Tab */}
          {activeTab === "contributions" && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3">
                <FaMoneyBillWave className="text-yellow-400" />
                Contributions
              </h2>

              {contributions ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-yellow-900/20 border border-yellow-400/20 rounded-xl p-4">
                      <p className="text-yellow-200/60 text-sm mb-2">Total Contributions</p>
                      <p className="text-3xl font-black text-yellow-400">
                        {contributions.totalContributions}
                      </p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-400/20 rounded-xl p-4">
                      <p className="text-yellow-200/60 text-sm mb-2">Total Amount</p>
                      <p className="text-3xl font-black text-yellow-400">
                        {fmt(contributions.totalAmount)}
                      </p>
                    </div>
                    <div className="bg-yellow-900/20 border border-yellow-400/20 rounded-xl p-4">
                      <p className="text-yellow-200/60 text-sm mb-2">Average</p>
                      <p className="text-3xl font-black text-yellow-400">
                        {fmt(contributions.averageContribution)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/40 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <h3 className="text-yellow-300 font-bold mb-3">By Member</h3>
                    <div className="space-y-2">
                      {Object.entries(contributions.contributionsByMember).map(
                        ([memberId, stats]) => (
                          <div
                            key={memberId}
                            className="flex items-center justify-between p-3 rounded-lg bg-yellow-900/10 hover:bg-yellow-900/20 transition"
                          >
                            <div>
                              <p className="text-yellow-300 font-semibold text-sm">
                                {stats.fullname}
                              </p>
                              <p className="text-yellow-200/50 text-xs">
                                {stats.count} contribution(s)
                              </p>
                            </div>
                            <p className="text-yellow-400 font-bold">
                              {fmt(stats.total)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-yellow-200/70 text-center py-8">
                  Loading contributions...
                </p>
              )}
            </div>
          )}

          {/* Payout Schedule Tab */}
          {activeTab === "payout-schedule" && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3">
                <FaCalendarAlt className="text-yellow-400" />
                Payout Schedule
              </h2>

              {payoutSchedule ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {payoutSchedule.payoutSchedule?.map((schedule, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border transition ${
                        schedule.status === "completed"
                          ? "bg-green-900/10 border-green-400/20"
                          : "bg-yellow-900/10 border-yellow-400/20"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-yellow-300 font-semibold">
                            {schedule.recipientId?.fullname || "Loading..."}
                          </p>
                          <p className="text-yellow-200/60 text-xs">
                            Payout Date:{" "}
                            {new Date(schedule.payoutDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            schedule.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {schedule.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-3 bg-black/30 rounded-lg">
                        <div>
                          <p className="text-yellow-200/60 text-xs mb-1">
                            Current Amount
                          </p>
                          <p className="text-yellow-300 font-bold">
                            {fmt(schedule.totalAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-yellow-200/60 text-xs mb-1">
                            Expected Amount
                          </p>
                          <p className="text-green-400 font-bold">
                            {fmt(schedule.expectedPayoutAmount || 0)}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-yellow-200/60 text-xs">Progress</p>
                          <p className="text-yellow-300 text-xs font-semibold">
                            {schedule.expectedPayoutAmount > 0
                              ? Math.round(
                                  (schedule.totalAmount /
                                    schedule.expectedPayoutAmount) *
                                    100
                                )
                              : 0}
                            %
                          </p>
                        </div>
                        <div className="w-full bg-black/60 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              schedule.status === "completed"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                            style={{
                              width: `${
                                schedule.expectedPayoutAmount > 0
                                  ? Math.min(
                                      (schedule.totalAmount /
                                        schedule.expectedPayoutAmount) *
                                        100,
                                      100
                                    )
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-yellow-200/70 text-center py-8">
                  Loading payout schedule...
                </p>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <div>
              <h2 className="text-2xl font-bold text-yellow-300 mb-6 flex items-center gap-3">
                <FaHistory className="text-yellow-400" />
                Group Activity
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {group.activities && group.activities.length > 0 ? (
                  group.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-yellow-900/10 border border-yellow-400/20 hover:bg-yellow-900/20 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-yellow-300 font-semibold">
                            {activity.title}
                          </p>
                          <p className="text-yellow-200/70 text-sm mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <p className="text-yellow-200/50 text-xs whitespace-nowrap">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-yellow-200/70 text-center py-8">
                    No activities yet
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}