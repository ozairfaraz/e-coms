import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

// Password strength calculator
function calculatePasswordStrength(password) {
  if (!password)
    return { score: 0, label: "No password", color: "bg-white/10" };

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

  if (score <= 2) {
    return { score: 1, label: "Weak", color: "bg-red-500" };
  } else if (score <= 4) {
    return { score: 2, label: "Fair", color: "bg-yellow-500" };
  } else if (score <= 6) {
    return { score: 3, label: "Good", color: "bg-blue-500" };
  } else {
    return { score: 4, label: "Strong", color: "bg-green-500" };
  }
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { handleResetPassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const isPasswordValid =
    password.length >= 8 && passwordStrength.score >= 2 && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 2) {
      setError("Password is too weak. Add uppercase, numbers, or symbols");
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new one");
      return;
    }

    setError("");
    setLoading(true);

    await handleResetPassword({ token, password });
    console.log("Reset password for token:", token);

    // Simulate success
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      navigate("/");
    }, 1500);
  };

  return (
    <AuthLayout
      heading={
        <>
          Your security
          <br />
          matters most.
        </>
      }
      subheading="Create a strong password to protect your account and get back to shopping."
    >
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full border border-[#F7931A]/30 bg-[#F7931A]/8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow" />
          <span className="font-mono text-xs text-[#F7931A] tracking-widest uppercase">
            Set New Password
          </span>
        </div>
        <h1 className="font-heading font-bold text-3xl text-white mb-2 leading-tight">
          Create a
          <br />
          <span className="text-gradient">strong password</span>
        </h1>
        <p className="text-[#94A3B8] text-sm">
          Need help?{" "}
          <Link
            to="/forgot-password"
            className="text-[#F7931A] hover:text-[#FFD600] transition-colors duration-200 font-medium"
          >
            Request a new link →
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#0F1115] border border-white/[0.08] rounded-2xl p-8 shadow-[0_0_50px_-15px_rgba(247,147,26,0.1)]">
        {!submitted ? (
          /* Password Reset Form */
          <form id="reset-password-form" onSubmit={handleSubmit} noValidate>
            {/* Instruction Box */}
            <div className="flex items-start gap-3 mb-6 p-4 rounded-xl border border-white/8 bg-white/[0.02]">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#EA580C]/15 border border-[#EA580C]/30 flex items-center justify-center mt-0.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F7931A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <p className="text-[#94A3B8] text-sm leading-relaxed">
                Choose a strong password with a mix of uppercase, lowercase,
                numbers, and symbols for maximum security.
              </p>
            </div>

            {/* New Password Field */}
            <div className="mb-6">
              <label
                htmlFor="new-password"
                className="block font-mono text-xs text-[#94A3B8] uppercase tracking-widest mb-2"
              >
                New Password
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
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M7 14a6 6 0 0 0-6 6v3h18v-3a6 6 0 0 0-6-6h-6z" />
                  </svg>
                </span>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={loading}
                  className={[
                    "w-full h-12 bg-black/50 pl-10 pr-12 text-white text-sm placeholder:text-white/25",
                    "rounded-lg border transition-all duration-200 outline-none font-body",
                    passwordFocused
                      ? "border-[#F7931A] shadow-[0_0_0_3px_rgba(247,147,26,0.12)]"
                      : "border-white/10 hover:border-white/25",
                    loading && "opacity-50 cursor-not-allowed",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[#94A3B8] uppercase tracking-widest">
                      Strength
                    </span>
                    <span
                      className={`font-mono text-xs font-semibold tracking-wider uppercase ${
                        passwordStrength.score <= 1
                          ? "text-red-400"
                          : passwordStrength.score === 2
                            ? "text-yellow-400"
                            : passwordStrength.score === 3
                              ? "text-blue-400"
                              : "text-green-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.score / 4) * 100}%`,
                      }}
                    />
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    <li className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          password.length >= 8 ? "bg-green-500" : "bg-white/20"
                        }`}
                      />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[A-Z]/.test(password)
                            ? "bg-green-500"
                            : "bg-white/20"
                        }`}
                      />
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[0-9]/.test(password)
                            ? "bg-green-500"
                            : "bg-white/20"
                        }`}
                      />
                      One number
                    </li>
                    <li className="flex items-center gap-2 text-xs text-[#94A3B8]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
                            ? "bg-green-500"
                            : "bg-white/20"
                        }`}
                      />
                      One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  disabled={loading}
                  className={[
                    "w-full h-12 bg-black/50 pl-10 pr-12 text-white text-sm placeholder:text-white/25",
                    "rounded-lg border transition-all duration-300 outline-none font-body",
                    confirmFocused
                      ? "border-[#F7931A] shadow-[0_0_0_3px_rgba(247,147,26,0.12)]"
                      : confirmPassword && !passwordsMatch
                        ? "border-red-500/50 hover:border-red-500"
                        : confirmPassword && passwordsMatch
                          ? "border-green-500/50 hover:border-green-500"
                          : "border-white/10 hover:border-white/25",
                    loading && "opacity-50 cursor-not-allowed",
                  ].join(" ")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {passwordsMatch ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="font-mono text-xs text-green-400">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className="font-mono text-xs text-red-400">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg border border-red-500/30 bg-red-500/10 flex items-start gap-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500 flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isPasswordValid || loading}
              className="w-full h-12 rounded-full font-body font-semibold text-sm text-white tracking-wider uppercase
                         bg-gradient-to-r from-[#EA580C] to-[#F7931A]
                         shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                         hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)]
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
                  Resetting Password...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Back Link */}
            <div className="mt-5 flex justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-[#94A3B8] hover:text-white transition-colors duration-200"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          /* Success State */
          <div className="text-center" role="status" aria-live="polite">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_40px_-8px_rgba(247,147,26,0.7)] animate-float">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="font-heading font-bold text-xl text-white mb-2">
              Password Reset Successfully
            </h2>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
              Your password has been securely updated. You can now sign in with
              your new password.
            </p>

            {/* Pulsing Dots */}
            <div className="flex items-center justify-center gap-1.5 mb-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#F7931A] animate-pulse-glow"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Sign In Button */}
            <Link
              to="/login"
              className="inline-flex h-12 px-8 rounded-full font-body font-semibold text-sm text-white tracking-wider uppercase
                         bg-gradient-to-r from-[#EA580C] to-[#F7931A]
                         shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                         hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)]
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 items-center justify-center"
            >
              Sign In Now
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
