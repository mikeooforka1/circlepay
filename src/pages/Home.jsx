import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
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

const SparkleIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const features = [
  {
    title: "Traditional Ajo, Modern Technology",
    description: "Experience the trusted Ajo savings model your community has used for generations, now secured with blockchain transparency and real-time automation.",
    icon: "🔄",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/30",
  },
  {
    title: "Guaranteed Turn-by-Turn Payouts",
    description: "Every member receives their full payout on their designated turn. No exceptions. Transparent rotation system ensures fairness and predictability.",
    icon: "✓",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
  },
  {
    title: "Zero Middleman Fees",
    description: "CirclePay operates as a facilitator, not a middleman. Keep more of your savings with minimal platform fees and transparent pricing.",
    icon: "💰",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
  },
  {
    title: "Multi-Level Contribution Plans",
    description: "Daily, weekly, monthly, or custom cycles. Flexible contribution amounts. Choose what fits your financial situation and savings goals.",
    icon: "📅",
    color: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30",
  },
  {
    title: "Secure Digital Wallet",
    description: "Fund your Ajo contributions instantly, withdraw payouts immediately, and track every transaction with full audit trails and security.",
    icon: "🔐",
    color: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/30",
  },
  {
    title: "Community-First Trust System",
    description: "Built-in verification, member profiles, and contribution history. Find trusted Ajo groups or create your own with family and friends.",
    icon: "👥",
    color: "from-indigo-500/20 to-violet-500/10",
    border: "border-indigo-500/30",
  },
];

const ajoInsights = [
  {
    label: "Active Ajo Groups",
    value: "2,847+",
    detail: "Growing community of savers",
    trend: "↑ 23% this month",
  },
  {
    label: "Total Contributions Processed",
    value: "₦2.3B+",
    detail: "Secure, transparent transactions",
    trend: "Highest record",
  },
  {
    label: "Average Member Savings",
    value: "₦185K",
    detail: "Per member per cycle",
    trend: "Strong growth",
  },
  {
    label: "On-Time Payout Rate",
    value: "99.8%",
    detail: "Reliable turn distributions",
    trend: "Industry leading",
  },
];

