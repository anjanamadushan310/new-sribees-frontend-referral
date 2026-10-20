import { UserRound } from "lucide-react";
import LoginForm from "./LoginForm";

interface LoginProps {
  loading: boolean;
  error: string | null;
  onSubmit: (values: { email: string; password: string }) => void;
}

const Login = ({ loading, error, onSubmit }: LoginProps) => (
  <main className="grid min-h-screen w-full bg-white font-sans">
    <section
      className="grid min-h-screen w-full overflow-hidden bg-white md:grid-cols-2"
      aria-label="Partner portal login"
    >
      {/* Gradient Welcome Panel */}
      <div className="relative hidden sm:flex items-center overflow-hidden bg-gradient-to-br from-[#D81B60] via-[#C2185B] to-[#880E4F] px-8 py-12 text-white md:px-[76px] md:py-16">
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
      <div className="flex min-w-0 flex-col justify-center px-7 py-10 md:px-[clamp(36px,7vw,90px)] md:py-[58px] max-[720px]:py-[42px] max-[720px]:px-7 max-[720px]:[grid-column:1/-1]">
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
          <p className="!-mt-4 text-sm text-[#9ba1ad]">
            Enter your details to continue
          </p>
        </div>

        <LoginForm loading={loading} error={error} onSubmit={onSubmit} />
      </div>
    </section>
  </main>
);

export default Login;
