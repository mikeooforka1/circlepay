export default function Contact() {
  return (
    <main className="min-h-screen pt-28 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-extrabold">Contact Us</h1>
      <p className="mt-3 text-white/70">We'd love to hear from you. Fill the form and our team will get back to you soon.</p>
      <form className="mt-8 grid gap-4">
        <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50" placeholder="Your name" />
        <input className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400/50" placeholder="Email address" type="email" />
        <textarea className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 h-32 outline-none focus:ring-2 focus:ring-cyan-400/50" placeholder="Message" />
        <button className="rounded-xl px-5 py-3 text-slate-900 font-semibold bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 w-fit">Send message</button>
      </form>
    </main>
  );
}
