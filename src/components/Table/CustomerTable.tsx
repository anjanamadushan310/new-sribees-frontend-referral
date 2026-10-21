import React from "react";
import { money, shortDate } from "./tableUtils";
import { useIsMobile } from "../../hooks/useIsMobile";

import type { CustomerTableProps } from "../../interface/customer";

export type { CustomerTableProps };

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading = false,
}) => {
  const isMobile = useIsMobile(768);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-pink-600" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400">
        No one has signed up with your code yet.
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {customers.map((c) => (
          <div
            key={c.user_id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.04)] flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
          >
            {/* Top: Customer Name & Member ID */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="m-0 text-base font-bold text-slate-800 truncate">
                  {c.name}
                </h4>
                <span className="font-mono text-xs text-slate-500 font-medium">
                  {c.member_id}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Joined
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {shortDate(c.joined_at)}
                </span>
              </div>
            </div>

            {/* Bottom: Orders & Total Earned */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
              <div>
                <span className="text-xs text-slate-500">Orders: </span>
                <span className="text-xs font-bold text-slate-700">{c.orders}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 mr-1.5">You earned:</span>
                <span className="text-sm font-bold text-pink-700">
                  {money(c.total_earned)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">ID</th>
            <th className="py-3 px-4">Joined</th>
            <th className="py-3 px-4 text-right">Orders</th>
            <th className="py-3 px-4 text-right">You earned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {customers.map((c) => (
            <tr
              key={c.user_id}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="py-3.5 px-4 font-medium text-slate-800">{c.name}</td>
              <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                {c.member_id}
              </td>
              <td className="py-3.5 px-4 text-slate-600">
                {shortDate(c.joined_at)}
              </td>
              <td className="py-3.5 px-4 text-right text-slate-700">
                {c.orders}
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                {money(c.total_earned)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
