import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState({});

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: dispatch login thunk
    await handleLogin({
      email: formData.email,
      password: formData.password,
    });
    console.log("Login payload:", formData);
    console.log("logged in broskiiii")
    navigate("/")
  };

  const inputClass = (name) =>
    [
      "w-full h-12 bg-black/50 px-4 text-white text-sm placeholder:text-white/25",
      "rounded-lg border transition-all duration-200 outline-none font-body",
      focused[name]
        ? "border-[#F7931A] shadow-[0_0_0_3px_rgba(247,147,26,0.12)]"
        : "border-white/10 hover:border-white/25",
    ].join(" ");

  return (
    <AuthLayout
      heading={
        <>
          Wear the future.
          <br />
          Shop premium threads.
        </>
      }
      subheading="Log in to discover exclusive drops, track your orders, and unlock member-only deals."
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow" />
          <span className="font-mono text-xs text-[#F7931A] tracking-widest uppercase">
            Welcome Back
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2 leading-tight">
          Sign in to your
          <br />
          <span className="text-gradient">account</span>
        </h1>
        <p className="text-[#94A3B8] text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-[#F7931A] hover:text-[#FFD600] transition-colors duration-200 font-medium"
          >
            Create one free →
          </Link>
        </p>
      </div>

      {/* Card */}
      <form
        id="login-form"
        onSubmit={handleSubmit}
        className="bg-[#0F1115] border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_50px_-15px_rgba(247,147,26,0.1)]"
        noValidate
      >
        {/* Email */}
        <div className="mb-5">
          <label
            htmlFor="login-email"
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
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, email: true }))}
              onBlur={() => setFocused((p) => ({ ...p, email: false }))}
              className={inputClass("email") + " pl-10"}
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label
            htmlFor="login-password"
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused((p) => ({ ...p, password: true }))}
              onBlur={() => setFocused((p) => ({ ...p, password: false }))}
              className={inputClass("password") + " pl-10 pr-11"}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F7931A] transition-colors duration-200 p-0.5"
            >
              {showPassword ? (
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

        {/* Forgot link */}
        <div className="flex justify-end mb-6">
          <Link
            to="/forgot-password"
            className="text-xs font-mono text-[#94A3B8] hover:text-[#F7931A] transition-colors duration-200 tracking-wide"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          className="w-full h-12 rounded-full font-body font-semibold text-sm text-white tracking-wider uppercase
                     bg-gradient-to-r from-[#EA580C] to-[#F7931A]
                     shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                     hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)]
                     hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-300"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/8" />
          <span className="font-mono text-xs text-white/30 tracking-widest uppercase">
            or
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* Social placeholder */}
        <button
          type="button"
          className="w-full h-11 rounded-full border border-white/10 text-white text-sm font-medium
                     hover:border-white/25 hover:bg-white/[0.04] transition-all duration-200 flex items-center justify-center gap-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M5.27 9.77A7.5 7.5 0 0 1 12 4.5c1.7 0 3.25.59 4.47 1.55L19.9 2.6A12 12 0 0 0 0 12c0 1.94.47 3.77 1.3 5.38l4-3.11a7.5 7.5 0 0 1-.03-4.5Z"
            />
            <path
              fill="#FBBC05"
              d="M12 22.5a12 12 0 0 0 8.32-3.31l-4.06-3.15A7.5 7.5 0 0 1 5.27 14.2l-4 3.11A12 12 0 0 0 12 22.5Z"
            />
            <path
              fill="#4285F4"
              d="M20.32 19.19A11.96 11.96 0 0 0 24 12c0-.78-.07-1.54-.21-2.25H12v4.5h6.73a5.75 5.75 0 0 1-2.47 3.79l4.06 3.15Z"
            />
            <path
              fill="#34A853"
              d="M5.27 14.23a7.5 7.5 0 0 1 0-4.46l-4-3.1A12 12 0 0 0 0 12c0 1.94.47 3.77 1.3 5.38l3.97-3.15Z"
            />
          </svg>
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  );
}
