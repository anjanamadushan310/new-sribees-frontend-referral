import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Space, Typography } from "antd";
import {
  DashboardOutlined,
  ProductOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined as TeamMenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

export interface SideBarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onSelectTab: (key: string) => void;
  hasUpline?: boolean;
  onOpenRecruit?: () => void;
  onSignOut: () => void;
}

const SideBar: React.FC<SideBarProps> = ({
  collapsed,
  onToggleCollapse,
  activeTab,
  onSelectTab,
  hasUpline = false,
  onOpenRecruit,
  onSignOut,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (key: string) => {
    if (key === "products") {
      if (location.pathname !== "/products") {
        navigate("/products");
      }
      onSelectTab("products");
    } else if (key === "dashboard") {
      if (location.pathname !== "/") {
        navigate("/");
      }
      onSelectTab("customers");
    } else {
      if (location.pathname !== "/") {
        navigate(`/?tab=${key}`);
      }
      onSelectTab(key);
    }
  };
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={264}
      collapsedWidth={76}
      className={`!sticky !top-3 !h-[calc(100vh-24px)] !max-h-[calc(100vh-24px)] !self-start !overflow-hidden !bg-transparent transition-all duration-300 ease-in-out [&>.ant-layout-sider-children]:!flex [&>.ant-layout-sider-children]:!flex-col ${
        collapsed
          ? "!w-[76px] !min-w-[76px] !max-w-[76px] !flex-[0_0_76px]"
          : "!w-[264px] !min-w-[264px] !max-w-[264px] !flex-[0_0_264px]"
      }`}
    >
      <div
        className={`flex h-[62px] items-center text-white transition-all duration-300 ${
          collapsed ? "justify-center px-0" : "justify-between px-5"
        }`}
      >
        {!collapsed && (
          <Space className="gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/30 bg-white/15 text-lg text-white">
              <DashboardOutlined />
            </span>
            <Text className="!text-white !font-bold !text-lg tracking-tight">Main Logo</Text>
          </Space>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="!text-lg !text-white hover:!bg-white/10 !w-8 !h-8 !p-0 !grid !place-items-center !rounded-lg"
          aria-label="Toggle sidebar"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[activeTab]}
        onClick={({ key }) => handleMenuClick(key)}
        className={`!border-e-0 !bg-transparent !py-1.5 transition-all duration-300 [&_.ant-menu-item]:!mb-1 [&_.ant-menu-item]:!h-[42px] [&_.ant-menu-item]:!rounded-xl [&_.ant-menu-item]:!border [&_.ant-menu-item]:!border-transparent [&_.ant-menu-item]:!text-[15px] [&_.ant-menu-item]:!font-bold [&_.ant-menu-title-content]:!font-bold [&_.ant-menu-item]:!text-white [&_.ant-menu-item:hover]:!bg-white/15 [&_.ant-menu-item:hover]:!text-white [&_.ant-menu-item-selected]:!border-white/20 [&_.ant-menu-item-selected]:!bg-white/25 [&_.ant-menu-item-selected]:!text-white [&_.ant-menu-item-selected]:!shadow-sm [&_.ant-menu-item-selected]:after:!hidden [&_.ant-menu-item-icon]:!text-[18px] [&_.ant-menu-item]:!transition-colors [&_.ant-menu-item]:!duration-150 ${
          collapsed
            ? "!px-2 [&_.ant-menu-item]:!px-0 [&_.ant-menu-item]:!flex [&_.ant-menu-item]:!items-center [&_.ant-menu-item]:!justify-center"
            : "!px-3.5 [&_.ant-menu-item]:!px-3.5"
        }`}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          { key: "products", icon: <ProductOutlined />, label: "Products" },
          { key: "commissions", icon: <FileTextOutlined />, label: "Ledger" },
          { key: "customers", icon: <UserOutlined />, label: "My Customers" },
          ...(!hasUpline
            ? [
                {
                  key: "recruits",
                  icon: <TeamMenuOutlined />,
                  label: "My Team",
                },
              ]
            : []),
        ]}
      />
      <div
        className={`mt-auto border-t border-white/15 pt-3 pb-3 transition-all duration-300 ${
          collapsed ? "px-2" : "px-3.5"
        }`}
      >
        {!hasUpline && (
          <Button
            block
            icon={<UserAddOutlined className="text-[15px]" />}
            onClick={onOpenRecruit}
            className={`!mb-2 !h-[40px] !w-full !rounded-xl !border-0 !text-sm !font-semibold !text-fuchsia-700 hover:!bg-white/95 shadow-sm transition-all ${
              collapsed ? "!p-0 !flex !items-center !justify-center" : "!flex !items-center !justify-center gap-1.5"
            }`}
            title={collapsed ? "Recruit a partner" : undefined}
          >
            {!collapsed && "Recruit a partner"}
          </Button>
        )}
        <Button
          block
          type="text"
          icon={<LogoutOutlined className="text-base" />}
          onClick={onSignOut}
          className="!h-[40px] !w-full !rounded-xl !border !border-white/20 !bg-white/10 !text-white hover:!bg-white/20 !flex !items-center !justify-center transition-all"
          aria-label="Sidebar sign out"
          title="Sign out"
        ></Button>
      </div>
    </Sider>
  );
};

export default SideBar;
