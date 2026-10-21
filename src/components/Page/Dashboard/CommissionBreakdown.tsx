import React from "react";
import { Row, Col } from "antd";
import { DeploymentUnitOutlined, CrownOutlined } from "@ant-design/icons";
import { SectionCard, StatCard } from "../../Base";
import type { PartnerProfile } from "../../../api/partner.api";

export interface CommissionBreakdownProps {
  byLevel?: PartnerProfile["byLevel"];
}

const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({ byLevel }) => {
  return (
    <SectionCard
      title="Commission Level Breakdown"
      icon={<DeploymentUnitOutlined />}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <StatCard
            title="LEVEL 01 EARNINGS"
            value={byLevel?.level1 ?? 0}
            tagText="Direct Referrals"
            icon={<CrownOutlined />}
            gradientClass="!bg-gradient-to-br !from-fuchsia-600 !to-pink-500"
          />
        </Col>
        <Col xs={24} md={12}>
          <StatCard
            title="LEVEL 02 EARNINGS"
            value={byLevel?.level2 ?? 0}
            tagText="Secondary Network"
            icon={<DeploymentUnitOutlined />}
            gradientClass="!bg-gradient-to-br !from-purple-600 !to-indigo-500"
          />
        </Col>
      </Row>
    </SectionCard>
  );
};

export default CommissionBreakdown;
