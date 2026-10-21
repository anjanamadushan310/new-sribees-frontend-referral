import React from "react";
import { Table, Tag, Typography } from "antd";
import type { PartnerRecruit } from "../../api/partner.api";
import { money, shortDate } from "./tableUtils";

const { Text } = Typography;

export interface RecruitTableProps {
  recruits: PartnerRecruit[];
  loading?: boolean;
}

const recruitColumns = [
  { title: "Partner", dataIndex: "name", key: "name" },
  {
    title: "Joined",
    dataIndex: "joined_at",
    key: "joined_at",
    render: (v: string | null) => shortDate(v),
  },
  {
    title: "Status",
    dataIndex: "is_active",
    key: "is_active",
    render: (v: boolean) =>
      v ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
  },
  {
    title: "Level 2 earned",
    dataIndex: "total_earned",
    key: "total_earned",
    align: "right" as const,
    render: (v: number) => <Text strong>{money(v)}</Text>,
  },
];

const RecruitTable: React.FC<RecruitTableProps> = ({
  recruits,
  loading = false,
}) => {
  return (
    <Table<PartnerRecruit>
      rowKey="partner_id"
      size="small"
      loading={loading}
      pagination={false}
      columns={recruitColumns}
      dataSource={recruits}
      locale={{
        emptyText: "You have not recruited any partners yet.",
      }}
    />
  );
};

export default RecruitTable;
