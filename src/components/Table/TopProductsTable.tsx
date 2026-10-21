import React from "react";
import { ShoppingBag, Package, ShoppingCart, Trophy } from "lucide-react";
import { money } from "./tableUtils";
import { useIsMobile } from "../../hooks/useIsMobile";

import type { TopProductsTableProps } from "../../interface/product";

export type { TopProductsTableProps };

const TopProductsTable: React.FC<TopProductsTableProps> = ({
  products,
  loading = false,
  viewMode = "auto",
  className = "",
}) => {
  const isMobile = useIsMobile(768);
  const showGrid = viewMode === "grid" || (viewMode === "auto" && isMobile);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-pink-600" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
        <Package className="h-10 w-10 text-slate-300 mb-2" />
        <p className="text-sm text-slate-500 m-0">
          No product has earned you commission yet.
        </p>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 ${className}`}
      >
        {products.map((product, index) => {
          const isTopThree = index < 3;
          return (
            <div
              key={product.product_id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-[0_10px_25px_rgba(216,27,96,.1)]"
            >
              {/* Header: Rank + Icon + Badges */}
              <div>
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 px-2 items-center justify-center rounded-lg text-xs font-bold tracking-tight shrink-0 ${
                        index === 0
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : index === 1
                          ? "bg-slate-200 text-slate-700 border border-slate-300"
                          : index === 2
                          ? "bg-orange-100 text-orange-800 border border-orange-300"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isTopThree && <Trophy className="mr-1 h-3 w-3 inline" />}
                      #{index + 1}
                    </span>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-pink-50 text-pink-600">
                      <ShoppingBag className="h-4 w-4" />
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/90 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                    <Package className="h-3 w-3" />
                    {product.units} {product.units === 1 ? "unit" : "units"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.product_name}
                </h3>
                <div className="mt-0.5 text-[11px] font-mono text-slate-400">
                  ID: {product.product_id}
                </div>
              </div>

              {/* Commission & Orders */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-xl bg-pink-50/70 p-2.5 border border-pink-100/60">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    You Earned
                  </span>
                  <span className="text-base font-extrabold text-pink-700">
                    {money(product.total_earned)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShoppingCart className="h-3.5 w-3.5 text-slate-400" />
                    Orders
                  </span>
                  <span className="font-semibold text-slate-700">
                    {product.orders}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-3 px-4 w-14">#</th>
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4 text-right">Orders</th>
            <th className="py-3 px-4 text-right">Units</th>
            <th className="py-3 px-4 text-right">You earned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product, index) => (
            <tr
              key={product.product_id}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="py-3.5 px-4">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0
                      ? "bg-amber-100 text-amber-800"
                      : index === 1
                      ? "bg-slate-200 text-slate-700"
                      : index === 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {index + 1}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-pink-50 text-pink-600">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-800">
                      {product.product_name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      ID: {product.product_id}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 text-right text-slate-700">
                {product.orders}
              </td>
              <td className="py-3.5 px-4 text-right text-slate-700">
                {product.units}
              </td>
              <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                {money(product.total_earned)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopProductsTable;
