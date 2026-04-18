import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { handleLogin,handleStartGoogleAuth } = useAuth();
  const navigate = useNavigate();

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
    console.log("logged in broskiiii");
    navigate("/");
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
      <div className="mb-4">
        <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow" />
          <span className="font-mono text-xs text-[#F7931A] tracking-widest uppercase">
            Welcome Back
          </span>
        </div>
        <h1 className="font-heading font-bold text-2xl text-white mb-1 leading-tight">
          Sign in to your
          <br />
          <span className="text-gradient">account</span>
        </h1>
        <p className="text-[#94A3B8] text-xs">
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
        className="bg-[#0F1115] border border-white/[0.08] rounded-2xl p-5 shadow-[0_0_50px_-15px_rgba(247,147,26,0.1)]"
        noValidate
      >
        {/* Email */}
        <div className="mb-3">
          <label
            htmlFor="login-email"
            className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-1"
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
        <div className="mb-1">
          <label
            htmlFor="login-password"
            className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-1"
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
        <div className="flex justify-end mb-3">
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
          className="w-full h-10 rounded-full font-body font-semibold text-xs text-white tracking-wider uppercase
                     bg-gradient-to-r from-[#EA580C] to-[#F7931A]
                     shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                     hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)]
                     hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-300"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="my-2 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[#94A3B8] font-mono uppercase tracking-widest">
            Or
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleStartGoogleAuth}
          className="w-full h-10 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-body font-semibold text-xs text-white tracking-wider uppercase
                     transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Terms */}
        <p className="mt-2 text-center text-xs text-[#94A3B8]/70 leading-relaxed">
          By signing in you agree to our{" "}
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
