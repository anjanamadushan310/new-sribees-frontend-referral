import React from "react";
import { Copy } from "lucide-react";

import type { ReferralBannerCardProps } from "../../interface/common";

export type { ReferralBannerCardProps };

const ReferralBannerCard: React.FC<ReferralBannerCardProps> = ({
  referralCode,
  commissionText,
  commissionPercent,
  loading = false,
  onCopy,
}) => {
  if (loading) {
    return (
      <div className="mb-7 min-h-[140px] animate-pulse rounded-2xl bg-slate-100 p-6 border border-slate-200" />
    );
  }

  return (
    <div className="relative mb-7 overflow-hidden rounded-2xl border border-rose-100/90 bg-gradient-to-br from-[#FFF5F8] via-white to-pink-50/40 p-6 shadow-[0_2px_12px_rgba(216,27,96,0.04)] flex items-center justify-between gap-6 max-[800px]:flex-col max-[800px]:items-start">
      {/* Decorative subtle ambient soft glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-pink-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-rose-100/30 blur-3xl" />

      <div className="relative z-[1]">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-200/80 bg-pink-100/70 px-3 py-0.5 text-xs font-semibold text-[#A51F60]">
          <span>✦</span> Referral Program
        </div>
        <h2 className="my-2 text-xl font-bold text-slate-900 tracking-tight">
          Your Personal Referral Code
        </h2>
        <p className="m-0 max-w-[580px] text-sm text-slate-600 leading-relaxed">
          {commissionText ??
            (commissionPercent !== undefined
              ? `Earn up to ${commissionPercent}% on selected products your customers buy.`
              : "Share your code with friends and team members to earn commissions on every successful order placed.")}
        </p>
      </div>

      <div className="relative z-[1] flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1.5 pl-3.5 shadow-sm max-[800px]:w-full max-[800px]:justify-between">
        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
          Code:{" "}
          <strong className="ml-1 font-mono text-sm font-bold tracking-wider text-[#A51F60]">
            {referralCode ?? "—"}
          </strong>
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#A51F60] to-[#880E4F] px-4 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 active:scale-95 cursor-pointer whitespace-nowrap"
          onClick={onCopy}
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy Code</span>
        </button>
      </div>
    </div>
  );
};

export default ReferralBannerCard;
