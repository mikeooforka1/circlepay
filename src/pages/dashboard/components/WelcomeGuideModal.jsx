import React from "react";

export default function WelcomeGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Welcome to CirclePay!</h2>
        <p className="mb-4 text-slate-700">
          You can now start investing in Nigeria's top stocks.<br />
          Click "Invest" on any stock to begin.<br />
          Track your portfolio and earnings in real time.
        </p>
        <button
          className="mt-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold"
          onClick={onClose}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}