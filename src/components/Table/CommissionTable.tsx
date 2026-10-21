import React from "react";
import { Table, Tag, Typography } from "antd";
import type { PartnerCommission } from "../../api/partner.api";
import { money, shortDate, statusTag } from "./tableUtils";
import CommissionLines from "./CommissionLines";

const { Text } = Typography;

export interface CommissionTableProps {
  commissions: PartnerCommission[];
  loading?: boolean;
}

const commissionColumns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (v: string | null) => shortDate(v),
  },
  {
    title: "Order",
    dataIndex: "order_number",
    key: "order_number",
    render: (v: string | null) => v ?? "—",
  },
  {
    title: "Level",
    dataIndex: "level",
    key: "level",
    render: (v: number) => (
      <Tag color={v === 1 ? "blue" : "purple"}>L{v}</Tag>
    ),
  },
  {
    title: "Products",
    key: "products",
    render: (_: unknown, row: PartnerCommission) => {
      const n = row.lines?.length ?? 0;
      return n > 0 ? `${n} product${n === 1 ? "" : "s"}` : "Whole order";
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "right" as const,
    render: (v: number, row: PartnerCommission) => (
      <Text strong delete={row.status === "reversed"}>
        {money(v)}
      </Text>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (v: PartnerCommission["status"]) => statusTag(v),
  },
];

const CommissionTable: React.FC<CommissionTableProps> = ({
  commissions,
  loading = false,
}) => {
  return (
    <Table<PartnerCommission>
      rowKey="commission_id"
      size="small"
      loading={loading}
      columns={commissionColumns}
      dataSource={commissions}
      expandable={{
        expandedRowRender: (row) => <CommissionLines row={row} />,
      }}
      locale={{
        emptyText: "No commission recorded yet.",
      }}
    />
  );
};

export default CommissionTable;
