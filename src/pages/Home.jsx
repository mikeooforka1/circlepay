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

const CheckIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const features = [
  {
    title: "Traditional Ajo, Modern Technology",
    description: "Experience the trusted Ajo savings model your community has used for generations, now secured with blockchain transparency and real-time automation.",
    icon: "🔄",
  },
  {
    title: "Guaranteed Turn-by-Turn Payouts",
    description: "Every member receives their full payout on their designated turn. No exceptions. Transparent rotation system ensures fairness and predictability.",
    icon: "✓",
  },
  {
    title: "Zero Middleman Fees",
    description: "CirclePay operates as a facilitator, not a middleman. Keep more of your savings with minimal platform fees and transparent pricing.",
    icon: "💰",
  },
  {
    title: "Multi-Level Contribution Plans",
    description: "Daily, weekly, monthly, or custom cycles. Flexible contribution amounts. Choose what fits your financial situation and savings goals.",
    icon: "📅",
  },
  {
    title: "Secure Digital Wallet",
    description: "Fund your Ajo contributions instantly, withdraw payouts immediately, and track every transaction with full audit trails and security.",
    icon: "🔐",
  },
  {
    title: "Community-First Trust System",
    description: "Built-in verification, member profiles, and contribution history. Find trusted Ajo groups or create your own with family and friends.",
    icon: "👥",
  },
];

