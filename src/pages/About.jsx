export default function About() {
  return (
    <main className="min-h-screen pt-28 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 bg-black text-yellow-400">
      <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">About CirclePay</h1>
      <p className="mt-4 text-yellow-200 max-w-3xl text-lg">
        <span className="font-semibold text-yellow-400">CirclePay</span> is Nigeria’s trusted platform for buying mobile data, airtime, and making digital payments. We make it easy for everyone to stay connected, pay bills, and manage their finances—all in one secure, user-friendly app.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-yellow-400 bg-yellow-900 p-6 flex flex-col gap-2">
          <span className="text-yellow-400 font-semibold text-lg">Instant Data & Airtime</span>
          <span className="text-yellow-200">
            Purchase mobile data and airtime for all major networks (MTN, Airtel, Glo, 9mobile) in seconds, anytime, anywhere.
          </span>
        </div>
        <div className="rounded-2xl border border-yellow-400 bg-yellow-900 p-6 flex flex-col gap-2">
          <span className="text-yellow-400 font-semibold text-lg">Secure Digital Banking</span>
          <span className="text-yellow-200">
            Fund your wallet, transfer money, and pay bills with bank-level security and transparency.
          </span>
        </div>
        <div className="rounded-2xl border border-yellow-400 bg-yellow-900 p-6 flex flex-col gap-2">
          <span className="text-yellow-400 font-semibold text-lg">Rewards & Cashback</span>
          <span className="text-yellow-200">
            Enjoy bonuses, cashback, and special offers on every transaction. Earn more as you use CirclePay.
          </span>
        </div>
        <div className="rounded-2xl border border-yellow-400 bg-yellow-900 p-6 flex flex-col gap-2">
          <span className="text-yellow-400 font-semibold text-lg">24/7 Support</span>
          <span className="text-yellow-200">
            Our dedicated support team is always available to help you with any questions or issues, day or night.
          </span>
        </div>
      </div>
      <div className="mt-10 text-center text-yellow-400 text-base">
        <span className="font-semibold text-yellow-400">CirclePay</span> — Fast, secure, and reliable for all your digital payment needs.
      </div>
    </main>
  );
}
