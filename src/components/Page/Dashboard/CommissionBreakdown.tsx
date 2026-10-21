import React from "react";
import { GitFork, Crown } from "lucide-react";
import { SectionCard, StatCard } from "../../Base";
import type { PartnerProfile } from "../../../api/partner.api";

export interface CommissionBreakdownProps {
  byLevel?: PartnerProfile["byLevel"];
}

const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({ byLevel }) => {
  return (
    <SectionCard
      title="Commission Level Breakdown"
      icon={<GitFork className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <StatCard
            title="LEVEL 01 EARNINGS"
            value={byLevel?.level1 ?? 0}
            tagText="Direct Referrals"
            icon={<Crown className="h-6 w-6" />}
            gradientClass="bg-gradient-to-br from-fuchsia-600 to-pink-500"
          />
        </div>
        <div>
          <StatCard
            title="LEVEL 02 EARNINGS"
            value={byLevel?.level2 ?? 0}
            tagText="Secondary Network"
            icon={<GitFork className="h-6 w-6" />}
            gradientClass="bg-gradient-to-br from-purple-600 to-indigo-500"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default CommissionBreakdown;
