const Icon = ({path}) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-yellow-400 bg-gradient-to-b from-transparent to-black shadow-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-yellow-400 text-base font-semibold tracking-wide text-center">
            © {new Date().getFullYear()} CirclePay. All rights reserved.
          </p>
          <p className="text-yellow-200 text-sm text-center max-w-xl">
            CirclePay is your trusted digital banking platform for Nigeria. Buy airtime and data, transfer money, pay bills, and manage your finances securely and seamlessly—all in one place.
          </p>
        </div>
      </div>
    </footer>
  );
}
