import React from "react";
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
  const tabs = [
    {
      key: "customers",
      label: `My Customers (${customers.length})`,
      content: <CustomerTable customers={customers} />,
    },
    ...(!hasUpline
      ? [
          {
            key: "recruits",
            label: `My Team (${recruits.length})`,
            content: <RecruitTable recruits={recruits} />,
          },
        ]
      : []),
    {
      key: "commissions",
      label: "Commission Ledger",
      content: <CommissionTable commissions={commissions} />,
    },
    {
      key: "products",
      label: "Top Products",
      content: <TopProductsTable products={topProducts} />,
    },
  ];

  const currentTab = tabs.find((t) => t.key === activeTab) || tabs[0];

  return (
    <div className="mb-7 overflow-x-auto rounded-[17px] border border-slate-100 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,.04)]">
      {/* Tab Navigation Header */}
      <div
        className="flex items-center gap-6 border-b border-slate-200/80 mb-5"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.key)}
              className={`relative pb-3 text-sm font-semibold transition-colors cursor-pointer border-0 bg-transparent ${
                isActive
                  ? "text-pink-600 font-bold"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div role="tabpanel">{currentTab?.content}</div>
    </div>
  );
};

export default DashboardTabs;
