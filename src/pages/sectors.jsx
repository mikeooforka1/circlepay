import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Helper for dollar conversion
const NGN_TO_USD = 1461.66;
function formatDollar(ngn) {
  // Remove ₦ and commas, then convert
  const num = Number(String(ngn).replace(/[₦,]/g, ""));
  const usd = num / NGN_TO_USD;
  return `$${usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// Nigerian stocks data
const stocks = [
  { symbol: "ZENITHBANK", name: "Zenith Bank Plc", price: "₦38.50", change: "+0.52%" },
  { symbol: "GTCO", name: "GTCO", price: "₦41.20", change: "-0.15%" },
  { symbol: "ACCESSCORP", name: "Access Holdings", price: "₦19.80", change: "+1.10%" },
  { symbol: "UBA", name: "United Bank for Africa", price: "₦17.50", change: "+0.30%" },
  { symbol: "MTNN", name: "MTN Nigeria", price: "₦245.00", change: "+0.80%" },
  { symbol: "AIRTELAFRI", name: "Airtel Africa", price: "₦1,650.00", change: "-0.10%" },
  { symbol: "DANGCEM", name: "Dangote Cement", price: "₦320.00", change: "-0.25%" },
  { symbol: "BUACEMENT", name: "BUA Cement", price: "₦98.00", change: "+0.40%" },
  { symbol: "WAPCO", name: "Lafarge Africa Plc", price: "₦31.00", change: "+0.20%" },
  { symbol: "NB", name: "Nigerian Breweries Plc", price: "₦38.00", change: "+0.15%" },
  { symbol: "GUINNESS", name: "Guinness Nigeria Plc", price: "₦70.00", change: "-0.05%" },
  { symbol: "CADBURY", name: "Cadbury Nigeria Plc", price: "₦17.80", change: "+0.25%" },
  { symbol: "DANGSUGAR", name: "Dangote Sugar Refinery", price: "₦45.00", change: "+0.10%" },
  { symbol: "SEPLAT", name: "Seplat Energy", price: "₦1,450.00", change: "+0.90%" },
  { symbol: "CONOIL", name: "Conoil Plc", price: "₦55.00", change: "-0.20%" },
  { symbol: "ARADEL", name: "Aradel Holdings", price: "₦1,200.00", change: "+0.60%" },
  { symbol: "TRANSCOHOT", name: "Transcorp Hotels Plc", price: "₦12.50", change: "+0.05%" },
  { symbol: "NAHCO", name: "NAHCO Plc", price: "₦19.00", change: "+0.10%" },
  { symbol: "CUSTODIAN", name: "Custodian Investment Plc", price: "₦7.80", change: "+0.08%" },
];

// Sectors grouping
const categories = [
  {
    sector: "Banking",
    companies: ["ZENITHBANK", "GTCO", "ACCESSCORP", "UBA"],
    desc: "Stable stocks with consistent dividend history.",
  },
  {
    sector: "Industrial Goods / Cement",
    companies: ["DANGCEM", "BUACEMENT", "WAPCO"],
    desc: "Dominant players in construction and infrastructure.",
  },
  {
    sector: "Consumer Goods",
    companies: ["NB", "GUINNESS", "CADBURY", "DANGSUGAR"],
    desc: "Producers of everyday items with large market reach.",
  },
  {
    sector: "Telecommunications",
    companies: ["MTNN", "AIRTELAFRI"],
    desc: "High-cap companies driven by Nigeria's mobile/data usage.",
  },
  {
    sector: "Oil and Gas",
    companies: ["SEPLAT", "CONOIL", "ARADEL"],
    desc: "Exploration, production, and distribution of petroleum.",
  },
  {
    sector: "Others",
    companies: ["TRANSCOHOT", "NAHCO", "CUSTODIAN"],
    desc: "Hospitality, aviation services, and insurance.",
  },
];

const ArrowRightCircle = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M10 8l4 4-4 4"/>
  </svg>
);

export default function Sectors() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInvest = (symbol) => {
    navigate(`/dashboard/cointrend/${symbol}`);
  };

  return (
    <main className="relative min-h-screen pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700">Sectors & Stocks</h1>
      <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-center">
        Explore Nigeria’s top sectors and their leading stocks. Invest confidently in banking, telecoms, consumer goods, oil & gas, and more.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat.sector} className="group rounded-2xl border border-blue-100 bg-white p-6 shadow transition-transform hover:-translate-y-1 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800">{cat.sector}</h3>
            </div>
            <p className="mt-2 text-blue-600 text-sm">{cat.desc}</p>
            <div className="mb-2 flex flex-col gap-2 mt-4">
              {cat.companies.map((symbol) => {
                const stock = stocks.find(s => s.symbol === symbol);
                return (
                  <div key={symbol} className="flex flex-col gap-2 bg-blue-50 rounded-lg px-3 py-2 mb-1">
                    <div className="flex flex-row items-center justify-between">
                      <div>
                        <span className="text-blue-700 font-bold">{stock.symbol}</span>
                        <span className="ml-2 text-slate-800 font-semibold">{stock.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-800">
                          {stock.price}
                          <span className="ml-2 text-xs text-cyan-600">
                            ({formatDollar(stock.price)})
                          </span>
                        </span>
                        <span className={`${stock.change.startsWith("+") ? "text-green-600" : "text-red-600"} text-xs font-medium`}>
                          {stock.change.startsWith("+") ? "▲" : "▼"} {stock.change.replace("+", "").replace("-", "")}
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-full sm:w-auto mt-2 inline-flex items-center justify-center px-3 py-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs font-semibold shadow hover:shadow-md transition"
                      onClick={() => handleInvest(stock.symbol)}
                    >
                      Invest
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center text-blue-500 text-base">
        <span className="font-semibold text-blue-700">CirclePay</span> — Invest with confidence. Multiply your wealth.
      </div>
      <style>{`
        @media (max-width: 640px) {
          .max-w-7xl {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          .grid-cols-1, .sm\\:grid-cols-2, .lg\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
