import React from "react";
import { GitFork, Crown } from "lucide-react";
import { SectionCard, StatCard } from "../../Base";
import type { CommissionBreakdownProps } from "../../../interface/dashboard";

export type { CommissionBreakdownProps };

const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({ byLevel, isMasterPartner = false }) => {
  return (
    <SectionCard
      title="Commission breakdown"
      icon={<GitFork className="h-5 w-5" />}
    >
      <div className={`grid grid-cols-1 gap-4 ${isMasterPartner ? "md:grid-cols-2" : ""}`}>
        <div>
          <StatCard
            title="CUSTOMER COMMISSION"
            value={byLevel?.level1 ?? 0}
            tagText="Direct customer orders"
            leftIcon={<Crown className="h-5 w-5" />}
            icon={<Crown className="h-5 w-5" />}
            colorScheme="rose"
          />
        </div>
        {isMasterPartner && <div>
          <StatCard
            title="PARTNER COMMISSION"
            value={byLevel?.level2 ?? 0}
            tagText="Directly assigned Partners’ customer commission"
            leftIcon={<GitFork className="h-5 w-5" />}
            icon={<GitFork className="h-5 w-5" />}
            colorScheme="purple"
          />
        </div>}
      </div>
    </SectionCard>
  );
};

export default CommissionBreakdown;
