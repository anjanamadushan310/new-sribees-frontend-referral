import React from "react";

import type { StatCardProps } from "../../interface/common";

export type { StatCardProps };

interface ColorTheme {
  cardBg: string;
  borderColor: string;
  leftBadgeBg: string;
  leftBadgeText: string;
  valueColor: string;
  tagBg: string;
  tagText: string;
  rightBadgeBg: string;
  rightBadgeBorder: string;
  rightBadgeText: string;
}

const COLOR_THEMES: Record<string, ColorTheme> = {
  rose: {
    cardBg: "bg-gradient-to-br from-[#FFF1F5] via-[#FFF7FA] to-[#FFFFFF]",
    borderColor: "border-[#FCE7F0]",
    leftBadgeBg: "bg-[#FCE7F0]",
    leftBadgeText: "text-[#BE185D]",
    valueColor: "text-[#831843]",
    tagBg: "bg-[#FCE7F0]",
    tagText: "text-[#BE185D]",
    rightBadgeBg: "bg-[#FCE7F0]/70",
    rightBadgeBorder: "border-[#FBCFE8]/60",
    rightBadgeText: "text-[#BE185D]",
  },
  pink: {
    cardBg: "bg-gradient-to-br from-[#FFF1F5] via-[#FFF7FA] to-[#FFFFFF]",
    borderColor: "border-[#FCE7F0]",
    leftBadgeBg: "bg-[#FCE7F0]",
    leftBadgeText: "text-[#BE185D]",
    valueColor: "text-[#831843]",
    tagBg: "bg-[#FCE7F0]",
    tagText: "text-[#BE185D]",
    rightBadgeBg: "bg-[#FCE7F0]/70",
    rightBadgeBorder: "border-[#FBCFE8]/60",
    rightBadgeText: "text-[#BE185D]",
  },
  orange: {
    cardBg: "bg-gradient-to-br from-[#FFF7ED] via-[#FFFAF5] to-[#FFFFFF]",
    borderColor: "border-[#FFEDD5]",
    leftBadgeBg: "bg-[#FFEDD5]",
    leftBadgeText: "text-[#EA580C]",
    valueColor: "text-[#1E293B]",
    tagBg: "bg-[#FFEDD5]",
    tagText: "text-[#C2410C]",
    rightBadgeBg: "bg-[#FFEDD5]/70",
    rightBadgeBorder: "border-[#FED7AA]/60",
    rightBadgeText: "text-[#EA580C]",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-[#FFF7ED] via-[#FFFAF5] to-[#FFFFFF]",
    borderColor: "border-[#FFEDD5]",
    leftBadgeBg: "bg-[#FFEDD5]",
    leftBadgeText: "text-[#EA580C]",
    valueColor: "text-[#1E293B]",
    tagBg: "bg-[#FFEDD5]",
    tagText: "text-[#C2410C]",
    rightBadgeBg: "bg-[#FFEDD5]/70",
    rightBadgeBorder: "border-[#FED7AA]/60",
    rightBadgeText: "text-[#EA580C]",
  },
  emerald: {
    cardBg: "bg-gradient-to-br from-[#F0FDF4] via-[#F7FEFA] to-[#FFFFFF]",
    borderColor: "border-[#DCFCE7]",
    leftBadgeBg: "bg-[#DCFCE7]",
    leftBadgeText: "text-[#059669]",
    valueColor: "text-[#065F46]",
    tagBg: "bg-[#DCFCE7]",
    tagText: "text-[#047857]",
    rightBadgeBg: "bg-[#DCFCE7]/70",
    rightBadgeBorder: "border-[#BBF7D0]/60",
    rightBadgeText: "text-[#059669]",
  },
  green: {
    cardBg: "bg-gradient-to-br from-[#F0FDF4] via-[#F7FEFA] to-[#FFFFFF]",
    borderColor: "border-[#DCFCE7]",
    leftBadgeBg: "bg-[#DCFCE7]",
    leftBadgeText: "text-[#059669]",
    valueColor: "text-[#065F46]",
    tagBg: "bg-[#DCFCE7]",
    tagText: "text-[#047857]",
    rightBadgeBg: "bg-[#DCFCE7]/70",
    rightBadgeBorder: "border-[#BBF7D0]/60",
    rightBadgeText: "text-[#059669]",
  },
  purple: {
    cardBg: "bg-gradient-to-br from-[#FAF5FF] via-[#FDFBFF] to-[#FFFFFF]",
    borderColor: "border-[#F3E8FF]",
    leftBadgeBg: "bg-[#F3E8FF]",
    leftBadgeText: "text-[#7E22CE]",
    valueColor: "text-[#581C87]",
    tagBg: "bg-[#F3E8FF]",
    tagText: "text-[#7E22CE]",
    rightBadgeBg: "bg-[#F3E8FF]/70",
    rightBadgeBorder: "border-[#E9D5FF]/60",
    rightBadgeText: "text-[#7E22CE]",
  },
  blue: {
    cardBg: "bg-gradient-to-br from-[#EFF6FF] via-[#F8FAFC] to-[#FFFFFF]",
    borderColor: "border-[#DBEAFE]",
    leftBadgeBg: "bg-[#DBEAFE]",
    leftBadgeText: "text-[#2563EB]",
    valueColor: "text-[#1E3A8A]",
    tagBg: "bg-[#DBEAFE]",
    tagText: "text-[#1D4ED8]",
    rightBadgeBg: "bg-[#DBEAFE]/70",
    rightBadgeBorder: "border-[#BFDBFE]/60",
    rightBadgeText: "text-[#2563EB]",
  },
  indigo: {
    cardBg: "bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFC] to-[#FFFFFF]",
    borderColor: "border-[#E0E7FF]",
    leftBadgeBg: "bg-[#E0E7FF]",
    leftBadgeText: "text-[#4F46E5]",
    valueColor: "text-[#312E81]",
    tagBg: "bg-[#E0E7FF]",
    tagText: "text-[#4338CA]",
    rightBadgeBg: "bg-[#E0E7FF]/70",
    rightBadgeBorder: "border-[#C7D2FE]/60",
    rightBadgeText: "text-[#4F46E5]",
  },
  teal: {
    cardBg: "bg-gradient-to-br from-[#F0FDFA] via-[#F7FEFD] to-[#FFFFFF]",
    borderColor: "border-[#CCFBF1]",
    leftBadgeBg: "bg-[#CCFBF1]",
    leftBadgeText: "text-[#0D9488]",
    valueColor: "text-[#134E4A]",
    tagBg: "bg-[#CCFBF1]",
    tagText: "text-[#0F766E]",
    rightBadgeBg: "bg-[#CCFBF1]/70",
    rightBadgeBorder: "border-[#99F6E4]/60",
    rightBadgeText: "text-[#0D9488]",
  },
};

function resolveTheme(
  colorScheme?: string,
  gradientClass?: string,
  title?: string,
): ColorTheme {
  if (colorScheme && COLOR_THEMES[colorScheme]) {
    return COLOR_THEMES[colorScheme];
  }
  const str = `${gradientClass || ""} ${title || ""}`.toLowerCase();
  if (
    str.includes("amber") ||
    str.includes("orange") ||
    str.includes("pending")
  ) {
    return COLOR_THEMES.orange;
  }
  if (
    str.includes("emerald") ||
    str.includes("teal") ||
    str.includes("green") ||
    str.includes("paid")
  ) {
    return COLOR_THEMES.emerald;
  }
  if (
    str.includes("fuchsia") ||
    str.includes("pink") ||
    str.includes("rose") ||
    str.includes("earnings") ||
    str.includes("level 01") ||
    str.includes("customer")
  ) {
    return COLOR_THEMES.rose;
  }
  if (
    str.includes("purple") ||
    str.includes("violet") ||
    str.includes("level 02")
  ) {
    return COLOR_THEMES.purple;
  }
  return COLOR_THEMES.blue;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = "Rs. ",
  precision,
  tagText,
  icon,
  leftIcon: _leftIcon,
  gradientClass,
  colorScheme,
  className = "",
}) => {
  const resolvedPrecision =
    precision !== undefined ? precision : prefix === "" ? 0 : 2;

  const formattedValue =
    typeof value === "number" && !isNaN(value)
      ? resolvedPrecision > 0
        ? value.toLocaleString("en-LK", {
            minimumFractionDigits: resolvedPrecision,
            maximumFractionDigits: resolvedPrecision,
          })
        : value.toLocaleString("en-LK", {
            maximumFractionDigits: 0,
          })
      : value;

  const theme = resolveTheme(colorScheme, gradientClass, title);
  const secondaryRightIcon = icon;

  return (
    <div
      className={`relative flex items-center justify-between min-h-[110px] sm:min-h-[128px] overflow-hidden rounded-[20px] border ${theme.borderColor} ${theme.cardBg} p-3.5 sm:p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-all duration-200 ${className}`}
    >
      {/* Left side: Icon + Content */}
      <div className="flex items-start gap-4 min-w-0">
        {/* Left circular icon badge */}
        {/*         <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${theme.leftBadgeBg} ${theme.leftBadgeText} shadow-sm`}
        >
          {primaryLeftIcon}
        </div> */}

        {/* Content column: Title, Value, Tag */}
        <div className="min-w-0">
          <div className="text-[12px] font-semibold tracking-wider text-slate-500 uppercase">
            {title}
          </div>

          <div className="my-1 flex items-baseline">
            {prefix && (
              <span className="mr-1.5 text-sm font-semibold text-slate-500">
                {prefix}
              </span>
            )}
            <span
              className={`text-2xl sm:text-[28px] font-bold tracking-tight ${theme.valueColor}`}
            >
              {formattedValue}
            </span>
          </div>

          {tagText && (
            <div className="mt-2">
              <span
                className={`inline-block rounded-full px-3 py-0.5 text-[11px] font-medium ${theme.tagBg} ${theme.tagText}`}
              >
                {tagText}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Circular watermark / icon badge */}
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${theme.rightBadgeBorder} ${theme.rightBadgeBg} ${theme.rightBadgeText} shadow-sm ml-2`}
      >
        {secondaryRightIcon}
      </div>
    </div>
  );
};

export default StatCard;
