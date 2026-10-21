import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

export interface SectionCardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  extraHeader?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  className = "",
  extraHeader,
}) => {
  return (
    <Card
      className={`!mb-7 !rounded-[17px] !border !border-slate-100 !p-5 !shadow-[0_2px_5px_rgba(15,23,42,.04)] [&>.ant-card-body]:!p-0 ${className}`}
    >
      {(title || icon || extraHeader) && (
        <div className="mb-[18px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 text-pink-500">
                {icon}
              </span>
            )}
            {title && (
              <Title level={3} className="!m-0 !text-lg !text-[#273650]">
                {title}
              </Title>
            )}
          </div>
          {extraHeader}
        </div>
      )}
      {children}
    </Card>
  );
};

export default SectionCard;
