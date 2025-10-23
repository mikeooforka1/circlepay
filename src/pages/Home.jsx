import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Ticker from "../components/Ticker.jsx";

const ArrowRight = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
);

const categories = [
  {
    sector: "Banking",
    companies: [
      { name: "Zenith Bank Plc", symbol: "ZENITHBANK" },
      { name: "Guaranty Trust Holding Company", symbol: "GTCO" },
      { name: "Access Holdings Plc", symbol: "ACCESSCORP" },
      { name: "United Bank for Africa", symbol: "UBA" },
    ],
    desc: "Stable stocks with consistent dividend history.",
  },
  {
    sector: "Industrial Goods / Cement",
    companies: [
      { name: "Dangote Cement Plc", symbol: "DANGCEM" },
      { name: "BUA Cement Plc", symbol: "BUACEMENT" },
      { name: "Lafarge Africa Plc", symbol: "WAPCO" },
    ],
    desc: "Dominant players in construction and infrastructure.",
  },
  {
    sector: "Consumer Goods",
    companies: [
      { name: "Nigerian Breweries Plc", symbol: "NB" },
      { name: "Guinness Nigeria Plc", symbol: "GUINNESS" },
      { name: "Cadbury Nigeria Plc", symbol: "CADBURY" },
      { name: "Dangote Sugar Refinery Plc", symbol: "DANGSUGAR" },
    ],
    desc: "Producers of everyday items with large market reach.",
  },
  {
    sector: "Telecommunications",
    companies: [
      { name: "MTN Nigeria Communications Plc", symbol: "MTNN" },
      { name: "Airtel Africa Plc", symbol: "AIRTELAFRI" },
    ],
    desc: "High-cap companies driven by Nigeria's mobile/data usage.",
  },
  {
    sector: "Oil and Gas",
    companies: [
      { name: "Seplat Energy Plc", symbol: "SEPLAT" },
      { name: "Conoil Plc", symbol: "CONOIL" },
      { name: "Aradel Holdings Plc", symbol: "ARADEL" },
    ],
    desc: "Exploration, production, and distribution of petroleum.",
  },
  {
    sector: "Others",
    companies: [
      { name: "Transcorp Hotels Plc", symbol: "TRANSCOHOT" },
      { name: "NAHCO Plc", symbol: "NAHCO" },
      { name: "Custodian Investment Plc", symbol: "CUSTODIAN" },
    ],
    desc: "Hospitality, aviation services, and insurance.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left: Text & Actions */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-300 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              CirclePay
            </span>
            <h1 className="mt-2 text-slate-800 text-2xl sm:text-3xl md:text-4xl font-bold">
              Invest in Nigeria’s Leading Stocks
            </h1>
          </div>
          <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-md">
            Discover a new way to grow your wealth. Invest in top Nigerian stocks across banking, telecoms, consumer goods, oil & gas, and more. Experience transparency, speed, and a seamless journey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link
              to="/login"
              className="group inline-flex items-center justify-center rounded-xl px-6 py-3 w-full sm:w-auto text-white font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              Start Investing
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 w-full sm:w-auto border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 text-center"
            >
              Learn more
            </Link>
          </div>
          <div className="mt-10 w-full">
            <div className="rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-xl shadow-md">
              <Ticker />
            </div>
          </div>
        </div>
        {/* Right: Illustration & Features */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-xs mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-200/40 via-cyan-200/40 to-fuchsia-200/40 blur-2xl pointer-events-none" />
            <div className="relative rounded-3xl border border-blue-100 bg-white p-6 shadow-lg">
              <img
                src="/assets/images/site-logo.png"
                alt="CirclePay Logo"
                className="mx-auto w-24 h-24 rounded-full shadow-lg mb-4"
              />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 shadow flex flex-col items-center">
                  <span className="text-blue-700 text-xs font-semibold">Diversity</span>
                  <span className="mt-1 text-sm font-bold text-slate-800 text-center">Multiple sectors</span>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 shadow flex flex-col items-center">
                  <span className="text-blue-700 text-xs font-semibold">Stability</span>
                  <span className="mt-1 text-sm font-bold text-slate-800 text-center">Consistent dividends</span>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 shadow flex flex-col items-center">
                  <span className="text-blue-700 text-xs font-semibold">Growth</span>
                  <span className="mt-1 text-sm font-bold text-slate-800 text-center">Market leaders</span>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 shadow flex flex-col items-center">
                  <span className="text-blue-700 text-xs font-semibold">Access</span>
                  <span className="mt-1 text-sm font-bold text-slate-800 text-center">Easy investing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 text-center sm:text-left w-full sm:w-auto">Popular Sectors & Stocks</h2>
          <Link to="/sectors" className="text-sm text-blue-500 hover:text-blue-700 text-center sm:text-right w-full sm:w-auto">View all</Link>
        </div>
        <div className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div key={cat.sector} className="group rounded-2xl border border-blue-100 bg-white p-6 transition-transform hover:-translate-y-1 hover:bg-blue-50 flex flex-col h-full shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800">{cat.sector}</h3>
              </div>
              <p className="mb-3 text-blue-600 text-sm flex-1">{cat.desc}</p>
              <div className="mb-2 flex flex-col gap-1 text-xs text-blue-500 font-semibold">
                {cat.companies.map((c) => (
                  <span key={c.symbol}>{c.name} <span className="text-slate-400">({c.symbol})</span></span>
                ))}
              </div>
              <button
                className="mt-auto inline-flex items-center text-blue-500 hover:text-blue-700 text-sm font-semibold"
                onClick={() => navigate("/sectors")}
              >
                Explore <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>
      <style>{`
        @media (max-width: 900px) {
          .max-w-7xl {
            padding: 0.5rem !important;
          }
        }
        @media (max-width: 640px) {
          .max-w-7xl {
            padding: 0.5rem !important;
          }
          .pt-16 {
            padding-top: 4.5rem !important;
          }
          .pb-10 {
            padding-bottom: 1.5rem !important;
          }
          .mt-16 {
            margin-top: 4.5rem !important;
          }
          .mt-8 {
            margin-top: 2.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}
