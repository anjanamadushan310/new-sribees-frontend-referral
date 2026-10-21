import React from "react";
import { Copy } from "lucide-react";

export interface ReferralBannerCardProps {
  referralCode?: string;
  commissionText?: string;
  commissionPercent?: number;
  loading?: boolean;
  onCopy: () => void;
}

const ReferralBannerCard: React.FC<ReferralBannerCardProps> = ({
  referralCode,
  commissionText,
  commissionPercent,
  loading = false,
  onCopy,
}) => {
  if (loading) {
    return (
      <div className="mb-7 min-h-[149px] animate-pulse rounded-[17px] bg-gradient-to-r from-fuchsia-600/70 via-pink-600/70 to-rose-500/70 p-[22px] shadow-[0_10px_17px_rgba(190,24,93,.2)]" />
    );
  }

  return (
    <div className="mb-7 min-h-[149px] rounded-[17px] border-0 bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 p-[22px] shadow-[0_10px_17px_rgba(190,24,93,.2)] flex items-center justify-between gap-5 max-[800px]:flex-col max-[800px]:items-start">
      <div className="text-white">
        <span className="m-0 inline-flex items-center gap-1 rounded-full border-0 bg-white/25 px-3 py-[3px] text-xs font-bold text-white">
          <span>✣</span> Share &amp; Earn More
        </span>
        <h2 className="my-2 text-[21px] font-bold text-white tracking-tight">
          Your Personal Referral Link
        </h2>
        <p className="m-0 block max-w-[555px] text-[13px] text-white/90 leading-relaxed">
          {commissionText ??
            (commissionPercent !== undefined
              ? `Earn up to ${commissionPercent}% on selected products your customers buy.`
              : "Share your code with friends and team members to earn commissions on every successful order placed.")}
        </p>
      </div>

      <div className="flex items-center gap-[11px] rounded-[13px] border border-white/25 bg-white/15 p-[9px] pl-3 max-[800px]:w-full max-[800px]:flex-col max-[800px]:items-start">
        <span className="rounded-lg bg-white/20 px-[13px] py-2 text-xs text-white/85">
          Code:{" "}
          <strong className="ml-1 tracking-wider text-yellow-200">
            {referralCode ?? "—"}
          </strong>
        </span>
        <button
          type="button"
          className="inline-flex h-[38px] items-center gap-1.5 rounded-[9px] border-0 bg-white px-4 text-sm font-bold text-fuchsia-700 shadow-sm transition hover:bg-white/90 active:scale-95 cursor-pointer"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
          <span>Copy Link</span>
        </button>
      </div>
    </div>
  );
};

export default ReferralBannerCard;
