import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import Ticker from "../components/Ticker.jsx";

const ArrowRight = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const categories = [
  {
    sector: "Daily Contributions",
    companies: [
      { name: "Flexible Daily Savings", symbol: "DAILY" },
      { name: "Weekly Contribution Plans", symbol: "WEEKLY" },
      { name: "Monthly Ajo Cycles", symbol: "MONTHLY" },
    ],
    desc: "Join trusted contribution circles and save consistently with automated tracking.",
  },
  {
    sector: "Automated Payouts",
    companies: [
      { name: "Scheduled Turn Payments", symbol: "PAYOUT" },
      { name: "Instant Wallet Credit", symbol: "WALLET" },
      { name: "Smart Rotation System", symbol: "ROTATION" },
    ],
    desc: "CirclePay automatically distributes funds to members based on contribution turns.",
  },
  {
    sector: "Secure Wallet System",
    companies: [
      { name: "Fund Wallet", symbol: "FUND" },
      { name: "Withdraw Earnings", symbol: "WITHDRAW" },
      { name: "Track Contributions", symbol: "TRACK" },
    ],
    desc: "Manage your savings, payouts, and transactions from one secure dashboard.",
  },
  {
    sector: "Group Savings Circles",
    companies: [
      { name: "Family Ajo Groups", symbol: "FAMILY" },
      { name: "Friends Contribution Circle", symbol: "FRIENDS" },
      { name: "Business Cooperative Plans", symbol: "COOP" },
    ],
    desc: "Create or join savings groups with trusted members and transparent contribution history.",
  },
  {
    sector: "Smart Notifications",
    companies: [
      { name: "Contribution Reminders", symbol: "REMINDER" },
      { name: "Payout Alerts", symbol: "ALERTS" },
      { name: "Real-time Updates", symbol: "LIVE" },
    ],
    desc: "Receive instant notifications for contributions, payouts, and savings activity.",
  },
  {
    sector: "24/7 Member Support",
    companies: [
      { name: "Live Chat Support", symbol: "CHAT" },
      { name: "Dispute Resolution", symbol: "SUPPORT" },
    ],
    desc: "Get fast assistance whenever you need help with your savings circle.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-yellow-400 pt-16">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-10 flex flex-col-reverse md:flex-row items-center gap-10">
        
        {/* Left: Text & Actions */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          
          <div className="mb-6">
            <span className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
              CirclePay
            </span>

            <h1 className="mt-2 text-yellow-400 text-2xl sm:text-3xl md:text-4xl font-bold">
              Digital Ajo Savings & Contribution Platform
            </h1>
          </div>

          <p className="mt-2 text-yellow-200 text-base sm:text-lg max-w-md">
            Save smarter with CirclePay. Join trusted contribution circles,
            contribute daily, weekly, or monthly, and receive automated payouts
            when it’s your turn. No middleman, no stress — secure, transparent,
            and reliable ajo management powered by technology.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              type="button"
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center rounded-xl px-6 py-3 w-full sm:w-auto text-black font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              Start Saving
              <ArrowRight
                className="ml-2 transition-transform group-hover:translate-x-1"
                size={18}
              />
            </button>

            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 w-full sm:w-auto border border-yellow-400 bg-black hover:bg-yellow-900 text-yellow-400 text-center"
            >
              Learn more
            </Link>
          </div>

          <div className="mt-10 w-full">
            <div className="rounded-2xl border border-yellow-400 bg-black/90 backdrop-blur-xl shadow-md">
              <Ticker />
            </div>
          </div>
        </div>

        {/* Right: Illustration & Features */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          
          <div className="relative w-full max-w-xs mx-auto">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-yellow-400/40 via-yellow-500/40 to-yellow-300/40 blur-2xl pointer-events-none" />

            <div className="relative rounded-3xl border border-yellow-400 bg-black p-6 shadow-lg">
              
              <img
                src="/assets/images/site-logo.png"
                alt="CirclePay Logo"
                className="mx-auto w-24 h-24 rounded-full shadow-lg mb-4"
              />

              <div className="grid grid-cols-2 gap-4 mt-2">
                
                <div className="rounded-xl border border-yellow-400 bg-yellow-900 p-3 shadow flex flex-col items-center">
                  <span className="text-yellow-400 text-xs font-semibold">
                    Automated Payouts
                  </span>

                  <span className="mt-1 text-sm font-bold text-yellow-200 text-center">
                    Turn-by-turn distribution
                  </span>
                </div>

                <div className="rounded-xl border border-yellow-400 bg-yellow-900 p-3 shadow flex flex-col items-center">
                  <span className="text-yellow-400 text-xs font-semibold">
                    Trusted Savings
                  </span>

                  <span className="mt-1 text-sm font-bold text-yellow-200 text-center">
                    Transparent ajo cycles
                  </span>
                </div>

                <div className="rounded-xl border border-yellow-400 bg-yellow-900 p-3 shadow flex flex-col items-center">
                  <span className="text-yellow-400 text-xs font-semibold">
                    Secure Contributions
                  </span>

                  <span className="mt-1 text-sm font-bold text-yellow-200 text-center">
                    Protected member funds
                  </span>
                </div>

                <div className="rounded-xl border border-yellow-400 bg-yellow-900 p-3 shadow flex flex-col items-center">
                  <span className="text-yellow-400 text-xs font-semibold">
                    24/7 Access
                  </span>

                  <span className="mt-1 text-sm font-bold text-yellow-200 text-center">
                    Save anytime anywhere
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          
          <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 text-center sm:text-left w-full sm:w-auto">
            CirclePay Features
          </h2>

          <Link
            to="/sectors"
            className="text-sm text-yellow-400 hover:text-yellow-300 text-center sm:text-right w-full sm:w-auto"
          >
            View all
          </Link>
        </div>

        <div className="mt-8 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          
          {categories.map((cat) => (
            <div
              key={cat.sector}
              className="group rounded-2xl border border-yellow-400 bg-black p-6 transition-transform hover:-translate-y-1 hover:bg-yellow-900 flex flex-col h-full shadow"
            >
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-yellow-400">
                  {cat.sector}
                </h3>
              </div>

              <p className="mb-3 text-yellow-200 text-sm flex-1">
                {cat.desc}
              </p>

              <div className="mb-2 flex flex-col gap-1 text-xs text-yellow-400 font-semibold">
                
                {cat.companies.map((c) => (
                  <span key={c.symbol}>
                    {c.name}{" "}
                    <span className="text-yellow-700">
                      ({c.symbol})
                    </span>
                  </span>
                ))}
              </div>

              <button
                className="mt-auto inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
                onClick={() => navigate("/sectors")}
              >
                Explore
                <ArrowRight size={16} className="ml-1" />
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
            padding-bottom: 2.5rem !important;
          }

          .mt-16 {
            margin-top: 4.5rem !important;
          }

          .mt-8 {
            margin-top: 3.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}