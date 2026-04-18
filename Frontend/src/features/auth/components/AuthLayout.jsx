import { Link } from "react-router";

/**
 * AuthLayout — shared wrapper for Login / Register / ForgotPassword.
 * Left panel: Bitcoin DeFi brand hero with floating orb + ambient glows.
 * Right panel: form slot (children).
 */
export default function AuthLayout({ children, heading, subheading }) {
  return (
    <div className="min-h-screen flex font-body bg-[#030304]">

      {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />

        {/* Ambient radial blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#F7931A] opacity-[0.07] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#FFD600] opacity-[0.05] blur-[100px] pointer-events-none" />

        {/* Logo */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-3 group w-fit"
          aria-label="Go to homepage"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_20px_-4px_rgba(234,88,12,0.7)]">
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6l9 14 9-14-3-4Z" />
              <path d="M3 6h18" />
              <path d="m12 2 3 4H9l3-4Z" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl text-white tracking-tight group-hover:text-[#F7931A] transition-colors duration-200">
            E-Coms
          </span>
        </Link>

        {/* Central orb graphic */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1">
          {/* Orbiting rings */}
          <div
            className="absolute w-72 h-72 rounded-full border border-[#F7931A]/20"
            style={{ animation: "spin 14s linear infinite" }}
          />
          <div
            className="absolute w-52 h-52 rounded-full border border-[#FFD600]/15"
            style={{ animation: "spin 10s linear infinite reverse" }}
          />
          <div
            className="absolute w-36 h-36 rounded-full border border-[#EA580C]/25"
            style={{ animation: "spin 7s linear infinite" }}
          />

          {/* Core orb */}
          <div className="animate-float relative w-24 h-24 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] shadow-[0_0_60px_-10px_rgba(247,147,26,0.8)] flex items-center justify-center">
            <svg
              width="40" height="40" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6l9 14 9-14-3-4Z" />
              <path d="M3 6h18" />
              <path d="m12 2 3 4H9l3-4Z" />
            </svg>
          </div>

          {/* Floating stat cards */}
          <div
            className="absolute -top-4 -right-8 bg-[#0F1115]/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-0.5">Members</p>
            <p className="text-white font-medium">12,450+</p>
          </div>
          <div
            className="absolute -bottom-4 -left-10 bg-[#0F1115]/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5 font-mono text-sm"
            style={{ animation: "float 5s ease-in-out infinite 1s" }}
          >
            <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-0.5">Styles</p>
            <p className="text-gradient font-semibold">2,800+</p>
          </div>
        </div>

        {/* Bottom copy */}
        <div className="relative z-10">
          <h2 className="font-heading font-bold text-3xl leading-tight text-white mb-3">
            {heading}
          </h2>
          <p className="text-[#94A3B8] text-base leading-relaxed max-w-sm">
            {subheading}
          </p>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { icon: "🔒", label: "SSL Secured" },
              { icon: "⚡", label: "Instant Access" },
              { icon: "🛡️", label: "Privacy First" },
            ].map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-1.5 text-xs font-mono text-[#94A3B8]"
              >
                <span>{b.icon}</span>
                <span className="tracking-wide">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider glow line */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-[#F7931A]/30 to-transparent" />

      {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12 relative overflow-hidden">
        {/* Mobile logo */}
        <Link
          to="/"
          className="lg:hidden flex items-center gap-2.5 mb-10 group"
          aria-label="Go to homepage"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_16px_-4px_rgba(234,88,12,0.7)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2 3 6l9 14 9-14-3-4Z" /><path d="M3 6h18" /><path d="m12 2 3 4H9l3-4Z" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg text-white group-hover:text-[#F7931A] transition-colors">E-Coms</span>
        </Link>

        {/* Subtle mobile ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F7931A] opacity-[0.04] blur-[100px] pointer-events-none" />

        {/* Form card */}
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}
