import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen pt-28 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <h1 className="text-5xl font-extrabold">404</h1>
        <p className="mt-3 text-white/70">Oops! Page not found.</p>
        <Link to="/" className="mt-6 inline-block rounded-full px-5 py-3 text-slate-900 font-semibold bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300">Go back home</Link>
      </div>
    </main>
  );
}
