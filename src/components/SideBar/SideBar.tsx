import React, { useState, useEffect } from "react";
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
  MoreHorizontal,
  ChevronRight,
  X,
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSidebarCollapse } from "../../hooks/useSidebarCollapse";

import type { SideBarProps } from "../../interface/common";

export type { SideBarProps };

const SideBar: React.FC<SideBarProps> = ({
  collapsed: propCollapsed,
  onToggleCollapse: propOnToggleCollapse,
  activeTab,
  onSelectTab,
  hasUpline = false,
  onOpenRecruit,
  onSignOut,
}) => {
  const isMobile = useIsMobile(640);
  const [internalCollapsed, setInternalCollapsed] = useSidebarCollapse();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const effectiveCollapsed =
    propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const handleToggleCollapse =
    propOnToggleCollapse || (() => setInternalCollapsed((v) => !v));

  const isCollapsed = effectiveCollapsed;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isMoreOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMoreOpen]);

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

  const isMoreActive =
    isMoreOpen || activeTab === "customers" || activeTab === "recruits";

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      {!isMobile && (
        <aside
          className={`sticky top-3 h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] self-start overflow-hidden bg-transparent transition-all duration-300 ease-in-out hidden sm:flex flex-col ${
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
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-white p-1 shadow-sm shrink-0">
                  <img
                    src="/logo.png"
                    alt="SRIBEES Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-white font-bold text-lg tracking-tight">
                  SRIBEES
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleToggleCollapse}
              className="text-lg text-white hover:bg-white/10 w-8 h-8 p-0 grid place-items-center rounded-lg transition-colors cursor-pointer border-0 bg-transparent"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
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
              className={`h-[40px] w-full rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer ${
                isCollapsed
                  ? "p-0 flex items-center justify-center"
                  : "flex items-center justify-center gap-1.5 px-3"
              }`}
              aria-label="Sidebar sign out"
              title="Sign out"
            >
              {!isCollapsed && <span>Log Out</span>}
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <>
          <nav
            aria-label="Mobile Navigation"
            className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5 px-2"
          >
            <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
              {/* Dashboard */}
              <button
                type="button"
                onClick={() => {
                  setIsMoreOpen(false);
                  handleMenuClick("dashboard");
                }}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer border-0 bg-transparent active:scale-95 ${
                  activeTab === "dashboard" && !isMoreOpen
                    ? "text-[#A51F60] font-bold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
                aria-label="Dashboard"
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    activeTab === "dashboard" && !isMoreOpen
                      ? "bg-pink-50 text-[#A51F60]"
                      : "text-slate-500"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5 shrink-0" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5">Dashboard</span>
              </button>

              {/* Product */}
              <button
                type="button"
                onClick={() => {
                  setIsMoreOpen(false);
                  handleMenuClick("products");
                }}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer border-0 bg-transparent active:scale-95 ${
                  activeTab === "products" && !isMoreOpen
                    ? "text-[#A51F60] font-bold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
                aria-label="Product"
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    activeTab === "products" && !isMoreOpen
                      ? "bg-pink-50 text-[#A51F60]"
                      : "text-slate-500"
                  }`}
                >
                  <Package className="h-5 w-5 shrink-0" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5">Product</span>
              </button>

              {/* Ledger */}
              <button
                type="button"
                onClick={() => {
                  setIsMoreOpen(false);
                  handleMenuClick("commissions");
                }}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer border-0 bg-transparent active:scale-95 ${
                  activeTab === "commissions" && !isMoreOpen
                    ? "text-[#A51F60] font-bold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
                aria-label="Ledger"
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    activeTab === "commissions" && !isMoreOpen
                      ? "bg-pink-50 text-[#A51F60]"
                      : "text-slate-500"
                  }`}
                >
                  <FileText className="h-5 w-5 shrink-0" />
                </div>
                <span className="text-[11px] leading-tight mt-0.5">Ledger</span>
              </button>

              {/* More */}
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 cursor-pointer border-0 bg-transparent active:scale-95 relative ${
                  isMoreActive
                    ? "text-[#A51F60] font-bold"
                    : "text-slate-500 hover:text-slate-800 font-medium"
                }`}
                aria-label="More"
                aria-expanded={isMoreOpen}
              >
                <div
                  className={`p-1 rounded-xl transition-all relative ${
                    isMoreActive
                      ? "bg-pink-50 text-[#A51F60]"
                      : "text-slate-500"
                  }`}
                >
                  <MoreHorizontal className="h-5 w-5 shrink-0" />
                  {(activeTab === "customers" || activeTab === "recruits") && !isMoreOpen && (
                    <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-[#A51F60] ring-2 ring-white" />
                  )}
                </div>
                <span className="text-[11px] leading-tight mt-0.5">More</span>
              </button>
            </div>
          </nav>

          {/* Mobile Bottom Sheet for More Options */}
          {isMoreOpen && (
            <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
                onClick={() => setIsMoreOpen(false)}
                aria-hidden="true"
              />

              {/* Sheet Container */}
              <div
                role="dialog"
                aria-modal="true"
                aria-label="More options"
                className="relative z-10 w-full rounded-t-[28px] bg-white p-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] border-t border-slate-100 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
              >
                {/* Drag Handle */}
                <div
                  className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-4 cursor-pointer"
                  onClick={() => setIsMoreOpen(false)}
                />

                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-[#17233b] m-0">More Options</h3>
                    <p className="text-xs text-slate-500 m-0 mt-0.5">Quick access to partner tools</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMoreOpen(false)}
                    className="h-8 w-8 grid place-items-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer border-0"
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Menu items */}
                <div className="flex flex-col gap-2">
                  {/* My Customers */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      handleMenuClick("customers");
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border ${
                      activeTab === "customers"
                        ? "bg-pink-50/70 border-pink-200 text-[#A51F60]"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-pink-100 text-[#A51F60] shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold leading-tight">My Customers</div>
                        <div className="text-xs text-slate-500 leading-tight mt-0.5">View your customer base & orders</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>

                  {/* My Team */}
                  {!hasUpline && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreOpen(false);
                        handleMenuClick("recruits");
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer border ${
                        activeTab === "recruits"
                          ? "bg-purple-50/70 border-purple-200 text-purple-700"
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-700 shrink-0">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold leading-tight">My Team</div>
                          <div className="text-xs text-slate-500 leading-tight mt-0.5">Manage partner recruits & levels</div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  )}

                  {/* Recruit Partner */}
                  {!hasUpline && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMoreOpen(false);
                        onOpenRecruit?.();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/15 hover:to-rose-500/15 border border-pink-200/70 text-slate-800 transition-all cursor-pointer shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#A51F60] to-[#880E4F] text-white shrink-0 shadow-sm">
                          <UserPlus className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#880E4F] leading-tight">Recruit a Partner</div>
                          <div className="text-xs text-slate-500 leading-tight mt-0.5">Add new partners under your code</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#A51F60] text-white shrink-0 shadow-xs">
                        Invite
                      </span>
                    </button>
                  )}

                  {/* Divider */}
                  <div className="h-px bg-slate-100 my-1" />

                  {/* Log Out */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMoreOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 hover:bg-rose-100/70 border border-rose-200/60 text-rose-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-600 shrink-0">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold leading-tight">Log Out</div>
                        <div className="text-xs text-rose-500/80 leading-tight mt-0.5">Sign out of your account</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-rose-400 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SideBar;
