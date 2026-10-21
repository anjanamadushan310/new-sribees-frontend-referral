import React from "react";
import { GitFork, Crown } from "lucide-react";
import { SectionCard, StatCard } from "../../Base";
import type { CommissionBreakdownProps } from "../../../interface/dashboard";

export type { CommissionBreakdownProps };

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
            leftIcon={<Crown className="h-5 w-5" />}
            icon={<Crown className="h-5 w-5" />}
            colorScheme="rose"
          />
        </div>
        <div>
          <StatCard
            title="LEVEL 02 EARNINGS"
            value={byLevel?.level2 ?? 0}
            tagText="Secondary Network"
            leftIcon={<GitFork className="h-5 w-5" />}
            icon={<GitFork className="h-5 w-5" />}
            colorScheme="purple"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default CommissionBreakdown;
