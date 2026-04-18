import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { verifyEmail, resendVerificationEmail } from "../services/auth.api";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("pending"); // pending, loading, success, error, resending
  const [message, setMessage] = useState("");
  const [showResend, setShowResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const token = searchParams.get("token");

  // Handle resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setShowResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const verifyUserEmail = async (verificationToken) => {
    setStatus("loading");
    try {
      const response = await verifyEmail(verificationToken);
      setStatus("success");
      setMessage("Email verified successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message ||
          "Verification failed. Please try again.",
      );
      setShowResend(true);
    }
  };

  useEffect(() => {
    // If token is in URL, auto-verify
    if (token) {
      verifyUserEmail(token);
    } else {
      // Get email from sessionStorage (set during registration)
      const storedEmail = sessionStorage.getItem("registeredEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [token]);

  const handleResendEmail = async () => {
    if (!email) return;

    setStatus("resending");
    try {
      await resendVerificationEmail(email);
      setStatus("pending");
      setMessage("Verification email resent! Check your inbox.");
      setShowResend(false);
      setResendTimer(30); // Start 30-second countdown
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Failed to resend email. Try again.",
      );
      setShowResend(true);
    }
  };

  return (
    <AuthLayout
      heading={
        <>
          Check your
          <br />
          inbox.
        </>
      }
      subheading={
        status === "success"
          ? "Your email has been verified! Redirecting to login..."
          : "We sent a verification link to your email. Click it to verify your account."
      }
    >
      {/* Container */}
      <div className="flex flex-col items-center gap-8">
        {/* Animated Email Icon */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full border border-[#F7931A]/20"
            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
          />

          {/* Glow background */}
          <div className="absolute -inset-3 bg-gradient-to-br from-[#EA580C] to-[#F7931A] opacity-20 blur-2xl rounded-full" />

          {/* Icon container */}
          <div
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center shadow-[0_0_40px_-10px_rgba(234,88,12,0.6)]"
            style={
              status === "success"
                ? { animation: "bounce-in 0.6s ease-out forwards" }
                : {}
            }
          >
            {status === "loading" || status === "resending" ? (
              <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : status === "success" ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center space-y-2">
          {status === "success" ? (
            <p className="text-[#F7931A] font-mono text-sm tracking-wider uppercase">
              ✓ Email Verified
            </p>
          ) : status === "error" ? (
            <p className="text-red-400 font-mono text-sm tracking-wider uppercase">
              Verification Failed
            </p>
          ) : (
            <p className="text-[#FFD600] font-mono text-sm tracking-wider uppercase">
              Verifying Your Email
            </p>
          )}

          {message && (
            <p
              className={`text-sm leading-relaxed ${
                status === "success"
                  ? "text-[#F7931A]"
                  : status === "error"
                    ? "text-red-400"
                    : "text-[#94A3B8]"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Email Display */}
        {email && status !== "success" && (
          <div className="w-full px-6 py-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
            <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider mb-1">
              Verification Email
            </p>
            <p className="text-white break-all font-medium">{email}</p>
          </div>
        )}

        {/* Check Email Steps */}
        {status !== "success" && (
          <div className="w-full space-y-3">
            <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-wider">
              What to do:
            </p>
            <div className="space-y-2">
              {[
                "Check your inbox and spam folder",
                "Click the verification link in the email",
                "Your account will be activated instantly",
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#EA580C] to-[#F7931A] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resend Button */}
        {status !== "success" && (
          <div className="w-full space-y-3">
            <button
              onClick={() => handleResendEmail()}
              disabled={!showResend || status === "resending" || !email}
              className={`w-full h-12 rounded-full font-body font-semibold text-sm tracking-wider uppercase
                           transition-all duration-300
                           ${
                             showResend && status !== "resending" && email
                               ? "bg-gradient-to-r from-[#EA580C] to-[#F7931A] shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)] hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)] hover:scale-[1.02] active:scale-[0.98] text-white"
                               : "opacity-50 cursor-not-allowed text-white"
                           }`}
            >
              {status === "resending"
                ? "Sending..."
                : showResend
                  ? "Resend Verification Email"
                  : "Resend Email"}
            </button>

            {/* Timer Display */}
            {resendTimer > 0 && !showResend && (
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#FFD600] animate-spin"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="text-sm font-mono text-[#FFD600]">
                  Resend available in{" "}
                  <span className="font-bold text-base">{resendTimer}s</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Success Action */}
        {status === "success" && (
          <Link
            to="/login"
            className="w-full h-12 rounded-full font-body font-semibold text-sm text-white tracking-wider uppercase flex items-center justify-center
                       bg-gradient-to-r from-[#EA580C] to-[#F7931A] shadow-[0_0_20px_-5px_rgba(234,88,12,0.5)]
                       hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.7)] hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-300"
          >
            Go to Login
          </Link>
        )}

        {/* Back to Register */}
        {status === "error" && (
          <p className="text-center text-sm text-[#94A3B8]">
            Having trouble?{" "}
            <Link
              to="/register"
              className="text-[#F7931A] hover:text-[#FFD600] transition-colors font-medium"
            >
              Create a new account →
            </Link>
          </p>
        )}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          70% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </AuthLayout>
  );
}
