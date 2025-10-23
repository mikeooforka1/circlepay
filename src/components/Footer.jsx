const Icon = ({path}) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-blue-100 bg-gradient-to-b from-transparent to-white shadow-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-blue-700 text-base font-semibold tracking-wide text-center">
            © {new Date().getFullYear()} CirclePay. All rights reserved.
          </p>
          <p className="text-blue-500 text-sm text-center max-w-xl">
            CirclePay is your trusted platform to invest in Nigeria’s leading stocks across banking, telecoms, consumer goods, oil & gas, and more. Seamless, secure, and transparent investing for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
