import React from "react";

import type { SectionCardProps } from "../../interface/common";

export type { SectionCardProps };

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
  className = "",
  extraHeader,
}) => {
  return (
    <section
      className={`mb-7 rounded-[17px] border border-slate-100 bg-white p-5 shadow-[0_2px_5px_rgba(15,23,42,.04)] ${className}`}
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
              <h3 className="m-0 text-lg font-bold text-[#273650] tracking-tight">
                {title}
              </h3>
            )}
          </div>
          {extraHeader}
        </div>
      )}
      {children}
    </section>
  );
};

export default SectionCard;
