import { UserRound } from "lucide-react";
import LoginForm from "./LoginForm";

import type { LoginProps } from "../../../interface/auth";

export type { LoginProps };

const Login = ({ loading, error, onSubmit }: LoginProps) => (
  <main className="grid min-h-screen w-full bg-white font-sans">
    <section
      className="grid min-h-screen w-full overflow-hidden bg-white md:grid-cols-2"
      aria-label="Partner portal login"
    >
      {/* Gradient Welcome Panel */}
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
                SRIBEƎS
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

        {/* Decorative gradient circles */}
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

          <h1 className="m-0 text-[clamp(34px,4vw,46px)] leading-[1.1]">
            Welcome back!
          </h1>

          <span className="my-[14px] block h-1 w-[50px] rounded-full bg-white" />

          <p className="m-0 text-base leading-[1.65] text-white/95">
            Sign in to manage your referrals, track your earnings, and grow your
            partner network.
          </p>
        </div>
      </div>

      {/* Login Form */}
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
          <div className="mb-8 text-center max-[720px]:mb-5">
            <div
              className="mx-auto mb-5 grid h-[76px] w-[76px] place-items-center rounded-full bg-gradient-to-br from-[#AD1457] to-[#F06292] text-white shadow-lg shadow-pink-200/50 max-[720px]:mb-3 max-[720px]:h-16 max-[720px]:w-16"
              aria-hidden="true"
            >
              <UserRound size={38} strokeWidth={1.8} />
            </div>

            <h2 className="m-0 text-[28px] text-[#2f3440] max-[720px]:text-[25px]">
              Partner Login
            </h2>
            <p className="text-sm text-[#9ba1ad]">
              Enter your details to continue
            </p>
          </div>
          <LoginForm loading={loading} error={error} onSubmit={onSubmit} />
        </div>
      </div>
    </section>
  </main>
);

export default Login;
