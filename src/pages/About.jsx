export default function About() {
  return (
    <main className="min-h-screen pt-28 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 bg-black text-yellow-400 pb-16">

      {/* HERO */}
      <div className="text-center">

        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">
          About CirclePay
        </h1>

        <p className="mt-6 text-yellow-200 max-w-4xl mx-auto text-lg leading-8">
          <span className="font-semibold text-yellow-400">
            CirclePay
          </span>{" "}
          is a modern digital ajo and cooperative savings platform
          designed to help individuals save smarter, contribute together,
          and receive automated payouts securely.
          We simplify traditional ajo systems by allowing users
          to create or join trusted savings groups where contributions
          are managed transparently by the system.
        </p>

      </div>

      {/* FEATURES */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2">

        {/* FEATURE 1 */}
        <div className="rounded-3xl border border-yellow-400 bg-yellow-900/20 backdrop-blur-md p-7 flex flex-col gap-3 shadow-xl">

          <span className="text-yellow-400 font-semibold text-xl">
            Digital Ajo Contributions
          </span>

          <span className="text-yellow-200 leading-7">
            Contribute money daily, weekly, or monthly with your ajo group
            directly from anywhere. CirclePay automates the entire savings
            process for convenience and transparency.
          </span>

        </div>

        {/* FEATURE 2 */}
        <div className="rounded-3xl border border-yellow-400 bg-yellow-900/20 backdrop-blur-md p-7 flex flex-col gap-3 shadow-xl">

          <span className="text-yellow-400 font-semibold text-xl">
            Automated Payout Rotation
          </span>

          <span className="text-yellow-200 leading-7">
            Unlike traditional ajo handled manually by individuals,
            CirclePay securely manages payout distribution automatically,
            ensuring fairness, accuracy, and accountability for every member.
          </span>

        </div>

        {/* FEATURE 3 */}
        <div className="rounded-3xl border border-yellow-400 bg-yellow-900/20 backdrop-blur-md p-7 flex flex-col gap-3 shadow-xl">

          <span className="text-yellow-400 font-semibold text-xl">
            Create & Join Trusted Groups
          </span>

          <span className="text-yellow-200 leading-7">
            Easily create your own contribution group or join an existing
            one using a secure invite code. Control group size,
            contribution amount, and payout frequency.
          </span>

        </div>

        {/* FEATURE 4 */}
        <div className="rounded-3xl border border-yellow-400 bg-yellow-900/20 backdrop-blur-md p-7 flex flex-col gap-3 shadow-xl">

          <span className="text-yellow-400 font-semibold text-xl">
            Transparent Group Tracking
          </span>

          <span className="text-yellow-200 leading-7">
            Monitor all group activities, members, contributions,
            payout schedules, and savings progress in real time
            from your personalized CirclePay dashboard.
          </span>

        </div>

        {/* FEATURE 5 */}
        <div className="rounded-3xl border border-yellow-400 bg-yellow-900/20 backdrop-blur-md p-7 flex flex-col gap-3 shadow-xl">

          <span className="text-yellow-400 font-semibold text-xl">
            Secure Savings Experience
          </span>

          <span className="text-yellow-200 leading-7">
            Your savings and contributions are protected with
            advanced security systems, encrypted transactions,
            and reliable account management infrastructure.
          </span>

        </div>

        {/* FEATURE 6 */}
        <div className="rounded-3xl border border-yellow-400 bg-yellow-900/20 backdrop-blur-md p-7 flex flex-col gap-3 shadow-xl">

          <span className="text-yellow-400 font-semibold text-xl">
            Community Financial Growth
          </span>

          <span className="text-yellow-200 leading-7">
            CirclePay helps families, friends, businesses,
            and communities grow financially together through
            organized cooperative savings and trusted contribution cycles.
          </span>

        </div>

      </div>

      {/* WHY CHOOSE US */}
      <div className="mt-16 rounded-3xl border border-yellow-400 bg-gradient-to-br from-yellow-900/20 via-black to-yellow-800/20 p-10 shadow-2xl">

        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          Why People Choose CirclePay
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <div className="border border-yellow-500 rounded-2xl p-6 bg-black/50">

            <h3 className="text-2xl font-bold">
              Fast
            </h3>

            <p className="mt-3 text-yellow-200 leading-7">
              Join ajo groups, contribute money,
              and receive payouts quickly without
              physical meetings or manual tracking.
            </p>

          </div>

          <div className="border border-yellow-500 rounded-2xl p-6 bg-black/50">

            <h3 className="text-2xl font-bold">
              Reliable
            </h3>

            <p className="mt-3 text-yellow-200 leading-7">
              Automated systems reduce human errors,
              missed payouts, and fraudulent activities
              commonly found in traditional ajo systems.
            </p>

          </div>

          <div className="border border-yellow-500 rounded-2xl p-6 bg-black/50">

            <h3 className="text-2xl font-bold">
              Transparent
            </h3>

            <p className="mt-3 text-yellow-200 leading-7">
              Every contribution, payout,
              and group activity is visible and trackable
              for all participating members.
            </p>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-16 text-center text-yellow-300 text-base">

        <span className="font-semibold text-yellow-400">
          CirclePay
        </span>{" "}
        — Nigeria’s trusted digital ajo platform for secure
        contributions, cooperative savings, and automated payouts.

      </div>

    </main>
  );
}