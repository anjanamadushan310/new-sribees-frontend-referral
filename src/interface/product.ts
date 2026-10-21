/**
 * Products interfaces and types.
 */
import type { PartnerTopProduct } from "./partner";

export interface TopProductsTableProps {
  products: PartnerTopProduct[];
  loading?: boolean;
  viewMode?: "auto" | "table" | "grid";
  className?: string;
  pageSize?: number;
}

export type ProductSortBy = "earned" | "units" | "orders" | "name";
export type ProductViewMode = "auto" | "table" | "grid";
