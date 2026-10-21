import React from "react";
import { Table, Typography } from "antd";
import type { PartnerCustomer } from "../../api/partner.api";
import { money, shortDate } from "./tableUtils";

const { Text } = Typography;

export interface CustomerTableProps {
  customers: PartnerCustomer[];
  loading?: boolean;
}

const customerColumns = [
  { title: "Customer", dataIndex: "name", key: "name" },
  { title: "ID", dataIndex: "member_id", key: "member_id" },
  {
    title: "Joined",
    dataIndex: "joined_at",
    key: "joined_at",
    render: (v: string | null) => shortDate(v),
  },
  {
    title: "Orders",
    dataIndex: "orders",
    key: "orders",
    align: "right" as const,
  },
  {
    title: "You earned",
    dataIndex: "total_earned",
    key: "total_earned",
    align: "right" as const,
    render: (v: number) => <Text strong>{money(v)}</Text>,
  },
];

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading = false,
}) => {
  return (
    <Table<PartnerCustomer>
      rowKey="user_id"
      size="small"
      loading={loading}
      pagination={false}
      columns={customerColumns}
      dataSource={customers}
      locale={{
        emptyText: "No one has signed up with your code yet.",
      }}
    />
  );
};

export default CustomerTable;
