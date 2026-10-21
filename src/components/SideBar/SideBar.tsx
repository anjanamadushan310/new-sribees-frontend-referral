import React from "react";
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
        className={`flex h-[76px] items-center text-xl font-bold text-white transition-all duration-300 ${
          collapsed ? "justify-center px-0" : "justify-between px-[26px]"
        }`}
      >
        {!collapsed && (
          <Space className="gap-[9px]">
            <span className="grid h-9 w-9 place-items-center rounded-[9px] border border-white/30 bg-white/15 text-xl">
              <DashboardOutlined />
            </span>
            <Text className="!text-white">Main Logo</Text>
          </Space>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggleCollapse}
          className="!text-xl !text-white"
          aria-label="Toggle sidebar"
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[activeTab]}
        onClick={({ key }) =>
          onSelectTab(key === "dashboard" ? "customers" : key)
        }
        className={`!border-e-0 !bg-transparent !py-[9px] transition-all duration-300 [&_.ant-menu-item]:!mb-[5px] [&_.ant-menu-item]:!h-[51px] [&_.ant-menu-item]:!rounded-[13px] [&_.ant-menu-item]:!border [&_.ant-menu-item]:!border-transparent [&_.ant-menu-item]:!text-[17px] [&_.ant-menu-item]:!text-white/95 [&_.ant-menu-item-selected]:!border-white/20 [&_.ant-menu-item-selected]:!bg-white/20 [&_.ant-menu-item-selected]:after:!hidden [&_.ant-menu-item-icon]:!text-[21px] ${
          collapsed
            ? "!px-2 [&_.ant-menu-item]:!px-0 [&_.ant-menu-item]:!flex [&_.ant-menu-item]:!items-center [&_.ant-menu-item]:!justify-center"
            : "!px-[17px] [&_.ant-menu-item]:!px-4"
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
        className={`mt-auto border-t border-white/15 pb-[13px] pt-4 transition-all duration-300 ${
          collapsed ? "px-2" : "px-[17px]"
        }`}
      >
        {!hasUpline && (
          <Button
            block
            icon={<UserAddOutlined />}
            onClick={onOpenRecruit}
            className={`!mb-2 !h-[45px] !w-full !rounded-xl !border-0 !text-[15px] !font-bold !text-fuchsia-700 ${
              collapsed ? "!p-0 !flex !items-center !justify-center" : ""
            }`}
            title={collapsed ? "Recruit a partner" : undefined}
          >
            {!collapsed && "Recruit a partner"}
          </Button>
        )}
        <Button
          block
          type="text"
          icon={<LogoutOutlined />}
          onClick={onSignOut}
          className={`!h-[45px] !w-full !rounded-xl !border-white/20 !bg-white/10 !text-[15px] !text-white ${
            collapsed ? "!p-0 !flex !items-center !justify-center" : "!text-left"
          }`}
          aria-label="Sidebar sign out"
          title={collapsed ? "Sign out" : undefined}
        ></Button>
      </div>
    </Sider>
  );
};

export default SideBar;
