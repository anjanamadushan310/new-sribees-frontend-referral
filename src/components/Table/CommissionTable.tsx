import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { money, shortDate, statusTag } from "./tableUtils";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Pagination } from "../Common/Pagination";
import CommissionLines from "./CommissionLines";

import type { CommissionTableProps } from "../../interface/ledger";

export type { CommissionTableProps };

const CommissionTable: React.FC<CommissionTableProps> = ({
  commissions,
  loading = false,
  pageSize = 10,
}) => {
  const isMobile = useIsMobile(768);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(
    new Set()
  );

  const totalPages = Math.max(1, Math.ceil(commissions.length / pageSize));
  const effectivePage = Math.min(Math.max(1, currentPage), totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [commissions.length, totalPages, currentPage]);

  const toggleRow = (id: string) => {
    setExpandedRowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-pink-600" />
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        No commission recorded yet.
      </div>
    );
  }

  const startIndex = (effectivePage - 1) * pageSize;
  const paginatedCommissions = commissions.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {isMobile ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paginatedCommissions.map((row) => {
            const isExpanded = expandedRowKeys.has(row.commission_id);
            const lineCount = row.lines?.length ?? 0;
            const productsLabel =
              lineCount > 0
                ? `${lineCount} product${lineCount === 1 ? "" : "s"}`
                : "Whole order";

            return (
              <div
                key={row.commission_id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.04)] flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
              >
                {/* Header: Date, Level & Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        row.level === 1
                          ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                          : "bg-purple-50 text-purple-700 border border-purple-200/70"
                      }`}
                    >
                      L{row.level}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {shortDate(row.date)}
                    </span>
                  </div>
                  <div>{statusTag(row.status)}</div>
                </div>

                {/* Middle: Order Number & Products info */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-slate-700 font-medium">
                    Order: {row.order_number ?? "—"}
                  </span>
                  <span className="text-slate-500">{productsLabel}</span>
                </div>

                {/* Amount & Expand Toggle */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                  <div className="flex items-center gap-1.5">
                    {lineCount > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleRow(row.commission_id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-pink-700 hover:text-pink-800 transition-colors cursor-pointer border-0 bg-transparent p-0"
                        aria-label={
                          isExpanded ? "Collapse details" : "Expand details"
                        }
                        aria-expanded={isExpanded}
                      >
                        <span>{isExpanded ? "Hide items" : "View items"}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <div
                    className={`text-base font-bold ${
                      row.status === "reversed"
                        ? "line-through text-slate-400"
                        : "text-slate-900"
                    }`}
                  >
                    {money(row.amount)}
                  </div>
                </div>

                {/* Expandable Line Items */}
                {isExpanded && (
                  <div className="border-t border-slate-100 pt-3 mt-1">
                    <CommissionLines row={row} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center"></th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCommissions.map((row) => {
                const isExpanded = expandedRowKeys.has(row.commission_id);
                const lineCount = row.lines?.length ?? 0;
                const productsLabel =
                  lineCount > 0
                    ? `${lineCount} product${lineCount === 1 ? "" : "s"}`
                    : "Whole order";

                return (
                  <React.Fragment key={row.commission_id}>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleRow(row.commission_id)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                          aria-label={
                            isExpanded ? "Collapse details" : "Expand details"
                          }
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {shortDate(row.date)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700">
                        {row.order_number ?? "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            row.level === 1
                              ? "bg-blue-50 text-blue-700 border border-blue-200/70"
                              : "bg-purple-50 text-purple-700 border border-purple-200/70"
                          }`}
                        >
                          L{row.level}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {productsLabel}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold ${
                          row.status === "reversed"
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {money(row.amount)}
                      </td>
                      <td className="py-3.5 px-4">{statusTag(row.status)}</td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={7} className="p-3 pl-12 pr-6">
                          <CommissionLines row={row} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {commissions.length > pageSize && (
        <Pagination
          currentPage={effectivePage}
          totalItems={commissions.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          itemLabel="transactions"
        />
      )}
    </div>
  );
};

export default CommissionTable;
