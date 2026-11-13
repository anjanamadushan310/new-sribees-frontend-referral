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
      className={`mb-6 rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-6 ${className}`}
    >
      {(title || icon || extraHeader) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {icon && (
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-pink-50 text-pink-500">
                {icon}
              </span>
            )}
            {title && (
              <h3 className="m-0 text-base font-semibold text-slate-900 tracking-tight">
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
