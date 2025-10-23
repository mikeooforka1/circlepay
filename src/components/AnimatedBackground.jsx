export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/30 via-sky-500/30 to-indigo-500/30 blur-3xl animate-float" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-tr from-fuchsia-500/20 via-purple-500/20 to-violet-500/20 blur-3xl animate-float delay-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.06),transparent_40%)] animate-gradient" />
    </div>
  );
}
