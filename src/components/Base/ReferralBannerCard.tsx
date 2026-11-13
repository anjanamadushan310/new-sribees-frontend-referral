import React from "react";
import { Copy, Share2 } from "lucide-react";
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
    return <div role="status" aria-label="Loading referral code" className="mb-6 min-h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />;
  }

  return (
    <section className="mb-6 flex flex-col justify-between gap-6 rounded-2xl border border-pink-100 bg-white p-5 sm:flex-row sm:items-center sm:p-7">
      <div className="max-w-xl">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#D81B60]">
          <Share2 className="h-4 w-4" aria-hidden="true" />Your referral code
        </div>
        <h2 className="m-0 text-xl font-semibold tracking-tight text-slate-900">Share Sribees. Grow your earnings.</h2>
        <p className="mb-0 mt-2 text-sm leading-relaxed text-slate-500">
          {commissionText ?? (commissionPercent !== undefined
            ? `Earn up to ${commissionPercent}% on selected products your customers buy.`
            : "Share your code with customers. Check your Ledger for commissions on eligible orders.")}
        </p>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-5 rounded-xl bg-pink-50 p-3 sm:p-4">
        <strong className="font-mono text-xl tracking-widest text-[#88113e]">{referralCode ?? "—"}</strong>
        <button type="button" onClick={onCopy} disabled={!referralCode} aria-label="Copy code" title="Copy code" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#D81B60] px-4 text-sm font-semibold text-white hover:bg-[#b41650]">
          <Copy className="h-4 w-4" aria-hidden="true" />Copy Code
        </button>
      </div>
    </section>
  );
};

export default ReferralBannerCard;
