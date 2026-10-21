import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  KeyRound,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import BaseButton from "../../Base/BaseButton";
import BaseInput from "../../Base/BaseInput";
import type { ForgotPasswordProps } from "../../../interface/auth";

export const ForgotPasswordComponent: React.FC<ForgotPasswordProps> = ({
  step,
  email,
  setEmail,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
  successMessage,
  countdown,
  onRequestOtp,
  onVerifyOtp,
  onResetPassword,
  onResendOtp,
  onChangeEmail,
  onNavigateToLogin,
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // OTP 6-box input management
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const otpDigits = (otp.padEnd(6, " ").slice(0, 6)).split("");

  const handleOtpDigitChange = (index: number, val: string) => {
    // Only accept numeric characters
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) {
      // User erased
      const newOtp = otp.split("");
      newOtp[index] = "";
      setOtp(newOtp.join(""));
      return;
    }

    // Single digit entry
    const char = cleanVal[cleanVal.length - 1];
    const chars = otp.split("");
    while (chars.length < 6) chars.push("");
    chars[index] = char;
    const updated = chars.slice(0, 6).join("");
    setOtp(updated);

    // Auto focus next box
    if (index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().replace(/\D/g, "").slice(0, 6);
    if (pasteData) {
      setOtp(pasteData);
      const nextFocus = Math.min(pasteData.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
    }
  };

  // Focus first OTP field when entering step 2
  useEffect(() => {
    if (step === "otp") {
      otpInputsRef.current[0]?.focus();
    }
  }, [step]);

  const emailError =
    emailTouched && !email.trim()
      ? "Please enter your email address"
      : emailTouched && !/\S+@\S+\.\S+/.test(email)
      ? "Please enter a valid email address"
      : undefined;

  const passwordError =
    passwordTouched && !newPassword
      ? "Enter a new password"
      : passwordTouched && newPassword.length < 8
      ? "Password must be at least 8 characters"
      : undefined;

  const confirmPasswordError =
    passwordTouched && !confirmPassword
      ? "Confirm your password"
      : passwordTouched && newPassword !== confirmPassword
      ? "Passwords do not match"
      : undefined;

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <main className="grid min-h-screen w-full bg-white font-sans">
      <section
        className="grid min-h-screen w-full overflow-hidden bg-white md:grid-cols-2"
        aria-label="Forgot Password"
      >
        {/* Left Gradient Panel */}
        <div className="relative hidden sm:flex items-center overflow-hidden bg-gradient-to-br from-[#D81B60] via-[#C2185B] to-[#880E4F] px-8 py-12 text-white md:px-[76px] md:py-16">
          {/* Brand Logo in top-left corner */}
          <div className="absolute top-8 left-8 md:top-10 md:left-12 z-20 flex items-center gap-3 select-none">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white p-1.5 shadow-md shadow-black/15 ring-1 ring-white/30 shrink-0 transition-transform duration-200 hover:scale-105">
              <img
                src="/logo.png"
                alt="SRIBEES Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-extrabold text-[17px] tracking-tight leading-tight italic">
                  SRIBƎES
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-bold uppercase tracking-wider text-pink-100 border border-white/20 leading-none">
                  Partner
                </span>
              </div>
              <span className="text-[11px] font-medium text-pink-200/80 tracking-wide leading-tight mt-0.5">
                Affiliate Portal
              </span>
            </div>
          </div>

          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#FF80AB]/30 blur-3xl" />

          {/* Smooth Organic Wave */}
          <div
            className="absolute inset-y-0 right-0 z-[1] h-full w-[130px] md:w-[170px]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 170 800"
              preserveAspectRatio="none"
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="
                  M 170 0
                  L 80 0
                  C 45 65, 105 115, 65 180
                  C 20 245, 5 285, 65 335
                  C 105 370, 150 390, 155 445
                  C 165 510, 100 550, 75 600
                  C 45 660, 75 720, 105 800
                  L 170 800
                  Z
              "
                fill="white"
              />
            </svg>
          </div>

          <div className="relative z-10 max-w-90">
            <p className="mb-7 text-[13px] font-bold tracking-[0.2em]">
              SRIBEES PARTNERS
            </p>

            <h1 className="m-0 text-[clamp(32px,3.8vw,44px)] leading-[1.15]">
              Account Recovery
            </h1>

            <span className="my-[14px] block h-1 w-[50px] rounded-full bg-white" />

            <p className="m-0 text-base leading-[1.65] text-white/95">
              Securely reset your password using a one-time verification code sent
              directly to your registered email address.
            </p>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="relative flex min-w-0 flex-col justify-center px-7 py-10 md:px-[clamp(36px,7vw,90px)] md:py-[58px] max-[720px]:py-[42px] max-[720px]:px-7 max-[720px]:[grid-column:1/-1]">
          {/* Mobile top-left logo */}
          <div className="sm:hidden absolute top-4 left-6 flex items-center gap-2 select-none">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 p-1 shadow-xs border border-pink-100 shrink-0">
              <img
                src="/logo.png"
                alt="SRIBEES Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[#880E4F] font-extrabold text-[15px] tracking-tight leading-tight italic">
                  SRIBƎES
                </span>
                <span className="inline-flex items-center px-1 py-0.2 rounded bg-pink-100 text-[9px] font-bold uppercase tracking-wider text-[#880E4F] leading-none">
                  Partner
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[420px] mx-auto">
          {/* Step Indicator */}
          {step !== "success" && (
            <div className="mx-auto mb-8 flex items-center justify-center gap-3">
              {[
                { key: "email", label: "Email", num: 1 },
                { key: "otp", label: "OTP", num: 2 },
                { key: "reset", label: "Password", num: 3 },
              ].map((s, idx) => {
                const isCurrent = step === s.key;
                const isPassed =
                  (s.key === "email" && (step === "otp" || step === "reset")) ||
                  (s.key === "otp" && step === "reset");

                return (
                  <React.Fragment key={s.key}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isCurrent
                            ? "bg-[#D81B60] text-white shadow-md shadow-pink-300"
                            : isPassed
                            ? "bg-[#2e7d32] text-white"
                            : "bg-[#e5e9f0] text-[#717b8c]"
                        }`}
                      >
                        {isPassed ? "✓" : s.num}
                      </div>
                      <span
                        className={`hidden text-xs font-semibold sm:inline ${
                          isCurrent
                            ? "text-[#D81B60]"
                            : isPassed
                            ? "text-[#2e7d32]"
                            : "text-[#8c94a0]"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 2 && (
                      <div
                        className={`h-[2px] w-8 transition-colors ${
                          isPassed ? "bg-[#2e7d32]" : "bg-[#e5e9f0]"
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Header Icon & Title */}
          <div className="mb-6 text-center max-[720px]:mb-4">
            <div
              className="mx-auto mb-4 grid h-[72px] w-[72px] place-items-center rounded-full bg-gradient-to-br from-[#AD1457] to-[#F06292] text-white shadow-lg shadow-pink-200/50 max-[720px]:mb-3 max-[720px]:h-14 max-[720px]:w-14"
              aria-hidden="true"
            >
              {step === "email" && <KeyRound size={34} strokeWidth={1.8} />}
              {step === "otp" && <ShieldCheck size={34} strokeWidth={1.8} />}
              {step === "reset" && <LockKeyhole size={34} strokeWidth={1.8} />}
              {step === "success" && <CheckCircle2 size={36} strokeWidth={2} />}
            </div>

            <h2 className="m-0 text-[26px] font-bold text-[#2f3440] max-[720px]:text-[23px]">
              {step === "email" && "Forgot Password?"}
              {step === "otp" && "Enter Verification Code"}
              {step === "reset" && "Create New Password"}
              {step === "success" && "Password Reset Complete!"}
            </h2>

            <p className="mt-1 text-sm text-[#9ba1ad]">
              {step === "email" &&
                "Enter your registered email to receive a 6-digit OTP code"}
              {step === "otp" && (
                <span>
                  We've sent a 6-digit code to{" "}
                  <strong className="text-[#3a404b]">{email}</strong>
                </span>
              )}
              {step === "reset" &&
                "Enter your new password below to secure your account"}
              {step === "success" &&
                "Your password has been reset successfully. You can now log in."}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div
              className="mb-[18px] rounded-[9px] border border-[#f3b9c0] bg-[#fff2f3] px-3.5 py-3 text-[13px] text-[#a83e4d]"
              role="alert"
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              className="mb-[18px] rounded-[9px] border border-[#a5d6a7] bg-[#edf7ed] px-3.5 py-3 text-[13px] text-[#1e4620]"
              role="status"
            >
              {successMessage}
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === "email" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmailTouched(true);
                if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return;
                onRequestOtp(e);
              }}
              noValidate
            >
              <BaseInput
                label="Email"
                name="email"
                type="email"
                placeholder="E-mail Address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={18} strokeWidth={1.8} />}
                error={emailError}
              />

              <div className="flex flex-col gap-4">
                <BaseButton
                  className="h-12 w-full rounded-3xl border-0 bg-[#D81B60] font-bold uppercase tracking-[0.04em] text-white! shadow-[0_8px_18px_rgba(216,27,96,0.24)] transition hover:shadow-[0_10px_22px_rgba(216,27,96,0.34)] hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                  type="submit"
                  loading={loading}
                  loadingText="Sending OTP..."
                >
                  Send OTP Code
                </BaseButton>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a92a1] transition hover:text-[#D81B60]"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {step === "otp" && (
            <form onSubmit={onVerifyOtp} noValidate>
              <div className="mb-6">
                <label className="mb-2 block text-center text-xs font-bold uppercase tracking-wider text-[#697282]">
                  6-Digit OTP Code
                </label>
                <div
                  className="flex justify-center gap-2 sm:gap-3"
                  onPaste={handleOtpPaste}
                >
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      data-testid={`otp-input-${idx}`}
                      className="h-12 w-11 rounded-lg border-2 border-[#e2e8f0] bg-[#f8fafc] text-center text-xl font-bold text-[#2d3748] transition outline-none focus:border-[#D81B60] focus:bg-white focus:ring-4 focus:ring-[#D81B60]/15 max-[400px]:h-11 max-[400px]:w-9"
                      value={otpDigits[idx].trim()}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend & Change Email controls */}
              <div className="mb-6 flex flex-col items-center justify-between gap-2 text-xs sm:flex-row">
                <button
                  type="button"
                  onClick={onChangeEmail}
                  className="border-0 bg-transparent text-[#7e8795] underline underline-offset-2 transition hover:text-[#D81B60]"
                >
                  Change email address
                </button>

                {countdown > 0 ? (
                  <span className="text-[#9ba1ad]">
                    Resend OTP in{" "}
                    <strong className="text-[#D81B60]">
                      {formatCountdown(countdown)}
                    </strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={loading}
                    className="inline-flex items-center gap-1 border-0 bg-transparent font-semibold text-[#D81B60] transition hover:brightness-90 disabled:opacity-50"
                  >
                    <RotateCcw size={13} /> Resend OTP
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <BaseButton
                  className="h-12 w-full rounded-3xl border-0 bg-[#D81B60] font-bold uppercase tracking-[0.04em] text-white! shadow-[0_8px_18px_rgba(216,27,96,0.24)] transition hover:shadow-[0_10px_22px_rgba(216,27,96,0.34)] hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                  type="submit"
                  loading={loading}
                  loadingText="Verifying..."
                  disabled={otp.length !== 6}
                >
                  Verify Code
                </BaseButton>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a92a1] transition hover:text-[#D81B60]"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === "reset" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPasswordTouched(true);
                if (
                  !newPassword ||
                  newPassword.length < 8 ||
                  newPassword !== confirmPassword
                ) {
                  return;
                }
                onResetPassword(e);
              }}
              noValidate
            >
              <BaseInput
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password (min 8 characters)"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                icon={<LockKeyhole size={18} strokeWidth={1.8} />}
                trailing={
                  <button
                    type="button"
                    className="inline-flex cursor-pointer border-0 bg-transparent p-[3px] text-[#aeb6c2]"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowNewPassword((v) => !v)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={passwordError}
              />

              <BaseInput
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<LockKeyhole size={18} strokeWidth={1.8} />}
                trailing={
                  <button
                    type="button"
                    className="inline-flex cursor-pointer border-0 bg-transparent p-[3px] text-[#aeb6c2]"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                }
                error={confirmPasswordError}
              />

              <div className="flex flex-col gap-4">
                <BaseButton
                  className="h-12 w-full rounded-3xl border-0 bg-[#D81B60] font-bold uppercase tracking-[0.04em] text-white! shadow-[0_8px_18px_rgba(216,27,96,0.24)] transition hover:shadow-[0_10px_22px_rgba(216,27,96,0.34)] hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                  type="submit"
                  loading={loading}
                  loadingText="Resetting..."
                >
                  Reset Password
                </BaseButton>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8a92a1] transition hover:text-[#D81B60]"
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </div>
            </form>
          )}

          {/* Step 4: Success View */}
          {step === "success" && (
            <div className="text-center">
              <BaseButton
                className="h-12 w-full rounded-3xl border-0 bg-[#D81B60] font-bold uppercase tracking-[0.04em] text-white! shadow-[0_8px_18px_rgba(216,27,96,0.24)] transition hover:shadow-[0_10px_22px_rgba(216,27,96,0.34)] hover:brightness-110"
                onClick={onNavigateToLogin}
              >
                Sign In Now
              </BaseButton>
            </div>
          )}
        </div>
      </div>
      </section>
    </main>
  );
};

export default ForgotPasswordComponent;
