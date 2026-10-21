import React from "react";

import type { HeaderProps } from "../../interface/common";

export type { HeaderProps };

const Header: React.FC<HeaderProps> = ({
  title = "Dashboard Overview",
  className = "",
}) => {
  return (
    <header
      className={`flex h-14 sm:h-[88px] items-center justify-between bg-slate-50 px-3 sm:px-7 ${className}`}
    >
      <div className="flex items-end gap-2">
        <h1 className="m-0 text-xl sm:text-3xl font-semibold text-[#17233b] truncate">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
