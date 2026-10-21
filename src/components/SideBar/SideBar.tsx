import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  User,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  UserPlus,
  LogOut,
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";

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
  const isMobile = useIsMobile(768);
  const isCollapsed = isMobile || collapsed;
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (key: string) => {
    onSelectTab(key);
    if (key === "dashboard") {
      if (location.pathname !== "/") {
        navigate("/");
      }
    } else if (key === "products") {
      if (location.pathname !== "/products") {
        navigate("/products");
      }
    } else if (key === "commissions") {
      if (location.pathname !== "/ledger") {
        navigate("/ledger");
      }
    } else if (key === "customers") {
      if (location.pathname !== "/customers") {
        navigate("/customers");
      }
    } else if (key === "recruits") {
      if (location.pathname !== "/team") {
        navigate("/team");
      }
    } else {
      if (location.pathname !== "/") {
        navigate(`/?tab=${key}`);
      }
    }
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
      label: "Dashboard",
    },
    {
      key: "products",
      icon: <Package className="h-5 w-5 shrink-0" />,
      label: "Products",
    },
    {
      key: "commissions",
      icon: <FileText className="h-5 w-5 shrink-0" />,
      label: "Ledger",
    },
    {
      key: "customers",
      icon: <User className="h-5 w-5 shrink-0" />,
      label: "My Customers",
    },
    ...(!hasUpline
      ? [
          {
            key: "recruits",
            icon: <Users className="h-5 w-5 shrink-0" />,
            label: "My Team",
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`sticky top-3 h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] self-start overflow-hidden bg-transparent transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed
          ? "w-[76px] min-w-[76px] max-w-[76px] flex-[0_0_76px]"
          : "w-[264px] min-w-[264px] max-w-[264px] flex-[0_0_264px]"
      }`}
    >
      {/* Top Logo Bar */}
      <div
        className={`flex h-[62px] items-center text-white transition-all duration-300 ${
          isCollapsed ? "justify-center px-0" : "justify-between px-5"
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/30 bg-white/15 text-lg text-white">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <span className="text-white font-bold text-lg tracking-tight">
              Main Logo
            </span>
          </div>
        )}
        {!isMobile ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="text-lg text-white hover:bg-white/10 w-8 h-8 p-0 grid place-items-center rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        ) : (
          <div className="flex items-center justify-center">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/30 bg-white/15 text-lg text-white">
              <LayoutDashboard className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav
        className={`py-1.5 transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-3.5"
        }`}
      >
        <ul className="flex flex-col gap-1 list-none p-0 m-0">
          {menuItems.map((item) => {
            const isSelected = activeTab === item.key;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => handleMenuClick(item.key)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full h-[42px] rounded-xl border transition-all duration-150 flex items-center cursor-pointer text-[15px] font-bold ${
                    isCollapsed
                      ? "justify-center px-0"
                      : "justify-start px-3.5 gap-3"
                  } ${
                    isSelected
                      ? "border-white/20 bg-white/25 text-white shadow-sm"
                      : "border-transparent text-white hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div
        className={`mt-auto border-t border-white/15 pt-3 pb-3 transition-all duration-300 ${
          isCollapsed ? "px-2" : "px-3.5"
        }`}
      >
        {!hasUpline && (
          <button
            type="button"
            onClick={onOpenRecruit}
            className={`mb-2 h-[40px] w-full rounded-xl border-0 bg-white text-sm font-semibold text-fuchsia-700 hover:bg-white/95 shadow-sm transition-all cursor-pointer ${
              isCollapsed
                ? "p-0 flex items-center justify-center"
                : "flex items-center justify-center gap-1.5 px-3"
            }`}
            title={isCollapsed ? "Recruit a partner" : undefined}
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Recruit a partner</span>}
          </button>
        )}
        <button
          type="button"
          onClick={onSignOut}
          className="h-[40px] w-full rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
          aria-label="Sidebar sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