const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ animationDelay: `${delay}ms` }} className="opacity-0">
      {children}
    </div>
  );
};

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
    <main className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-x-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full">
          <div className="grid gap-12 lg:gap-20 lg:grid-cols-2 items-center">
            
            {/* Left: Text & Actions */}
            <ScrollReveal delay={0}>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                
                {/* Badge */}
                <div className="inline-block">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                    <div className="relative px-4 py-2 rounded-full border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 backdrop-blur-xl">
                      <div className="flex items-center gap-2">
                        <SparkleIcon className="text-yellow-400 w-4 h-4" />
                        <span className="text-xs sm:text-sm font-bold text-yellow-300 uppercase tracking-wider">
                          The Future of Community Finance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                    <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent block animate-gradient">
                      CirclePay
                    </span>
                    <span className="text-white block mt-2 text-4xl sm:text-5xl lg:text-6xl">
                      Ajo Done Right
                    </span>
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
                </div>

                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl">
                  Bring the trusted Ajo tradition into the digital age. Transparent, secure, and automated savings cycles where every member gets their guaranteed payout on time.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-center gap-3 group cursor-default">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:text-yellow-400 transition-colors">Guaranteed turn-by-turn payouts</span>
                  </li>
                  <li className="flex items-center gap-3 group cursor-default">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:text-yellow-400 transition-colors">Join or create groups instantly</span>
                  </li>
                  <li className="flex items-center gap-3 group cursor-default">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:text-yellow-400 transition-colors">Full transparency in real-time</span>
                  </li>
                </ul>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto pt-4">
                  <button
                    type="button"
                    onClick={handleGetStarted}
                    className="group relative inline-flex items-center justify-center rounded-xl px-8 py-4 w-full sm:w-auto text-base sm:text-lg font-bold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-black shadow-2xl hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      Start Your Ajo Journey
                      <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                    </span>
                  </button>

                  <Link
                    to="/about"
                    className="group inline-flex items-center justify-center rounded-xl px-8 py-4 w-full sm:w-auto border-2 border-yellow-400/50 bg-yellow-400/5 hover:bg-yellow-400/10 text-yellow-300 font-semibold transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-2">
                      Learn More
                      <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Stats Grid */}
            <ScrollReveal delay={200}>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {ajoInsights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 via-gray-900/20 to-black/40 backdrop-blur-xl p-5 sm:p-7 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent rounded-2xl" />
                    </div>
                    
                    <div className="relative z-10 space-y-3">
                      <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider">
                        {insight.label}
                      </p>
                      <div>
                        <p className="text-2xl sm:text-3xl font-black text-white">
                          {insight.value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-2">
                          {insight.detail}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-700/50">
                        <p className="text-xs text-yellow-400 font-semibold">
                          {insight.trend}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="rounded-2xl border border-gray-700/50 bg-gradient-to-r from-gray-800/40 via-gray-900/40 to-gray-800/40 backdrop-blur-xl shadow-2xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300">
              <Ticker />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  Powerful Features
                </span>
                <span className="text-white block mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold">
                  Designed for You
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to manage your Ajo savings with confidence and transparency.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className={`group relative rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.color} backdrop-blur-xl p-7 sm:p-8 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-1 overflow-hidden`}>
                  
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl`} />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="text-5xl">{feature.icon}</div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full group-hover:w-16 transition-all" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ajo Education Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
            
            {/* Left: Content */}
            <ScrollReveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                    Understanding
                    <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent block">
                      Ajo
                    </span>
                  </h2>
                  <p className="text-gray-400 text-lg">
                    The backbone of community finance
                  </p>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">
                  Ajo is more than savings—it's a cultural tradition where members contribute fixed amounts at regular intervals. When your turn comes, you receive the full pooled amount. It builds trust, discipline, and community wealth.
                </p>

                <div className="space-y-4">
                  {[
                    { title: "Collective Strength", desc: "Pool resources with trusted community members for larger savings goals." },
                    { title: "Guaranteed Payout", desc: "Everyone gets their full turn regardless of emergencies or circumstances." },
                    { title: "Built on Trust", desc: "Traditional accountability meets modern security—no one can cheat the system." },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mt-1">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-gray-400">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold group transition-colors"
                >
                  Deep dive into Ajo history
                  <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
                </Link>
              </div>
            </ScrollReveal>

            {/* Right: Visual */}
            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
                
                <div className="relative rounded-3xl border border-gray-700/50 bg-gradient-to-br from-gray-800/50 via-gray-900/30 to-black/50 backdrop-blur-xl p-8 sm:p-12 space-y-6">
                  {[
                    { step: 1, title: "Members Join", desc: "Form a group or join existing Ajo circle" },
                    { step: 2, title: "Contribute", desc: "Regular contributions on your schedule" },
                    { step: 3, title: "Rotation", desc: "Each member gets payout on their turn" },
                    { step: 4, title: "Repeat", desc: "Continue cycles or start new ones" },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center font-bold text-black text-lg group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl sm:text-5xl font-black">
                <span className="text-white">Built on</span>
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent block">
                  Trust & Technology
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Your savings are protected by modern security standards while maintaining the community values Ajo is known for.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🔐", title: "Bank-Grade Security", desc: "End-to-end encryption for all transactions" },
              { icon: "⛓️", title: "Blockchain Verified", desc: "Immutable transaction ledger" },
              { icon: "✅", title: "Member Verification", desc: "Confirmed identities for trust" },
              { icon: "📊", title: "Real-Time Audit", desc: "Complete transparency in every cycle" },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 50}>
                <div className="group rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800/40 via-gray-900/20 to-black/40 backdrop-blur-xl p-6 sm:p-8 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-1 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h4 className="font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="relative rounded-3xl border border-gray-700/50 bg-gradient-to-r from-yellow-900/20 via-gray-900/40 to-yellow-900/20 backdrop-blur-xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden group">
              
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 rounded-3xl" />
              </div>
              
              <div className="relative space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                  Ready to Join the
                  <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-500 bg-clip-text text-transparent block">
                    CirclePay Community?
                  </span>
                </h2>
                
                <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                  Start your Ajo savings journey today. Secure, transparent, and guaranteed payouts await.
                </p>

                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="group relative inline-flex items-center justify-center rounded-xl px-8 sm:px-12 py-4 text-base sm:text-lg font-bold text-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-2xl hover:shadow-yellow-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Get Started Now
                    <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
                  </span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.3);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 204, 21, 0.5);
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          body {
            font-size: 16px;
          }

          h1 {
            font-size: 2.25rem;
          }

          h2 {
            font-size: 1.875rem;
          }
        }

        /* Touch-friendly interactions */
        @media (hover: none) and (pointer: coarse) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </main>
  );
}