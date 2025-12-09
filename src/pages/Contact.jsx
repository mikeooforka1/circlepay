import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);
    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError(data.message || "Failed to send message.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-28 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 bg-black text-yellow-400">
      <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-400">Contact Us</h1>
      <p className="mt-3 text-yellow-200">
        We'd love to hear from you. Fill the form and our team will get back to you soon.
      </p>
      <div className="mt-6 mb-8 bg-yellow-900 border border-yellow-400 rounded-xl p-4 text-yellow-300">
        <div>
          <span className="font-semibold">Customer Support (WhatsApp):</span> <a href="https://wa.me/2348143316441" className="underline text-yellow-400">08143316441</a>
        </div>
        <div className="mt-2">
          <span className="font-semibold">Support Email:</span> <a href="mailto:circlepay1605@gmail.com" className="underline text-yellow-400">circlepay1605@gmail.com</a>
        </div>
      </div>
      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <input
          name="name"
          className="rounded-xl bg-yellow-900 border border-yellow-400 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300 focus:ring-2 focus:ring-yellow-400"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          className="rounded-xl bg-yellow-900 border border-yellow-400 px-4 py-3 outline-none text-yellow-400 placeholder-yellow-300 focus:ring-2 focus:ring-yellow-400"
          placeholder="Email address"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          className="rounded-xl bg-yellow-900 border border-yellow-400 px-4 py-3 h-32 outline-none text-yellow-400 placeholder-yellow-300 focus:ring-2 focus:ring-yellow-400"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button
          className="rounded-xl px-5 py-3 font-semibold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-black w-fit shadow hover:from-yellow-500 hover:to-yellow-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send message"}
        </button>
        {sent && (
          <div className="mt-2 text-emerald-400 font-semibold">Message sent! Our team will reply soon.</div>
        )}
        {error && (
          <div className="mt-2 text-rose-400 font-semibold">{error}</div>
        )}
      </form>
    </main>
  );
}
