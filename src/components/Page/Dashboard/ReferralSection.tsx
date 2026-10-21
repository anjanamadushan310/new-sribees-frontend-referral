import React from "react";
import { ReferralBannerCard } from "../../Base";
import type { PartnerProfile } from "../../../api/partner.api";

export interface ReferralSectionProps {
  profile?: PartnerProfile;
  loading?: boolean;
  onCopy: () => void;
}

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
