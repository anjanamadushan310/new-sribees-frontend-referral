/**
 * Team and recruit interfaces and types.
 */
import type { PartnerRecruit } from "./partner";

export interface RecruitTableProps {
  recruits: PartnerRecruit[];
  loading?: boolean;
}

export type TeamStatusFilter = "all" | "active" | "inactive";
export type TeamSortBy = "earned" | "recent" | "name";
