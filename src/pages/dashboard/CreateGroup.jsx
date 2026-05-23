import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function CreateGroup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    groupName: "",
    contributionAmount: "",
    frequency: "Weekly",
    maxMembers: "5",
    payoutDuration: "7",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.groupName.trim()) {
      setError("Group name is required");
      setLoading(false);
      return;
    }

    if (!formData.contributionAmount || formData.contributionAmount <= 0) {
      setError("Contribution amount must be greater than 0");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupName: formData.groupName,
          contributionAmount: Number(formData.contributionAmount),
          frequency: formData.frequency,
          maxMembers: Number(formData.maxMembers),
          payoutDuration: Number(formData.payoutDuration),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Navigate to group page
        navigate("/dashboard/group", { state: { success: true } });
      } else {
        setError(data.message || "Failed to create group");
      }
    } catch (err) {
      console.error("Create group error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-yellow-400 pt-24 pb-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-yellow-300/70 hover:text-yellow-300 transition mb-8 text-sm font-semibold"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {/* Card */}
        <div className="rounded-3xl border border-yellow-400/50 bg-gradient-to-br from-purple-500/15 via-black to-purple-900/20 p-8 md:p-10 shadow-2xl backdrop-blur-sm">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-yellow-300 mb-3">
              Create Ajo Group
            </h1>
            <p className="text-yellow-200/70 text-sm max-w-lg">
              Start a savings circle with friends. Set your contribution amount, frequency, and payout schedule.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-yellow-300 text-sm font-semibold mb-3">
                Group Name
              </label>
              <input
                type="text"
                name="groupName"
                placeholder="e.g., Friday Girls Ajo"
                value={formData.groupName}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-yellow-400/50 rounded-2xl px-4 py-3 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition"
              />
            </div>

            {/* Contribution Amount */}
            <div>
              <label className="block text-yellow-300 text-sm font-semibold mb-3">
                Contribution Amount (₦)
              </label>
              <input
                type="number"
                name="contributionAmount"
                placeholder="e.g., 5000"
                value={formData.contributionAmount}
                onChange={handleInputChange}
                min="100"
                className="w-full bg-black/40 border border-yellow-400/50 rounded-2xl px-4 py-3 text-yellow-300 placeholder-yellow-300/40 focus:border-yellow-300 focus:outline-none transition"
              />
              <p className="text-yellow-200/60 text-xs mt-2">
                This is the amount each member contributes per cycle
              </p>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-yellow-300 text-sm font-semibold mb-3">
                Contribution Frequency
              </label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-yellow-400/50 rounded-2xl px-4 py-3 text-yellow-300 focus:border-yellow-300 focus:outline-none transition"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-yellow-300 text-sm font-semibold mb-3">
                Maximum Group Members
              </label>
              <select
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleInputChange}
                className="w-full bg-black/40 border border-yellow-400/50 rounded-2xl px-4 py-3 text-yellow-300 focus:border-yellow-300 focus:outline-none transition"
              >
                <option value="2">2 Members</option>
                <option value="3">3 Members</option>
                <option value="4">4 Members</option>
                <option value="5">5 Members</option>
                <option value="7">7 Members</option>
                <option value="10">10 Members</option>
                <option value="15">15 Members</option>
                <option value="20">20 Members</option>
              </select>
              <p className="text-yellow-200/60 text-xs mt-2">
                The more members, the longer the payout cycle
              </p>
            </div>

            {/* Payout Duration */}
            <div>
              <label className="block text-yellow-300 text-sm font-semibold mb-3">
                Payout Cycle Duration
              </label>
              <div className="space-y-3">
                <p className="text-yellow-200/70 text-xs">
                  How many days between each member's payout date
                </p>
                <select
                  name="payoutDuration"
                  value={formData.payoutDuration}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-yellow-400/50 rounded-2xl px-4 py-3 text-yellow-300 focus:border-yellow-300 focus:outline-none transition"
                >
                  <option value="7">
                    7 Days (1 Week) - Each member gets paid every 7 days
                  </option>
                  <option value="14">
                    14 Days (2 Weeks) - Each member gets paid every 14 days
                  </option>
                  <option value="21">
                    21 Days (3 Weeks) - Each member gets paid every 21 days
                  </option>
                </select>
              </div>

              {/* Payout Explanation */}
              <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30">
                <p className="text-yellow-300 text-xs font-semibold mb-2">
                  📊 How This Works:
                </p>
                <p className="text-yellow-200/70 text-xs leading-relaxed">
                  With {formData.maxMembers} members contributing ₦{formData.contributionAmount || "0"} every{" "}
                  {formData.frequency.toLowerCase()}:
                </p>
                <ul className="text-yellow-200/70 text-xs mt-2 space-y-1 ml-4">
                  <li>
                    • Member 1 receives: ₦{Number(formData.contributionAmount || 0) * Number(formData.maxMembers || 1)} on day 1
                  </li>
                  <li>
                    • Member 2 receives: ₦{Number(formData.contributionAmount || 0) * Number(formData.maxMembers || 1)} on day{" "}
                    {formData.payoutDuration}
                  </li>
                  <li>
                    • And so on every {formData.payoutDuration} days...
                  </li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Group..." : "Create Group"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}