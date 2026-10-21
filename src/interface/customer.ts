/**
 * Customer page and table interfaces and types.
 */
import type { PartnerCustomer } from "./partner";

export interface CustomerTableProps {
  customers: PartnerCustomer[];
  loading?: boolean;
}

export type CustomerSortBy = "earned" | "orders" | "recent" | "name";
