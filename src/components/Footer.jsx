const Icon = ({ path }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

export default function Footer() {

  return (
    <footer className="mt-24 border-t border-yellow-400 bg-gradient-to-b from-transparent via-black to-black">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* BRAND */}
          <div>

            <h2 className="text-3xl font-extrabold text-yellow-400">
              CirclePay
            </h2>

            <p className="mt-4 text-yellow-200 leading-7">
              CirclePay is a modern digital ajo and cooperative savings
              platform that helps people save together, contribute securely,
              and receive automated payouts without stress.
            </p>

          </div>

          {/* FEATURES */}
          <div>

            <h3 className="text-xl font-bold text-yellow-400">
              Platform Features
            </h3>

            <ul className="mt-5 space-y-3 text-yellow-200">

              <li className="flex items-center gap-2">
                <Icon path="M5 12h14" />
                Digital Ajo Contributions
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M12 5v14" />
                Automated Group Payouts
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M20 6L9 17l-5-5" />
                Secure Savings Groups
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M3 12h18" />
                Transparent Contribution Tracking
              </li>

            </ul>

          </div>

          {/* COMMUNITY */}
          <div>

            <h3 className="text-xl font-bold text-yellow-400">
              Why CirclePay
            </h3>

            <ul className="mt-5 space-y-3 text-yellow-200">

              <li className="flex items-center gap-2">
                <Icon path="M12 2v20" />
                Trusted Cooperative Savings
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M5 12l5 5L20 7" />
                Fair Automated Distribution
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M12 20h9" />
                Group-Based Financial Growth
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M4 4h16v16H4z" />
                Safe & Transparent System
              </li>

            </ul>

          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-yellow-500/30 my-10"></div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">

          <p className="text-yellow-300 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CirclePay. All rights reserved.
          </p>

          <p className="text-yellow-200 text-sm text-center max-w-2xl">
            CirclePay helps individuals, families, friends,
            and communities grow financially through trusted
            digital ajo contributions, cooperative savings,
            and automated payout systems.
          </p>

        </div>

      </div>

    </footer>
  );
}