import React from "react";
import { Layout, Space, Typography, Button } from "antd";
import { InfoCircleOutlined, CalendarOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export interface HeaderProps {
  onSignOut: () => void;
  title?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSignOut,
  title = "Dashboard Overview",
  className = "",
}) => {
  return (
    <AntHeader
      className={`!flex !h-[88px] !items-center !justify-between !bg-slate-50 !px-7 ${className}`}
    >
      <Space className="gap-2">
        <Title
          level={1}
          className="!m-0 !text-[27px] !font-bold !text-[#17233b]"
        >
          {title}
        </Title>
        <InfoCircleOutlined className="!text-slate-400" />
      </Space>
      <div className="flex items-center">
        <Button
          className="!h-[39px] !rounded-xl !border-slate-200 !text-slate-600 !shadow-[0_2px_5px_rgba(15,23,42,.06)]"
          icon={<CalendarOutlined />}
        >
          This Month
        </Button>
        <Button className="sr-only" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </AntHeader>
  );
};

export default Header;
