import React from "react";
import { Calendar } from "lucide-react";

import type { HeaderProps } from "../../interface/common";

export type { HeaderProps };

const Header: React.FC<HeaderProps> = ({
  onSignOut,
  title = "Dashboard Overview",
  className = "",
}) => {
  return (
    <header
      className={`flex h-[88px] items-center justify-between bg-slate-50 px-7 ${className}`}
    >
      <div className="flex items-end gap-2">
        <h1 className="m-0 text-3xl font-semibold text-[#17233b]">{title}</h1>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          className="inline-flex h-[39px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-[0_2px_5px_rgba(15,23,42,.06)] hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Calendar className="h-4 w-4 text-slate-500" />
          <span>This Month</span>
        </button>
        <button type="button" className="sr-only" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Header;
