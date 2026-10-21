import React from "react";
import { Card, Statistic, Tag } from "antd";

export interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  precision?: number;
  tagText: string;
  icon: React.ReactNode;
  gradientClass: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = "Rs. ",
  precision = 2,
  tagText,
  icon,
  gradientClass,
  className = "",
}) => {
  return (
    <Card
      className={`relative min-h-[131px] overflow-hidden !rounded-[13px] !border-0 ${gradientClass} !text-white !shadow-[0_5px_8px_rgba(15,23,42,.15)] [&_.ant-card-body]:!relative [&_.ant-card-body]:!z-[1] [&_.ant-card-body]:!p-[22px_18px] [&_.ant-statistic-title]:!text-[13px] [&_.ant-statistic-title]:!font-semibold [&_.ant-statistic-title]:!tracking-[.35px] [&_.ant-statistic-title]:!text-white/85 [&_.ant-statistic-content]:!my-[5px_0_9px] [&_.ant-statistic-content]:!text-2xl [&_.ant-statistic-content]:!font-bold [&_.ant-statistic-content]:!text-white [&_.ant-statistic-content-prefix]:!mr-2 [&_.ant-statistic-content-prefix]:!text-xs [&_.ant-statistic-content-prefix]:!text-white [&_.ant-tag]:!m-0 [&_.ant-tag]:!rounded [&_.ant-tag]:!border-0 [&_.ant-tag]:!bg-white/20 [&_.ant-tag]:!text-[11px] [&_.ant-tag]:!text-white ${className}`}
    >
      <Statistic
        title={title}
        value={value}
        precision={precision}
        prefix={prefix}
      />
      <Tag>{tagText}</Tag>
      <div className="absolute right-[18px] top-[39px] grid h-[52px] w-[52px] place-items-center rounded-full border border-white/30 !text-2xl text-white">
        {icon}
      </div>
    </Card>
  );
};

export default StatCard;
