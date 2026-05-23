const Icon = ({ path }) => (
  <svg
    width="16"
    height="16"
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
    <footer className="mt-10 border-t border-yellow-400 bg-black">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-yellow-400">
              CirclePay
            </h2>

            <p className="mt-2 text-sm text-yellow-200 leading-6">
              Digital ajo, cooperative savings and automated payouts.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">
              Features
            </h3>

            <ul className="space-y-2 text-sm text-yellow-200">
              <li className="flex items-center gap-2">
                <Icon path="M5 12h14" />
                Contributions
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M12 5v14" />
                Payouts
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M20 6L9 17l-5-5" />
                Savings Groups
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-2">
              Why CirclePay
            </h3>

            <ul className="space-y-2 text-sm text-yellow-200">
              <li className="flex items-center gap-2">
                <Icon path="M12 2v20" />
                Trusted
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M5 12l5 5L20 7" />
                Automated
              </li>

              <li className="flex items-center gap-2">
                <Icon path="M4 4h16v16H4z" />
                Secure
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-yellow-500/20 mt-5 pt-4">

          <p className="text-center text-xs text-yellow-300">
            © {new Date().getFullYear()} CirclePay. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}