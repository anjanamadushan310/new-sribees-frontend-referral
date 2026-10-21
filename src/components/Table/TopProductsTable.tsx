import React from "react";
import { Table, Typography, Spin, Empty } from "antd";
import {
  ShoppingOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { PartnerTopProduct } from "../../api/partner.api";
import { money } from "./tableUtils";
import { useIsMobile } from "../../hooks/useIsMobile";

const { Text } = Typography;

export interface TopProductsTableProps {
  products: PartnerTopProduct[];
  loading?: boolean;
  viewMode?: "auto" | "table" | "grid";
  className?: string;
}

const topProductColumns = [
  {
    title: "#",
    key: "rank",
    width: 60,
    render: (_: unknown, __: PartnerTopProduct, index: number) => (
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
          index === 0
            ? "bg-amber-100 text-amber-800"
            : index === 1
            ? "bg-slate-200 text-slate-700"
            : index === 2
            ? "bg-orange-100 text-orange-800"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {index + 1}
      </span>
    ),
  },
  {
    title: "Product",
    dataIndex: "product_name",
    key: "product_name",
    render: (name: string, record: PartnerTopProduct) => (
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-pink-50 text-pink-600">
          <ShoppingOutlined />
        </span>
        <div className="min-w-0">
          <div className="font-semibold text-slate-800">{name}</div>
          <div className="text-[11px] font-mono text-slate-400">
            ID: {record.product_id}
          </div>
        </div>
      </div>
    ),
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
  viewMode = "auto",
  className = "",
}) => {
  const isMobile = useIsMobile(768);
  const showGrid = viewMode === "grid" || (viewMode === "auto" && isMobile);

  if (loading && showGrid) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (showGrid) {
    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No product has earned you commission yet."
          />
        </div>
      );
    }

    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 ${className}`}
      >
        {products.map((product, index) => {
          const isTopThree = index < 3;
          return (
            <div
              key={product.product_id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-[0_10px_25px_rgba(216,27,96,.1)]"
            >
              {/* Header: Rank + Icon + Badges */}
              <div>
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 px-2 items-center justify-center rounded-lg text-xs font-bold tracking-tight shrink-0 ${
                        index === 0
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : index === 1
                          ? "bg-slate-200 text-slate-700 border border-slate-300"
                          : index === 2
                          ? "bg-orange-100 text-orange-800 border border-orange-300"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isTopThree && <TrophyOutlined className="mr-1 text-[10px]" />}
                      #{index + 1}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-pink-50 text-pink-600">
                      <ShoppingOutlined className="text-sm" />
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/90 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    <InboxOutlined className="text-[11px]" />
                    {product.units} {product.units === 1 ? "unit" : "units"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.product_name}
                </h3>
                <div className="mt-0.5 text-[11px] font-mono text-slate-400">
                  ID: {product.product_id}
                </div>
              </div>

              {/* Commission & Orders */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-xl bg-pink-50/70 p-2.5 border border-pink-100/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    You Earned
                  </span>
                  <span className="text-base font-extrabold text-pink-700">
                    {money(product.total_earned)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShoppingCartOutlined className="text-slate-400" />
                    Orders
                  </span>
                  <span className="font-semibold text-slate-700">
                    {product.orders}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
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
    </div>
  );
};

export default TopProductsTable;
