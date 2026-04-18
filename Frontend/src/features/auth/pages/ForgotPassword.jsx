import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [email,     setEmail]     = useState("");
  const [focused,   setFocused]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // TODO: dispatch forgotPassword thunk
    console.log("Forgot password for:", email);
  };

  return (
    <AuthLayout
      heading={<>Security starts<br/>with you.</>}
      subheading="Forgotten passwords happen. Reset yours in seconds and get back to shopping."
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow" />
          <span className="font-mono text-xs text-[#F7931A] tracking-widest uppercase">Account Recovery</span>
        </div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2 leading-tight">
          Reset your<br />
          <span className="text-gradient">password</span>
        </h1>
        <p className="text-[#94A3B8] text-sm">
          Remember it after all?{" "}
          <Link
            to="/login"
            className="text-[#F7931A] hover:text-[#FFD600] transition-colors duration-200 font-medium"
          >
            Sign in →
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#0F1115] border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_50px_-15px_rgba(247,147,26,0.1)]">

        {!submitted ? (
          /* Step 1: Enter email */
          <form id="forgot-password-form" onSubmit={handleSubmit} noValidate>
            {/* Instruction */}
            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#EA580C]/15 border border-[#EA580C]/30 flex items-center justify-center mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F7931A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Enter the email address linked to your account. We&apos;ll send a reset link within seconds.
              </p>
            </div>

            {/* Email field */}
            <div className="mb-6">
              <label
                htmlFor="forgot-email"
                className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={()  => setFocused(false)}
                  className={[
                    "w-full h-12 bg-black/50 pl-10 pr-4 text-white text-sm placeholder:text-white/25",
                    "rounded-lg border transition-all duration-200 outline-none font-body",
                    focused
                      ? "border-[#F7931A] shadow-[0_0_0_3px_rgba(247,147,26,0.12)]"
                      : "border-white/10 hover:border-white/25",
                  ].join(" ")}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              id="forgot-password-submit"
              type="submit"
              className="w-full h-12 rounded-full font-body font-semibold text-sm text-white tracking-wider uppercase
                         bg-gradient-to-r from-[#EA580C] to-[#F7931A]
                         shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                         hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)]
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300"
            >
              Send Reset Link
            </button>

            {/* Back link */}
            <div className="mt-5 flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: Success state */
          <div className="text-center" role="status" aria-live="polite">
            {/* Success icon */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_40px_-8px_rgba(247,147,26,0.7)] animate-float">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <h2 className="font-heading font-bold text-xl text-white mb-2">Check your inbox</h2>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-1">
              We sent a reset link to
            </p>
            <p className="font-mono text-[#F7931A] text-sm mb-6 break-all">{email}</p>

            <p className="text-xs text-[#94A3B8]/70 leading-relaxed mb-6">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-[#F7931A]/90 hover:text-[#F7931A] transition-colors underline underline-offset-2"
              >
                try a different address
              </button>.
            </p>

            {/* Pulsing dots */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
