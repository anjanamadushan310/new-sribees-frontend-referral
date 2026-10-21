import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import BaseButton from "../../Base/BaseButton";
import BaseInput from "../../Base/BaseInput";

import type { LoginFormProps } from "../../../interface/auth";

export type { LoginFormProps };

const LoginForm = ({ loading, error, onSubmit }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!email.trim() || !password) return;
    onSubmit({ email, password });
  };

  const emailError = touched && !email.trim() ? "Enter your email" : undefined;
  const passwordError =
    touched && !password ? "Enter your password" : undefined;

  return (
    <form className="w-full" onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          className="mb-[18px] rounded-[9px] border border-[#f3b9c0] bg-[#fff2f3] px-3.5 py-3 text-[13px] text-[#a83e4d]"
          role="alert"
        >
          {error}
        </div>
      )}
      <BaseInput
        label="Email"
        name="email"
        type="email"
        placeholder="E-mail Address"
        autoComplete="username"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        icon={<Mail size={18} strokeWidth={1.8} />}
        error={emailError}
      />
      <BaseInput
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        icon={<LockKeyhole size={18} strokeWidth={1.8} />}
        trailing={
          <button
            type="button"
            className="inline-flex cursor-pointer border-0 bg-transparent p-[3px] text-[#aeb6c2]"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((visible) => !visible)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        error={passwordError}
      />
      <div className="flex flex-col gap-[18px] max-[720px]:gap-3">
        <button
          type="button"
          className="self-end border-0 bg-transparent p-0 text-xs text-[#a3a9b3] hover:text-[#D81B60]"
        >
          Forgot your password?
        </button>
        <BaseButton
          className="h-12 w-full rounded-3xl border-0 bg-[#D81B60] font-bold uppercase tracking-[0.04em] text-white! shadow-[0_8px_18px_rgba(216,27,96,0.24)] transition hover:shadow-[0_10px_22px_rgba(216,27,96,0.34)] hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
          type="submit"
          loading={loading}
        >
          Sign in
        </BaseButton>
      </div>
    </form>
  );
};

export default LoginForm;
