import React from "react";
import { Table, Typography } from "antd";
import type { PartnerTopProduct } from "../../api/partner.api";
import { money } from "./tableUtils";

const { Text } = Typography;

export interface TopProductsTableProps {
  products: PartnerTopProduct[];
  loading?: boolean;
}

const topProductColumns = [
  {
    title: "Product",
    dataIndex: "product_name",
    key: "product_name",
  },
  {
    title: "Orders",
    dataIndex: "orders",
    key: "orders",
    align: "right" as const,
  },
  {
    title: "Units",
    dataIndex: "units",
    key: "units",
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

const TopProductsTable: React.FC<TopProductsTableProps> = ({
  products,
  loading = false,
}) => {
  return (
    <Table<PartnerTopProduct>
      rowKey="product_id"
      size="small"
      loading={loading}
      pagination={false}
      dataSource={products}
      columns={topProductColumns}
      locale={{
        emptyText: "No product has earned you commission yet.",
      }}
    />
  );
};

export default TopProductsTable;
