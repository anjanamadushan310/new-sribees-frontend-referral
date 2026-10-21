import React from "react";

import type { StatCardProps } from "../../interface/common";

export type { StatCardProps };

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = "Rs. ",
  precision = 2,
  tagText,
  icon,
  gradientClass,
  className = "",
}) => {
  const formattedValue =
    typeof value === "number" && !isNaN(value)
      ? precision !== undefined && precision > 0
        ? value.toLocaleString("en-LK", {
            minimumFractionDigits: precision,
            maximumFractionDigits: precision,
          })
        : value.toLocaleString("en-LK")
      : value;

  return (
    <div
      className={`relative min-h-[131px] overflow-hidden rounded-[13px] border-0 ${gradientClass} text-white shadow-[0_5px_8px_rgba(15,23,42,.15)] p-[22px_18px] ${className}`}
    >
      <div className="relative z-[1] flex flex-col justify-between h-full">
        <div>
          <div className="text-[13px] font-semibold tracking-[.35px] text-white/85 uppercase">
            {title}
          </div>
          <div className="my-[5px_0_9px] text-2xl font-bold text-white flex items-baseline">
            {prefix && (
              <span className="mr-2 text-xs font-semibold text-white/90">
                {prefix}
              </span>
            )}
            <span>{formattedValue}</span>
          </div>
        </div>

        <div>
          <span className="inline-block rounded border-0 bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white">
            {tagText}
          </span>
        </div>
      </div>

      <div className="absolute right-[18px] top-[39px] grid h-[52px] w-[52px] place-items-center rounded-full border border-white/30 text-2xl text-white pointer-events-none">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
