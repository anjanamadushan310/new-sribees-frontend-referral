import React from "react";
import type { StatCardProps } from "../../interface/common";

export type { StatCardProps };

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = "Rs. ",
  precision,
  tagText,
  icon,
  className = "",
}) => {
  const digits = precision ?? (prefix === "" ? 0 : 2);
  const formattedValue = Number.isFinite(value)
    ? value.toLocaleString("en-LK", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : "—";

  return (
    <div className={`flex min-h-32 items-start justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 ${className}`}>
      <div className="min-w-0">
        <p className="m-0 text-xs font-semibold tracking-wide text-slate-500">{title}</p>
        <p className="my-3 flex flex-wrap items-baseline gap-1.5 tabular-nums text-slate-900">
          {prefix && <span className="text-sm font-medium text-slate-500">{prefix}</span>}
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">{formattedValue}</span>
        </p>
        {tagText && <p className="m-0 text-xs leading-relaxed text-slate-500">{tagText}</p>}
      </div>
      <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pink-50 text-[#D81B60]">{icon}</span>
    </div>
  );
};

export default StatCard;
