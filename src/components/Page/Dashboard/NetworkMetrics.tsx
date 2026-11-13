import React from "react";
import { Users, UserPlus } from "lucide-react";
import { SectionCard, StatCard } from "../../Base";
import type { NetworkMetricsProps } from "../../../interface/dashboard";

export type { NetworkMetricsProps };

const NetworkMetrics: React.FC<NetworkMetricsProps> = ({
  customers,
  recruits,
  totalCustomers,
  totalTeamMembers,
  isMasterPartner = false,
}) => (
  <SectionCard title="Your customers" icon={<Users className="h-5 w-5" />}>
    <div className={`grid gap-4 ${isMasterPartner ? "sm:grid-cols-2" : "grid-cols-1"}`}>
      <StatCard title="TOTAL CUSTOMERS" value={totalCustomers ?? customers?.length ?? 0} prefix="" tagText="Registered with your referral code" icon={<Users className="h-5 w-5" />} />
      {isMasterPartner && <StatCard title="TOTAL TEAM MEMBERS" value={totalTeamMembers ?? recruits?.length ?? 0} prefix="" tagText="Partners in your team" icon={<UserPlus className="h-5 w-5" />} />}
    </div>
  </SectionCard>
);

export default NetworkMetrics;
