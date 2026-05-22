import React, { useEffect, useState } from "react";
import { FaCopy, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function GroupPage() {

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      }

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.groupCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-yellow-400 flex items-center justify-center">
        Loading Group...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-yellow-400 pt-28 pb-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="rounded-3xl border border-yellow-400 bg-gradient-to-br from-yellow-700/20 via-black to-yellow-900/30 p-8 shadow-2xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <h1 className="text-4xl font-extrabold">
                {group.groupName}
              </h1>

              <p className="mt-3 text-yellow-200 max-w-xl">
                Track all ajo contributions, payouts, members,
                and activities in your CirclePay group.
              </p>

            </div>

            <div className="bg-black border border-yellow-500 rounded-2xl p-5">

              <p className="text-yellow-300 text-sm">
                Group Invite Code
              </p>

              <div className="flex items-center gap-3 mt-2">

                <h2 className="text-3xl font-bold tracking-widest">
                  {group.groupCode}
                </h2>

                <button
                  onClick={handleCopyCode}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <FaCopy size={20} />
                </button>

              </div>

              {copied && (
                <p className="text-green-400 text-sm mt-2">
                  Group code copied
                </p>
              )}

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mt-8">

          {/* MEMBERS */}
          <div className="rounded-2xl border border-yellow-400 bg-black p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-yellow-300 text-sm">
                  Members
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {group.members?.length || 0}
                </h2>
              </div>

              <FaUsers className="text-4xl" />

            </div>

          </div>

          {/* GROUP CAPACITY */}
          <div className="rounded-2xl border border-yellow-400 bg-black p-6 shadow-xl">

            <p className="text-yellow-300 text-sm">
              Group Capacity
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {group.members?.length || 0}/{group.maxMembers}
            </h2>

            <p className="text-yellow-200 mt-2 text-sm">
              Maximum allowed members
            </p>

          </div>

          {/* CONTRIBUTION */}
          <div className="rounded-2xl border border-yellow-400 bg-black p-6 shadow-xl">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-yellow-300 text-sm">
                  Contribution
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  ₦{group.contributionAmount}
                </h2>
              </div>

              <FaMoneyBillWave className="text-4xl" />

            </div>

          </div>

          {/* FREQUENCY */}
          <div className="rounded-2xl border border-yellow-400 bg-black p-6 shadow-xl">

            <p className="text-yellow-300 text-sm">
              Frequency
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {group.frequency}
            </h2>

          </div>

          {/* NEXT PAYOUT */}
          <div className="rounded-2xl border border-yellow-400 bg-black p-6 shadow-xl">

            <p className="text-yellow-300 text-sm">
              Next Payout
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {group.nextPayoutDate || "Coming Soon"}
            </h2>

          </div>

        </div>

        {/* MEMBERS */}
        <div className="mt-10 rounded-3xl border border-yellow-400 bg-black p-8 shadow-xl">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-3xl font-bold">
              Group Members
            </h2>

            <span className="text-yellow-300">
              {group.members?.length || 0} Members
            </span>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {group.members?.map((member, index) => (
              <div
                key={member._id}
                className="rounded-2xl border border-yellow-500 bg-yellow-900/10 p-5"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-xl font-bold">
                      {member.fullname || member.username}
                    </h3>

                    <p className="text-yellow-300 text-sm mt-1">
                      Member #{index + 1}
                    </p>

                  </div>

                  <div className="w-12 h-12 rounded-full bg-yellow-500 text-black flex items-center justify-center font-bold text-lg">
                    {(member.fullname || member.username)
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* ACTIVITIES */}
        <div className="mt-10 rounded-3xl border border-yellow-400 bg-black p-8 shadow-xl">

          <h2 className="text-3xl font-bold mb-6">
            Group Activities
          </h2>

          <div className="space-y-4">

            {group.activities?.length > 0 ? (
              group.activities.map((activity, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-yellow-500 bg-yellow-900/10 p-5 flex items-center justify-between"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {activity.title}
                    </h3>

                    <p className="text-yellow-300 text-sm mt-1">
                      {activity.description}
                    </p>

                  </div>

                  <div className="text-yellow-300 text-sm">
                    {activity.date}
                  </div>

                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-yellow-500 bg-yellow-900/10 p-6 text-center text-yellow-300">
                No activities yet
              </div>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}