import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function CreateGroup() {

  const [groupName, setGroupName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Weekly");
  const [maxMembers, setMaxMembers] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/groups/create`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        groupName,
        contributionAmount: amount,
        frequency,
        maxMembers,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Group created successfully");

      window.location.href = "/dashboard/group";
    } else {
      alert(data.message || "Failed");
    }
  };

  return (
    <main className="min-h-screen bg-black text-yellow-400 pt-28 px-4">

      <div className="max-w-2xl mx-auto bg-black border border-yellow-400 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-6">
          Create Ajo Group
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-2xl px-4 py-3"
          />

          <input
            type="number"
            placeholder="Contribution Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-2xl px-4 py-3"
          />

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-2xl px-4 py-3"
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          {/* MAX MEMBERS */}
          <div>

            <label className="block mb-2 text-yellow-300">
              Maximum Group Members
            </label>

            <select
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              className="w-full bg-black border border-yellow-500 rounded-2xl px-4 py-3"
            >
              <option value={2}>2 Members</option>
              <option value={3}>3 Members</option>
              <option value={4}>4 Members</option>
              <option value={5}>5 Members</option>
              <option value={7}>7 Members</option>
              <option value={10}>10 Members</option>
        
            </select>

          </div>

          <button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold"
          >
            Create Group
          </button>

        </form>

      </div>

    </main>
  );
}