/**
 * Partner Portal domain data models and API payload definitions.
 */

export interface PartnerProfile {
  partnerId: string;
  fullName: string;
  email: string;
  referralCode: string;
  /** The best rate on offer today: commission is set per product. */
  commissionPercent: number;
  /** The server's sentence for it, e.g. "Earn up to 5% on selected products…". */
  commissionText?: string;
  currency: string;
  hasUpline: boolean;
  role?: 'master_partner' | 'partner';
  linkedUserId?: string | null;
  canRecruit?: boolean;
  requiresUpgradeApproval?: boolean;
  totals: { pending: number; claimable: number; paid: number };
  byLevel: { level1: number; level2: number };
}

export interface PartnerCustomer {
  user_id: string;
  name: string;
  member_id: string;
  joined_at: string | null;
  orders: number;
  total_earned: number;
}

export interface PartnerRecruit {
  partner_id: string;
  name: string;
  joined_at: string | null;
  is_active: boolean;
  total_earned: number;
}

/** What one product in an order earned. Never what the customer paid. */
export interface PartnerCommissionLine {
  product_id: string;
  product_name: string;
  quantity: number;
  returned_quantity: number;
  rate_percentage: number;
  amount: number;
}

export type PartnerCommissionStatus = "pending" | "claimable" | "paid" | "reversed";

export interface PartnerCommission {
  commission_id: string;
  order_number: string | null;
  date: string | null;
  amount: number;
  /** Blended over the order; the lines carry each product's own rate. */
  rate_percentage: number;
  level: number;
  status: PartnerCommissionStatus;
  /** Empty for orders from before per-product commission (one flat rate). */
  lines?: PartnerCommissionLine[];
}

export interface PartnerTopProduct {
  product_id: string;
  product_name: string;
  total_earned: number;
  /** Units net of returns. */
  units: number;
  orders: number;
}

export interface RecruitPartnerPayload {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
}
