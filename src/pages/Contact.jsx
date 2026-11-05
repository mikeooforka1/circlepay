import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "296c4e80-0b5c-417a-bee2-72a2ecd42bdd",
          subject: `New CirclePay Contact Message from ${form.name}`,
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0d14] via-black to-[#0a0d14] text-yellow-400 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-300 text-xs font-bold uppercase tracking-wider">
            Help & Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-300 mt-3 tracking-tight">
            Contact Us
          </h1>
          <p className="mt-2 text-yellow-200/70 text-sm sm:text-base max-w-md mx-auto">
            We'd love to hear from you. Fill out the form below or reach our support channels directly.
          </p>
        </div>

        {/* Quick Contact Card */}
        <div className="mb-8 rounded-2xl bg-black/60 border border-yellow-400/30 p-5 sm:p-6 backdrop-blur-md shadow-xl grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-lg flex-shrink-0">
              💬
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-yellow-200/60">
                Customer Support (WhatsApp)
              </p>
              <a
                href="https://wa.me/2348143316441"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-yellow-400 hover:text-yellow-300 hover:underline"
              >
                08143316441
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-lg flex-shrink-0">
              ✉️
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-yellow-200/60">
                Support Email
              </p>
              <a
                href="mailto:circlepay1605@gmail.com"
                className="text-sm font-bold text-yellow-400 hover:text-yellow-300 hover:underline break-all"
              >
                circlepay1605@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-yellow-400/40 bg-gradient-to-br from-yellow-950/20 via-black to-yellow-950/10 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                name="name"
                className="w-full rounded-xl bg-black/60 border border-yellow-400/30 px-4 py-3.5 outline-none text-yellow-200 placeholder-yellow-200/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                placeholder="e.g. Michael Oforka"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                className="w-full rounded-xl bg-black/60 border border-yellow-400/30 px-4 py-3.5 outline-none text-yellow-200 placeholder-yellow-200/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-yellow-300 uppercase tracking-wider mb-2">
                Message
              </label>
              <textarea
                name="message"
                className="w-full rounded-xl bg-black/60 border border-yellow-400/30 px-4 py-3.5 h-36 outline-none text-yellow-200 placeholder-yellow-200/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition resize-none"
                placeholder="How can we help you today?"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-black shadow-lg hover:shadow-yellow-400/20 hover:from-yellow-300 hover:to-amber-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-1"
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>

            {sent && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-center font-semibold text-sm">
                ✓ Message sent successfully! Our team will reply shortly.
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-center font-semibold text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}