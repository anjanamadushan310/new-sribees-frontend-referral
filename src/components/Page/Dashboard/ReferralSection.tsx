import React from "react";
import { ReferralBannerCard } from "../../Base";
import type { ReferralSectionProps } from "../../../interface/dashboard";

export type { ReferralSectionProps };

const ReferralSection: React.FC<ReferralSectionProps> = ({
  profile,
  loading = false,
  onCopy,
}) => {
  return (
    <ReferralBannerCard
      referralCode={profile?.referralCode}
      commissionText={profile?.commissionText}
      commissionPercent={profile?.commissionPercent}
      loading={loading}
      onCopy={onCopy}
    />
  );
};

export default ReferralSection;