const ajoInsights = [
  {
    label: "Active Ajo Groups",
    value: "2,847+",
    detail: "Growing community of savers",
  },
  {
    label: "Total Contributions Processed",
    value: "₦2.3B+",
    detail: "Secure, transparent transactions",
  },
  {
    label: "Average Member Savings",
    value: "₦185K",
    detail: "Per member per cycle",
  },
  {
    label: "On-Time Payout Rate",
    value: "99.8%",
    detail: "Reliable turn distributions",
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left: Text & Actions */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-yellow-600 bg-yellow-900/30 backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-semibold text-yellow-300 uppercase tracking-wider">
              The Future of Community Savings
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              CirclePay
            </span>
            <br className="hidden sm:block" />
            <span className="text-yellow-100">Ajo Done Right</span>
          </h1>

          <p className="mt-6 text-yellow-200 text-lg sm:text-xl max-w-xl leading-relaxed">
            CirclePay brings the trusted Ajo tradition into the digital age. Transparent, secure, and automated savings cycles where every member gets their guaranteed payout on time. No middleman. No complications. Just pure community finance.
          </p>

          <ul className="mt-8 space-y-3 text-yellow-100 text-base">
            <li className="flex items-center gap-3">
              <span className="text-yellow-400 font-bold">✓</span>
              Guaranteed turn-by-turn payouts with zero risk
            </li>
            <li className="flex items-center gap-3">
              <span className="text-yellow-400 font-bold">✓</span>
              Join existing groups or create your own instantly
            </li>
            <li className="flex items-center gap-3">
              <span className="text-yellow-400 font-bold">✓</span>
              Full transparency — see every transaction in real-time
            </li>
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleGetStarted}
              className="group inline-flex items-center justify-center rounded-xl px-8 py-4 w-full sm:w-auto text-black font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg hover:shadow-2xl hover:scale-105 transition-all text-center"
            >
              Start Your Ajo Journey
              <ArrowRight
                className="ml-3 transition-transform group-hover:translate-x-1"
                size={20}
              />
            </button>

            <Link
              to="/about"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 w-full sm:w-auto border-2 border-yellow-400 bg-transparent hover:bg-yellow-900/20 text-yellow-300 font-semibold transition-colors text-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right: Visual Stats */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6 lg:gap-8">
          {ajoInsights.map((insight, idx) => (
            <div
              key={idx}
              className="relative group rounded-2xl border border-yellow-600/50 bg-gradient-to-br from-yellow-900/20 to-black/60 backdrop-blur-sm p-6 lg:p-8 hover:border-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <p className="text-xs lg:text-sm font-semibold text-yellow-300 uppercase tracking-widest">
                  {insight.label}
                </p>
                <p className="mt-3 text-3xl lg:text-4xl font-extrabold text-yellow-300">
                  {insight.value}
                </p>
                <p className="mt-2 text-sm text-yellow-200/80">
                  {insight.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-2xl border border-yellow-600/50 bg-black/80 backdrop-blur-xl shadow-lg overflow-hidden">
          <Ticker />
        </div>
      </section>

      {/* Core Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-yellow-900/30">
        
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-yellow-100 mb-4">
            Why Choose <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">CirclePay</span>
          </h2>
          <p className="text-lg text-yellow-200 max-w-2xl">
            We've digitized the Ajo model you trust while removing the pain points that made traditional savings circles risky.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-yellow-600/40 bg-gradient-to-br from-yellow-900/20 via-black to-black/60 p-8 hover:border-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-500/10"
            >
              {/* Accent background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative">
                {/* Icon */}
                <div className="text-4xl mb-4">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-yellow-100/90 text-base leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 h-1 w-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full group-hover:w-16 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ajo Education Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-yellow-900/30">
        
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
          
          {/* Left: Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-100 mb-6">
              Understanding Ajo: <span className="text-yellow-400">The Backbone of Community Finance</span>
            </h2>

            <p className="text-lg text-yellow-200 mb-6 leading-relaxed">
              Ajo is more than savings—it's a cultural tradition where members contribute fixed amounts at regular intervals. When your turn comes, you receive the full pooled amount. It builds trust, discipline, and community wealth.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckIcon className="w-6 h-6 text-yellow-400 mt-1" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-1">Collective Strength</h4>
                  <p className="text-yellow-200/80">
                    Pool resources with trusted community members for larger savings goals than solo efforts.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckIcon className="w-6 h-6 text-yellow-400 mt-1" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-1">Guaranteed Payout</h4>
                  <p className="text-yellow-200/80">
                    Everyone gets their full turn regardless of emergencies or individual circumstances.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <CheckIcon className="w-6 h-6 text-yellow-400 mt-1" />
                </div>
                <div>
                  <h4 className="font-bold text-yellow-300 mb-1">Built on Trust</h4>
                  <p className="text-yellow-200/80">
                    Traditional accountability meets modern security—no one can cheat the system.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-semibold group"
            >
              Deep dive into Ajo history
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={18} />
            </Link>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-yellow-500/20 via-yellow-400/10 to-transparent blur-3xl pointer-events-none" />
            
            <div className="relative rounded-3xl border border-yellow-600/40 bg-gradient-to-br from-yellow-900/30 to-black/80 p-8 lg:p-12">
              <div className="space-y-6">
                {[
                  { step: 1, title: "Members Join", desc: "Form a group or join existing Ajo circle" },
                  { step: 2, title: "Contribute", desc: "Regular contributions on your schedule" },
                  { step: 3, title: "Rotation", desc: "Each member gets payout on their turn" },
                  { step: 4, title: "Repeat", desc: "Continue cycles or start new ones" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-300 mb-1">{item.title}</h4>
                      <p className="text-yellow-200/70 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-yellow-900/30">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-100 mb-4">
            Built on <span className="text-yellow-400">Trust & Technology</span>
          </h2>
          <p className="text-lg text-yellow-200 max-w-2xl mx-auto">
            Your savings are protected by modern security standards while maintaining the community values Ajo is known for.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "🔐", title: "Bank-Grade Security", desc: "End-to-end encryption for all transactions" },
            { icon: "⛓️", title: "Blockchain Verified", desc: "Immutable transaction ledger" },
            { icon: "✅", title: "Member Verification", desc: "Confirmed identities for trust" },
            { icon: "📊", title: "Real-Time Audit", desc: "Complete transparency in every cycle" },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-yellow-600/40 bg-black/40 p-6 hover:border-yellow-400 transition-colors text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-yellow-300 mb-2">{item.title}</h4>
              <p className="text-sm text-yellow-200/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-yellow-900/30">
        
        <div className="relative rounded-3xl border border-yellow-600/50 bg-gradient-to-r from-yellow-900/30 via-black to-yellow-900/20 p-12 lg:p-16 text-center overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 pointer-events-none" />
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-yellow-100 mb-4">
              Ready to Join the <span className="text-yellow-400">CirclePay</span> Community?
            </h2>
            
            <p className="text-lg sm:text-xl text-yellow-200 max-w-2xl mx-auto mb-8">
              Start your Ajo savings journey today. Secure, transparent, and guaranteed payouts await.
            </p>

            <button
              type="button"
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center rounded-xl px-10 py-4 text-lg font-bold text-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-3 transition-transform group-hover:translate-x-1" size={22} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .max-w-7xl {
            padding: 1rem !important;
          }
        }

        @media (max-width: 640px) {
          .max-w-7xl {
            padding: 1rem !important;
          }

          h1 {
            font-size: 2rem !important;
          }

          h2 {
            font-size: 1.875rem !important;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        section {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}