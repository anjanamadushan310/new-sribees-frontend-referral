/**
 * Customer page and table interfaces and types.
 */
import type { PartnerCustomer } from "./partner";

export interface CustomerTableProps {
  customers: PartnerCustomer[];
  loading?: boolean;
  pageSize?: number;
}

export type CustomerSortBy = "earned" | "orders" | "recent" | "name";
