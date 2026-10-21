import React from "react";
import { money, shortDate } from "./tableUtils";

import type { CustomerTableProps } from "../../interface/customer";

export type { CustomerTableProps };

const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading = false,
}) => {
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
