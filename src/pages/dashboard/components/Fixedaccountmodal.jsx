import React, { useState } from "react";
import { FaTimes, FaCopy, FaCheckCircle, FaUniversity, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FixedAccountModal({ isOpen, onClose, hasGroup, groupData }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0e121a] border border-yellow-400/40 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-yellow-400/20">
          <div className="flex items-center gap-2.5">
            <FaUniversity className="text-yellow-400 text-xl" />
            <h2 className="text-xl font-black text-yellow-300">
              {hasGroup ? "Group Deposit Account" : "Group Required"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 flex items-center justify-center transition"
          >
            <FaTimes />
          </button>
        </div>

        {hasGroup && groupData ? (
          <div className="mt-5 space-y-4">
            <p className="text-yellow-200/80 text-xs leading-relaxed">
              Transfer your contribution to your Group Head's designated account for <strong>{groupData.groupName}</strong>:
            </p>

            <div className="space-y-3">
              <div className="bg-black/60 border border-yellow-400/30 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-yellow-200/50 uppercase font-bold">Bank Name</span>
                  <p className="text-base font-bold text-yellow-300">{groupData.collectionBankName}</p>
                </div>
              </div>

              <div className="bg-black/60 border border-yellow-400/40 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-yellow-200/50 uppercase font-bold">Account Number</span>
                  <p className="text-2xl font-black font-mono tracking-widest text-yellow-400">
                    {groupData.collectionAccountNumber}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(groupData.collectionAccountNumber)}
                  className="p-3 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 transition"
                  title="Copy"
                >
                  {copied ? <FaCheckCircle className="text-emerald-400" size={18} /> : <FaCopy size={18} />}
                </button>
              </div>

              <div className="bg-black/60 border border-yellow-400/30 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-yellow-200/50 uppercase font-bold">Beneficiary Name</span>
                  <p className="text-sm font-bold text-yellow-300 truncate max-w-[280px]">
                    {groupData.collectionAccountName}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate("/dashboard/contribute");
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm hover:shadow-lg transition mt-2"
            >
              Submit Transfer Proof & Reference →
            </button>
          </div>
        ) : (
          <div className="mt-6 text-center space-y-4">
            <FaExclamationTriangle className="text-yellow-400 text-4xl mx-auto" />
            <h3 className="text-lg font-bold text-yellow-300">Join a Group First</h3>
            <p className="text-xs text-yellow-200/70 leading-relaxed max-w-sm mx-auto">
              CirclePay requires you to belong to an active Ajo circle before depositing. All contributions are transferred directly to your circle's designated account.
            </p>
            <button
              onClick={() => {
                onClose();
                navigate("/dashboard/join-group");
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm hover:shadow-lg transition"
            >
              Find or Join a Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
}