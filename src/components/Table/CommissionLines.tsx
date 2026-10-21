import React from "react";
import type { PartnerCommissionLine } from "../../interface/partner";
import { money } from "./tableUtils";

import type { CommissionLinesProps } from "../../interface/ledger";

export type { CommissionLinesProps };

const CommissionLines: React.FC<CommissionLinesProps> = ({ row }) => {
  const lines = row.lines ?? [];
  if (lines.length === 0) {
    return (
      <div className="py-2.5 px-4 text-xs text-slate-500 italic">
        Earned on the whole order at {row.rate_percentage}% (before per-product
        rates).
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
