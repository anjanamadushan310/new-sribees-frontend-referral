import React from "react";
import { Table, Typography, Space } from "antd";
import type { PartnerCommission, PartnerCommissionLine } from "../../api/partner.api";
import { money } from "./tableUtils";

const { Text } = Typography;

export interface CommissionLinesProps {
  row: PartnerCommission;
}

const CommissionLines: React.FC<CommissionLinesProps> = ({ row }) => {
  const lines = row.lines ?? [];
  if (lines.length === 0) {
    return (
      <Text type="secondary">
        Earned on the whole order at {row.rate_percentage}% (before per-product
        rates).
      </Text>
    );
  }
  return (
    <Table<PartnerCommissionLine>
      rowKey={(l) => `${l.product_id}-${l.quantity}-${l.amount}`}
      size="small"
      pagination={false}
      dataSource={lines}
      columns={[
        { title: "Product", dataIndex: "product_name", key: "product_name" },
        {
          title: "Qty",
          key: "quantity",
          align: "right" as const,
          render: (_: unknown, l: PartnerCommissionLine) =>
            l.returned_quantity > 0 ? (
              <Space size={4}>
                {l.quantity - l.returned_quantity}
                <Text type="secondary" className="!text-xs">
                  ({l.returned_quantity} returned)
                </Text>
              </Space>
            ) : (
              l.quantity
            ),
        },
        {
          title: "Rate",
          dataIndex: "rate_percentage",
          key: "rate_percentage",
          align: "right" as const,
          render: (v: number) => `${v}%`,
        },
        {
          title: "Earned",
          dataIndex: "amount",
          key: "amount",
          align: "right" as const,
          render: (v: number) => money(v),
        },
      ]}
    />
  );
};

export default CommissionLines;
