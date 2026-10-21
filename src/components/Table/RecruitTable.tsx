import React from "react";
import { money, shortDate } from "./tableUtils";

import type { RecruitTableProps } from "../../interface/team";

export type { RecruitTableProps };

const RecruitTable: React.FC<RecruitTableProps> = ({
  recruits,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-pink-600" />
      </div>
    );
  }

  if (recruits.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        You have not recruited any partners yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4">Partner</th>
            <th className="py-3 px-4">Joined</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Level 2 earned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {recruits.map((r) => (
            <tr
              key={r.partner_id}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="py-3.5 px-4 font-medium text-slate-800">{r.name}</td>
              <td className="py-3.5 px-4 text-slate-600">
                {shortDate(r.joined_at)}
              </td>
              <td className="py-3.5 px-4">
                {r.is_active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    Inactive
                  </span>
                )}
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                {money(r.total_earned)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruitTable;
