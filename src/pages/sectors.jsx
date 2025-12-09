import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Service data for mobile data, airtime, and digital banking
const services = [
    {
        sector: "Mobile Data",
        items: [
            { name: "MTN Data", symbol: "MTN", price: "₦500", desc: "1GB, valid 30 days" },
            { name: "Airtel Data", symbol: "AIRTEL", price: "₦500", desc: "1GB, valid 30 days" },
            { name: "Glo Data", symbol: "GLO", price: "₦500", desc: "1GB, valid 30 days" },
            { name: "9mobile Data", symbol: "9MOBILE", price: "₦500", desc: "1GB, valid 30 days" },
        ],
        desc: "Affordable and fast mobile data bundles for all networks.",
        action: "Buy Data",
    },
    {
        sector: "Airtime Top-up",
        items: [
            { name: "MTN Airtime", symbol: "MTN", price: "₦100", desc: "Instant recharge" },
            { name: "Airtel Airtime", symbol: "AIRTEL", price: "₦100", desc: "Instant recharge" },
            { name: "Glo Airtime", symbol: "GLO", price: "₦100", desc: "Instant recharge" },
            { name: "9mobile Airtime", symbol: "9MOBILE", price: "₦100", desc: "Instant recharge" },
        ],
        desc: "Instant airtime recharge for all major Nigerian networks.",
        action: "Buy Airtime",
    },
    {
        sector: "Banking Services",
        items: [
            { name: "Fund Wallet", symbol: "WALLET", price: "", desc: "Add money to your wallet" },
            { name: "Transfer Money", symbol: "TRANSFER", price: "", desc: "Send money instantly" },
            { name: "Pay Bills", symbol: "BILLS", price: "", desc: "Settle utility bills" },
        ],
        desc: "Seamless wallet funding, transfers, and bill payments.",
        action: "Use Service",
    },
    {
        sector: "Utility Payments",
        items: [
            { name: "Electricity Bills", symbol: "ELECTRICITY", price: "", desc: "Pay for power" },
            { name: "Cable TV", symbol: "CABLE", price: "", desc: "Pay for TV subscriptions" },
            { name: "Internet Services", symbol: "INTERNET", price: "", desc: "Pay for broadband" },
        ],
        desc: "Pay for electricity, TV, and internet with ease.",
        action: "Pay Now",
    },
    {
        sector: "Rewards & Bonuses",
        items: [
            { name: "Cashback Offers", symbol: "CASHBACK", price: "", desc: "Earn on every purchase" },
            { name: "Referral Bonus", symbol: "REFERRAL", price: "", desc: "Invite friends, earn more" },
        ],
        desc: "Enjoy bonuses and rewards on every transaction.",
        action: "Learn More",
    },
    {
        sector: "Customer Support",
        items: [
            { name: "24/7 Support", symbol: "SUPPORT", price: "", desc: "Always available" },
            { name: "Live Chat", symbol: "CHAT", price: "", desc: "Chat with us" },
        ],
        desc: "Get help anytime with our dedicated support team.",
        action: "Contact",
    },
];

const ArrowRightCircle = (props) => (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M10 8l4 4-4 4" />
    </svg>
);

export default function Sectors() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Add this for communicating with dashboard modal
    const openFundWalletModal = () => {
        // Use a custom event to signal the dashboard to open the modal
        window.dispatchEvent(new CustomEvent("openFundWalletModal"));
    };

    const handleAction = (sector, symbol) => {
        const isAuthenticated = !!localStorage.getItem("token");
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        if (sector === "Mobile Data") {
            navigate(`/dashboard/data?network=${symbol}`);
        } else if (sector === "Airtime Top-up") {
            navigate(`/dashboard/airtime?network=${symbol}`);
        } else if (sector === "Banking Services") {
            navigate("/dashboard");
            setTimeout(openFundWalletModal, 300); // Give time for dashboard to mount
        } else if (sector === "Utility Payments") {
            navigate(`/dashboard/pay-bills`);
        } else if (sector === "Rewards & Bonuses") {
            navigate(`/dashboard/rewards`);
        } else if (sector === "Customer Support") {
            navigate(`/contact`);
        }
    };

    return (
        <main className="relative min-h-screen pt-28 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-black text-yellow-400">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center text-yellow-400">
                Our Services
            </h1>
            <p className="mt-3 text-yellow-200 max-w-2xl mx-auto text-center">
                Buy mobile data, recharge airtime, pay bills, and enjoy seamless digital
                banking—all in one place.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((cat) => (
                    <div
                        key={cat.sector}
                        className="group rounded-2xl border border-yellow-400 bg-black p-6 shadow transition-transform hover:-translate-y-1 hover:bg-yellow-900 flex flex-col h-full"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-base sm:text-lg font-semibold text-yellow-400">
                                {cat.sector}
                            </h3>
                        </div>
                        <p className="mt-2 text-yellow-200 text-sm">{cat.desc}</p>
                        <div className="mb-2 flex flex-col gap-2 mt-4">
                            {cat.items.map((item) => (
                                <div
                                    key={item.symbol + item.name}
                                    className="flex flex-col gap-2 bg-yellow-900 rounded-lg px-3 py-2 mb-1"
                                >
                                    <div className="flex flex-row items-center justify-between">
                                        <div>
                                            <span className="text-yellow-400 font-bold">{item.symbol}</span>
                                            <span className="ml-2 text-yellow-200 font-semibold">
                                                {item.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {item.price && (
                                                <span className="text-sm font-semibold text-yellow-200">
                                                    {item.price}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-yellow-300">{item.desc}</div>
                                    <button
                                        className="w-full sm:w-auto mt-2 inline-flex items-center justify-center px-3 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-semibold shadow hover:shadow-md transition"
                                        onClick={() => handleAction(cat.sector, item.symbol)}
                                    >
                                        {cat.action}{" "}
                                        <ArrowRightCircle className="ml-1" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-12 text-center text-yellow-400 text-base">
                <span className="font-semibold text-yellow-400">CirclePay</span> — Your trusted
                platform for data, airtime, and digital banking.
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
