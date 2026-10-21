/**
 * Ledger and commission transaction interfaces and types.
 */
import type { PartnerCommission } from "./partner";

export interface CommissionTableProps {
  commissions: PartnerCommission[];
  loading?: boolean;
  pageSize?: number;
}

export interface CommissionLinesProps {
  row: PartnerCommission;
  pageSize?: number;
}

export type LedgerSortBy = "newest" | "oldest" | "highest" | "lowest";
export type LedgerStatusFilter = "all" | "pending" | "claimable" | "paid" | "reversed" | string;
export type LedgerLevelFilter = "all" | "1" | "2" | string;
