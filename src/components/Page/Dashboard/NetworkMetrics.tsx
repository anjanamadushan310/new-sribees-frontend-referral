import React from "react";
import { Users, UserPlus, ShoppingBag } from "lucide-react";
import { SectionCard, StatCard } from "../../Base";
import type { NetworkMetricsProps } from "../../../interface/dashboard";

export type { NetworkMetricsProps };

const NetworkMetrics: React.FC<NetworkMetricsProps> = ({
  customers,
  recruits,
  totalReferrals,
  totalCustomers,
  totalTeamMembers,
}) => {
  const custCount = totalCustomers ?? customers?.length ?? 0;
  const teamCount = totalTeamMembers ?? recruits?.length ?? 0;
  const refCount = totalReferrals ?? custCount + teamCount;

  return (
    <SectionCard
      title="Network & Customer Metrics"
      icon={<Users className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <StatCard
            title="TOTAL REFERRAL"
            value={refCount}
            prefix=""
            precision={0}
            tagText="Active Links"
            leftIcon={<UserPlus className="h-5 w-5" />}
            icon={<UserPlus className="h-5 w-5" />}
            colorScheme="blue"
          />
        </div>
        <div>
          <StatCard
            title="TOTAL CUSTOMERS"
            value={custCount}
            prefix=""
            precision={0}
            tagText="Purchasing Clients"
            leftIcon={<ShoppingBag className="h-5 w-5" />}
            icon={<ShoppingBag className="h-5 w-5" />}
            colorScheme="purple"
          />
        </div>
        <div>
          <StatCard
            title="TOTAL TEAM MEMBERS"
            value={teamCount}
            prefix=""
            precision={0}
            tagText="Active Affiliates"
            leftIcon={<Users className="h-5 w-5" />}
            icon={<Users className="h-5 w-5" />}
            colorScheme="rose"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default NetworkMetrics;
