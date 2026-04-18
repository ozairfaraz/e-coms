import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth.js";

/* ── Password strength scorer ──────────────────────────────────── */
function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong", "Excellent"];
const STRENGTH_COLORS = [
  "",
  "bg-red-500",
  "bg-orange-400",
  "bg-amber-400",
  "bg-[#F7931A]",
  "bg-[#FFD600]",
];
const STRENGTH_TEXT = [
  "",
  "text-red-400",
  "text-orange-400",
  "text-amber-400",
  "text-[#F7931A]",
  "text-[#FFD600]",
];

export default function Register() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [focused, setFocused] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(
    () => scorePassword(formData.password),
    [formData.password],
  );
  const pwMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;
  const pwMismatch =
    formData.confirmPassword && formData.password !== formData.confirmPassword;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwMismatch) return;
    await handleRegister({
      email: formData.email,
      password: formData.password,
      fullname: formData.fullName,
    });

    setSubmitted(true);
    // Store email for verification page
    sessionStorage.setItem("registeredEmail", formData.email);
    console.log("Register payload:", formData);
    // Navigate to email verification page
    navigate("/verify-email");
  };

  const inputClass = (name, extra = "") =>
    [
      "w-full h-12 bg-black/50 px-4 text-white text-sm placeholder:text-white/25",
      "rounded-lg border transition-all duration-200 outline-none font-body",
      extra,
      focused[name]
        ? "border-[#F7931A] shadow-[0_0_0_3px_rgba(247,147,26,0.12)]"
        : "border-white/10 hover:border-white/25",
    ].join(" ");

  return (
    <AuthLayout
      heading={
        <>
          Your style.
          <br />
          Your identity.
        </>
      }
      subheading="Join thousands of fashion-forward shoppers. Create your account in seconds."
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow" />
          <span className="font-mono text-xs text-[#F7931A] tracking-widest uppercase">
            New Account
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2 leading-tight">
          Create your
          <br />
          <span className="text-gradient">free account</span>
        </h1>
        <p className="text-[#94A3B8] text-sm">
          Already have one?{" "}
          <Link
            to="/login"
            className="text-[#F7931A] hover:text-[#FFD600] transition-colors duration-200 font-medium"
          >
            Sign in →
          </Link>
        </p>
      </div>

      {/* Card */}
      <form
        id="register-form"
        onSubmit={handleSubmit}
        className="bg-[#0F1115] border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_50px_-15px_rgba(247,147,26,0.1)]"
        noValidate
      >
        {/* Full Name */}
        <div className="mb-5">
          <label
            htmlFor="register-fullname"
            className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="register-fullname"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, fullName: true }))}
              onBlur={() => setFocused((p) => ({ ...p, fullName: false }))}
              className={inputClass("fullName", "pl-10")}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="register-email"
            className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, email: true }))}
              onBlur={() => setFocused((p) => ({ ...p, email: false }))}
              className={inputClass("email", "pl-10")}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label
            htmlFor="register-password"
            className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-2"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="register-password"
              name="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, password: true }))}
              onBlur={() => setFocused((p) => ({ ...p, password: false }))}
              className={inputClass("password", "pl-10 pr-11")}
            />
            <button
              type="button"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F7931A] transition-colors duration-200 p-0.5"
            >
              {showPw ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Strength meter */}
        {formData.password && (
          <div className="mb-5">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((seg) => (
                <div
                  key={seg}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    strength >= seg ? STRENGTH_COLORS[strength] : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className={`text-xs font-mono ${STRENGTH_TEXT[strength]}`}>
              {STRENGTH_LABELS[strength]}
            </p>
          </div>
        )}

        {/* Confirm Password */}
        <div className="mb-6">
          <label
            htmlFor="register-confirm-password"
            className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-2"
          >
            Re-enter Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type={showCPw ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onFocus={() =>
                setFocused((p) => ({ ...p, confirmPassword: true }))
              }
              onBlur={() =>
                setFocused((p) => ({ ...p, confirmPassword: false }))
              }
              className={[
                inputClass("confirmPassword", "pl-10 pr-11"),
                pwMatch ? "!border-[#F7931A]" : "",
                pwMismatch ? "!border-red-500" : "",
              ].join(" ")}
            />
            <button
              type="button"
              aria-label={showCPw ? "Hide password" : "Show password"}
              onClick={() => setShowCPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F7931A] transition-colors duration-200 p-0.5"
            >
              {showCPw ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
          {pwMismatch && (
            <p className="mt-1.5 text-xs text-red-400 font-mono" role="alert">
              Passwords do not match
            </p>
          )}
          {pwMatch && (
            <p className="mt-1.5 text-xs text-[#F7931A] font-mono">
              ✓ Passwords match
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={!!pwMismatch}
          className="w-full h-12 rounded-full font-body font-semibold text-sm text-white tracking-wider uppercase
                     bg-gradient-to-r from-[#EA580C] to-[#F7931A]
                     shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                     hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)]
                     hover:scale-[1.02] active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100
                     transition-all duration-300"
        >
          {submitted ? "Creating account…" : "Create Account"}
        </button>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-[#94A3B8]/70 leading-relaxed">
          By creating an account you agree to our{" "}
          <a
            href="#"
            className="text-[#F7931A]/80 hover:text-[#F7931A] transition-colors"
          >
            Terms
          </a>{" "}
          &amp;{" "}
          <a
            href="#"
            className="text-[#F7931A]/80 hover:text-[#F7931A] transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  );
}
