import React from "react";
import { Card, Tabs } from "antd";
import type {
  PartnerCustomer,
  PartnerRecruit,
  PartnerCommission,
  PartnerTopProduct,
} from "../../../api/partner.api";
import {
  CustomerTable,
  RecruitTable,
  CommissionTable,
  TopProductsTable,
} from "../../Table";

export interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (key: string) => void;
  customers: PartnerCustomer[];
  recruits: PartnerRecruit[];
  commissions: PartnerCommission[];
  topProducts: PartnerTopProduct[];
  hasUpline?: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  onTabChange,
  customers,
  recruits,
  commissions,
  topProducts,
  hasUpline = false,
}) => {
  return (
    <Card className="!mb-7 overflow-x-auto !rounded-[17px] !border !border-slate-100 !p-5 !shadow-[0_2px_5px_rgba(15,23,42,.04)] [&>.ant-card-body]:!p-0">
      <Tabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={[
          {
            key: "customers",
            label: `My Customers (${customers.length})`,
            children: <CustomerTable customers={customers} />,
          },
          ...(!hasUpline
            ? [
                {
                  key: "recruits",
                  label: `My Team (${recruits.length})`,
                  children: <RecruitTable recruits={recruits} />,
                },
              ]
            : []),
          {
            key: "commissions",
            label: "Commission Ledger",
            children: <CommissionTable commissions={commissions} />,
          },
          {
            key: "products",
            label: "Top Products",
            children: <TopProductsTable products={topProducts} />,
          },
        ]}
      />
    </Card>
  );
};

export default DashboardTabs;
