/**
 * Customer page and table interfaces and types.
 */
import type { PartnerCustomer } from "./partner";

export interface CustomerTableProps {
  customers: PartnerCustomer[];
  loading?: boolean;
  pageSize?: number;
  canPromote?: boolean;
  promotingCustomerId?: string | null;
  onPromote?: (customer: PartnerCustomer) => void;
}

export type CustomerSortBy = "earned" | "orders" | "recent" | "name";
