import React from "react";

// Nigerian stocks data for ticker
const stocks = [
  { symbol: "ZENITHBANK", name: "Zenith Bank Plc", price: "₦38.50", change: "+0.52%" },
  { symbol: "GTCO", name: "GTCO", price: "₦41.20", change: "-0.15%" },
  { symbol: "ACCESSCORP", name: "Access Holdings", price: "₦19.80", change: "+1.10%" },
  { symbol: "MTNN", name: "MTN Nigeria", price: "₦245.00", change: "+0.80%" },
  { symbol: "DANGCEM", name: "Dangote Cement", price: "₦320.00", change: "-0.25%" },
  { symbol: "BUACEMENT", name: "BUA Cement", price: "₦98.00", change: "+0.40%" },
  { symbol: "SEPLAT", name: "Seplat Energy", price: "₦1,450.00", change: "+0.90%" },
];

export default function Ticker() {
  return (
    <div className="relative overflow-hidden bg-white rounded-xl">
      <div className="flex gap-8 whitespace-nowrap animate-marquee py-3">
        {[...stocks, ...stocks].map((stock, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-blue-700 text-xs font-bold">{stock.symbol}</span>
            <span className="text-sm font-semibold text-slate-800">{stock.price}</span>
            <span className={`${stock.change.startsWith("+") ? "text-green-600" : "text-red-600"} text-xs font-medium`}>
              {stock.change.startsWith("+") ? "▲" : "▼"} {stock.change.replace("+", "").replace("-", "")}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent" />
      <style>
        {`
          .animate-marquee {
            display: flex;
            animation: marquee 18s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
}
