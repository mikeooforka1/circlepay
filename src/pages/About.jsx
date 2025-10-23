export default function About() {
  return (
    <main className="min-h-screen pt-28 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700">About CirclePay</h1>
      <p className="mt-4 text-slate-700 max-w-3xl text-lg">
        <span className="font-semibold text-cyan-500">CirclePay</span> is your gateway to effortless wealth growth in Nigeria. When you deposit funds, our platform intelligently invests your money across a diversified portfolio of leading Nigerian stocks. Through advanced strategies and real-time risk management, your capital is put to work—so you can watch it multiply over time, with no trading expertise required.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 flex flex-col gap-2">
          <span className="text-cyan-700 font-semibold text-lg">Smart Diversification</span>
          <span className="text-slate-700">
            Your funds are automatically allocated across top Nigerian sectors, balancing risk and maximizing potential returns.
          </span>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 flex flex-col gap-2">
          <span className="text-cyan-700 font-semibold text-lg">Secure & Transparent</span>
          <span className="text-slate-700">
            Your investments are protected with bank-grade security, transparent reporting, and trusted local partners.
          </span>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 flex flex-col gap-2">
          <span className="text-cyan-700 font-semibold text-lg">Automated Growth</span>
          <span className="text-slate-700">
            Sit back and relax—our algorithms monitor markets, reinvesting profits and optimizing your portfolio for consistent growth.
          </span>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 flex flex-col gap-2">
          <span className="text-cyan-700 font-semibold text-lg">Easy Withdrawals</span>
          <span className="text-slate-700">
            Access your multiplied funds anytime. Withdrawals are fast, simple, and always under your control.
          </span>
        </div>
      </div>
      <div className="mt-10 text-center text-blue-500 text-base">
        <span className="font-semibold text-cyan-500">CirclePay</span> — Where your money works for you.
      </div>
    </main>
  );
}
