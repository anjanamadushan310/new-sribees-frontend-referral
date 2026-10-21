import React, { useState, useEffect } from "react";
import { money, shortDate } from "./tableUtils";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Pagination } from "../Common/Pagination";

import type { RecruitTableProps } from "../../interface/team";

export type { RecruitTableProps };

const RecruitTable: React.FC<RecruitTableProps> = ({
  recruits,
  loading = false,
  pageSize = 10,
}) => {
  const isMobile = useIsMobile(768);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(recruits.length / pageSize));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [recruits.length, totalPages, currentPage]);

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

  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedRecruits = recruits.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paginatedRecruits.map((r) => (
            <div
              key={r.partner_id}
              className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.04)] flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
            >
              {/* Top: Name & Status badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="m-0 text-base font-bold text-slate-800 truncate">
                    {r.name}
                  </h4>
                  <span className="text-xs text-slate-500">
                    Joined {shortDate(r.joined_at)}
                  </span>
                </div>
                <div className="shrink-0">
                  {r.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Level 2 earned */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                <span className="text-xs text-slate-500">Level 2 earned:</span>
                <span className="text-sm font-bold text-pink-700">
                  {money(r.total_earned)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
              {paginatedRecruits.map((r) => (
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
      )}

      {recruits.length > pageSize && (
        <Pagination
          currentPage={effectivePage}
          totalItems={recruits.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="partners"
        />
      )}
    </div>
  );
};

export default RecruitTable;
