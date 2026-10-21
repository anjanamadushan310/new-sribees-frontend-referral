import React from "react";
import { Wallet, DollarSign, Clock, CheckCircle2 } from "lucide-react";
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
            icon={<DollarSign className="h-6 w-6" />}
            gradientClass="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
        </div>
        <div>
          <StatCard
            title="PENDING COMMISSIONS"
            value={totals?.pending ?? 0}
            tagText="Pending Payout"
            icon={<Clock className="h-6 w-6" />}
            gradientClass="bg-gradient-to-br from-amber-500 to-orange-500"
          />
        </div>
        <div>
          <StatCard
            title="TOTAL PAID"
            value={totals?.paid ?? 0}
            tagText="Cleared & Processed"
            icon={<CheckCircle2 className="h-6 w-6" />}
            gradientClass="bg-gradient-to-br from-emerald-600 to-teal-500"
          />
        </div>
      </div>
    </SectionCard>
  );
};

export default EarningsOverview;
