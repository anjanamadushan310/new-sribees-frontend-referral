import { Wallet, Users, ArrowUpRight } from "lucide-react";
import LoginForm from "./LoginForm";
import type { LoginProps } from "../../../interface/auth";

export type { LoginProps };

const Login = ({ loading, error, onSubmit }: LoginProps) => (
  <main className="min-h-screen bg-slate-50 font-sans">
    <section className="grid min-h-screen lg:grid-cols-2" aria-label="Partner portal login">
      <div className="hidden flex-col justify-between bg-[#8B1447] p-12 text-white lg:flex xl:p-20">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="SRIBEES Logo" className="h-12 w-12 rounded-xl bg-white p-1.5" />
          <span className="text-lg font-semibold">Sribees Online</span>
        </div>
        <div className="my-16 max-w-lg">
          <p className="mb-5 text-sm font-medium text-pink-200">Partner Portal</p>
          <h1 className="m-0 text-5xl font-semibold leading-tight tracking-tight">Your customers.<br />Your progress.</h1>
          <p className="mt-6 text-base leading-relaxed text-pink-100">Manage referrals and keep track of the earnings you build with Sribees.</p>
          <div className="mt-10 space-y-5 border-t border-white/20 pt-8 text-sm text-pink-100">
            <p className="flex items-center gap-3"><Users className="h-5 w-5" aria-hidden="true" />See the customers who joined with your code</p>
            <p className="flex items-center gap-3"><Wallet className="h-5 w-5" aria-hidden="true" />Review commissions and manage your Partner Wallet</p>
          </div>
        </div>
        <a href="mailto:support@sribeesonline.com" className="flex items-center gap-2 text-sm text-pink-100 hover:text-white">Contact support<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <img src="/logo.png" alt="Sribees Online" className="mb-10 h-12 w-12 rounded-xl lg:hidden" />
          <p className="mb-2 text-sm font-medium text-[#D81B60]">Sribees Online</p>
          <h2 className="m-0 text-3xl font-semibold tracking-tight text-slate-900">Partner Login</h2>
          <p className="mb-8 mt-3 text-sm leading-relaxed text-slate-500">Sign in with your Partner email and password.</p>
          <LoginForm loading={loading} error={error} onSubmit={onSubmit} />
          <p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">Newly approved Partner? Open your email or SMS invitation to set your password.</p>
          <a href="mailto:support@sribeesonline.com" className="mt-3 inline-block text-sm font-medium text-[#D81B60] lg:hidden">Contact support</a>
        </div>
      </div>
    </section>
  </main>
);

export default Login;
