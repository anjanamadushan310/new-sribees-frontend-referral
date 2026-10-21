import React from "react";
import type { PartnerCommissionLine } from "../../interface/partner";
import { money } from "./tableUtils";
import { useIsMobile } from "../../hooks/useIsMobile";

import type { CommissionLinesProps } from "../../interface/ledger";

export type { CommissionLinesProps };

const CommissionLines: React.FC<CommissionLinesProps> = ({ row }) => {
  const isMobile = useIsMobile(768);
  const lines = row.lines ?? [];

  if (lines.length === 0) {
    return (
      <div className="py-2.5 px-4 text-xs text-slate-500 italic">
        Earned on the whole order at {row.rate_percentage}% (before per-product
        rates).
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col gap-2 rounded-xl bg-slate-50/80 p-2.5 border border-slate-100">
        {lines.map((l: PartnerCommissionLine, idx) => (
          <div
            key={`${l.product_id}-${l.quantity}-${l.amount}-${idx}`}
            className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-slate-200/60 last:border-0"
          >
            <div className="min-w-0">
              <span className="font-semibold text-slate-800 truncate block">
                {l.product_name}
              </span>
              <span className="text-[11px] text-slate-500">
                Qty:{" "}
                {l.returned_quantity > 0 ? (
                  <span>
                    {l.quantity - l.returned_quantity} ({l.returned_quantity} returned)
                  </span>
                ) : (
                  l.quantity
                )}{" "}
                • Rate: {l.rate_percentage}%
              </span>
            </div>
            <div className="font-bold text-slate-800 shrink-0 text-right">
              {money(l.amount)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100 bg-slate-50/50 p-2">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
            <th className="py-2 px-3">Product</th>
            <th className="py-2 px-3 text-right">Qty</th>
            <th className="py-2 px-3 text-right">Rate</th>
            <th className="py-2 px-3 text-right">Earned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {lines.map((l: PartnerCommissionLine, idx) => (
            <tr
              key={`${l.product_id}-${l.quantity}-${l.amount}-${idx}`}
              className="hover:bg-white/80 transition-colors"
            >
              <td className="py-2 px-3 font-medium text-slate-800">
                {l.product_name}
              </td>
              <td className="py-2 px-3 text-right text-slate-700">
                {l.returned_quantity > 0 ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span>{l.quantity - l.returned_quantity}</span>
                    <span className="text-slate-400 text-[11px]">
                      ({l.returned_quantity} returned)
                    </span>
                  </span>
                ) : (
                  l.quantity
                )}
              </td>
              <td className="py-2 px-3 text-right text-slate-700">
                {l.rate_percentage}%
              </td>
              <td className="py-2 px-3 text-right font-semibold text-slate-800">
                {money(l.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionLines;
