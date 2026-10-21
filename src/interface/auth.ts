/**
 * Authentication and login interfaces and types.
 */

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  loading: boolean;
  error: string | null;
  onSubmit: (values: LoginFormValues) => void;
}

export interface LoginProps {
  loading: boolean;
  error: string | null;
  onSubmit: (values: LoginFormValues) => void;
}

export type ForgotPasswordStep = 'email' | 'otp' | 'reset' | 'success';

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ForgotPasswordProps {
  step: ForgotPasswordStep;
  email: string;
  setEmail: (email: string) => void;
  otp: string;
  setOtp: (otp: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  countdown: number;
  onRequestOtp: (e: React.FormEvent) => void;
  onVerifyOtp: (e: React.FormEvent) => void;
  onResetPassword: (e: React.FormEvent) => void;
  onResendOtp: () => void;
  onChangeEmail: () => void;
  onNavigateToLogin: () => void;
}

