import React from "react";

// Ajo platform ticker data
const tickerItems = [
  {
    title: "Daily Ajo",
    detail: "Save ₦1,000 daily",
    status: "Active",
  },
  {
    title: "Weekly Contribution",
    detail: "₦5,000 every week",
    status: "Ongoing",
  },
  {
    title: "Trusted Members",
    detail: "2,500+ active savers",
    status: "Growing",
  },
  {
    title: "Instant Withdrawals",
    detail: "Fast payout processing",
    status: "Available",
  },
  {
    title: "Group Savings",
    detail: "Create or join ajo groups",
    status: "Live",
  },
  {
    title: "Secure Wallet",
    detail: "Protected user funds",
    status: "Safe",
  },
  {
    title: "Flexible Contributions",
    detail: "Daily, weekly & monthly",
    status: "Open",
  },
];

export default function Ticker() {
  return (
    <div className="relative overflow-hidden bg-black border border-yellow-400/30 rounded-xl">

      <div className="flex gap-8 whitespace-nowrap animate-marquee py-3 px-2">

        {[...tickerItems, ...tickerItems].map((item, i) => (

          <div
            key={i}
            className="flex items-center gap-2 min-w-max"
          >

            <span className="text-yellow-400 text-xs font-bold uppercase">
              {item.title}
            </span>

            <span className="text-yellow-100 text-sm font-semibold">
              {item.detail}
            </span>

            <span className="text-green-400 text-xs font-medium">
              ● {item.status}
            </span>

          </div>

        ))}

      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent" />

      <style>
        {`
          .animate-marquee {
            display: flex;
            animation: marquee 18s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }

            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>

    </div>
  );
}