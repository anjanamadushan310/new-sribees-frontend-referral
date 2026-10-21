import React from "react";
import { Row, Col } from "antd";
import {
  WalletOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { SectionCard, StatCard } from "../../Base";
import type { PartnerProfile } from "../../../api/partner.api";

export interface EarningsOverviewProps {
  totals?: PartnerProfile["totals"];
}

const EarningsOverview: React.FC<EarningsOverviewProps> = ({ totals }) => {
  const totalEarnings =
    (totals?.pending ?? 0) +
    (totals?.claimable ?? 0) +
    (totals?.paid ?? 0);

  return (
    <SectionCard
      title="Earnings & Payout Overview"
      icon={<WalletOutlined />}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <StatCard
            title="TOTAL EARNINGS"
            value={totalEarnings}
            tagText="All-time commission"
            icon={<DollarOutlined />}
            gradientClass="!bg-gradient-to-br !from-blue-500 !to-indigo-600"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="PENDING COMMISSIONS"
            value={totals?.pending ?? 0}
            tagText="Pending Payout"
            icon={<ClockCircleOutlined />}
            gradientClass="!bg-gradient-to-br !from-amber-500 !to-orange-500"
          />
        </Col>
        <Col xs={24} md={8}>
          <StatCard
            title="TOTAL PAID"
            value={totals?.paid ?? 0}
            tagText="Cleared & Processed"
            icon={<CheckCircleOutlined />}
            gradientClass="!bg-gradient-to-br !from-emerald-600 !to-teal-500"
          />
        </Col>
      </Row>
    </SectionCard>
  );
};

export default EarningsOverview;
