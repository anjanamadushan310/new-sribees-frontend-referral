import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import ForgotPasswordComponent from "../components/Page/ForgotPassword/ForgotPassword";
import type { ForgotPasswordStep } from "../interface/auth";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await partnerApi.forgotPassword(email.trim());
      setSuccessMessage(
        res?.message || "Verification code has been sent to your email address."
      );
      setCountdown(60);
      setStep("otp");
    } catch (err: any) {
      setError(
        err.response?.data?.detail?.error?.message ??
          err.response?.data?.message ??
          "Could not send verification code. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await partnerApi.verifyOtp(email.trim(), otp.trim());
      setSuccessMessage(
        res?.message || "OTP verified successfully. Please choose a new password."
      );
      setStep("reset");
    } catch (err: any) {
      setError(
        err.response?.data?.detail?.error?.message ??
          err.response?.data?.message ??
          "Invalid or expired OTP code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await partnerApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });
      setSuccessMessage(null);
      setStep("success");
    } catch (err: any) {
      setError(
        err.response?.data?.detail?.error?.message ??
          err.response?.data?.message ??
          "Could not reset password. Please try again or request a new OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await partnerApi.forgotPassword(email.trim());
      setSuccessMessage(
        res?.message || "A new verification code has been sent to your email."
      );
      setCountdown(60);
      setOtp("");
    } catch (err: any) {
      setError(
        err.response?.data?.detail?.error?.message ??
          err.response?.data?.message ??
          "Could not resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleNavigateToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <ForgotPasswordComponent
      step={step}
      email={email}
      setEmail={setEmail}
      otp={otp}
      setOtp={setOtp}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      loading={loading}
      error={error}
      successMessage={successMessage}
      countdown={countdown}
      onRequestOtp={handleRequestOtp}
      onVerifyOtp={handleVerifyOtp}
      onResetPassword={handleResetPassword}
      onResendOtp={handleResendOtp}
      onChangeEmail={handleChangeEmail}
      onNavigateToLogin={handleNavigateToLogin}
    />
  );
};

export default ForgotPassword;
