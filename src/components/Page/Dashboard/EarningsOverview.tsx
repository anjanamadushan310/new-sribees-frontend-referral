import React from "react";
import { Wallet, Clock, CheckCircle2 } from "lucide-react";
import { SectionCard, StatCard } from "../../Base";
import type { EarningsOverviewProps } from "../../../interface/dashboard";

export type { EarningsOverviewProps };

const EarningsOverview: React.FC<EarningsOverviewProps> = ({ totals }) => {
  const totalEarnings =
    (totals?.pending ?? 0) +
    (totals?.claimable ?? 0) +
    (totals?.paid ?? 0);

  return (
    <SectionCard
      title="Earnings & Payout Overview"
      icon={<Wallet className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <StatCard
            title="TOTAL EARNINGS"
            value={totalEarnings}
            tagText="All-time commission"
            leftIcon={<Wallet className="h-5 w-5" />}
            icon={<span className="text-base font-bold leading-none">$</span>}
            colorScheme="rose"
          />
        </div>
        <div>
          <StatCard
            title="PENDING COMMISSIONS"
            value={totals?.pending ?? 0}
            tagText="Pending Payout"
            leftIcon={<Clock className="h-5 w-5" />}
            icon={<Clock className="h-5 w-5" />}
            colorScheme="orange"
          />
        </div>
        <div>
          <StatCard
            title="TOTAL PAID"
            value={totals?.paid ?? 0}
            tagText="Cleared & Processed"
            leftIcon={<CheckCircle2 className="h-5 w-5" />}
            icon={<CheckCircle2 className="h-5 w-5" />}
            colorScheme="emerald"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default EarningsOverview;
