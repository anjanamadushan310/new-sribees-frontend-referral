import React from "react";

import type { HeaderProps } from "../../interface/common";

export type { HeaderProps };

const Header: React.FC<HeaderProps> = ({
  title = "Dashboard Overview",
  className = "",
}) => {
  return (
    <header
      className={`sticky top-0 z-20 sm:static flex min-h-16 sm:h-[88px] items-center justify-between border-b border-slate-200/70 bg-white/95 backdrop-blur-md sm:bg-white sm:backdrop-blur-none px-4 sm:px-7 pt-[env(safe-area-inset-top)] sm:pt-0 ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="m-0 text-xl sm:text-2xl font-semibold text-[#17233b] truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:hidden shrink-0">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white p-1 shadow-xs border border-slate-200/80">
          <img
            src="/logo.png"
            alt="SRIBEES Logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
