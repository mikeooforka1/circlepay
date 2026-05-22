import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function JoinGroup() {

  const [groupCode, setGroupCode] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/groups/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        groupCode,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Joined successfully");
      window.location.href = "/dashboard";
    } else {
      alert(data.message || "Failed");
    }
  };

  return (
    <main className="min-h-screen bg-black text-yellow-400 pt-28 px-4">

      <div className="max-w-xl mx-auto bg-black border border-yellow-400 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-6">
          Join Ajo Group
        </h1>

        <form onSubmit={handleJoin} className="space-y-5">

          <input
            type="text"
            placeholder="Enter Group Code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            className="w-full bg-black border border-yellow-500 rounded-2xl px-4 py-3"
          />

          <button
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold"
          >
            Join Group
          </button>

        </form>

      </div>

    </main>
  );
}