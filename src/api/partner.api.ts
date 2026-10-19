/**
 * Partner Portal API — profile, customers, recruits and the commission ledger.
 *
 * Every endpoint is scoped server-side to the authenticated partner; none of
 * them accept a partner id, so there is nothing here to tamper with.
 */
import apiClient, { TOKEN_KEY } from './client';

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

export interface PartnerCommission {
    commission_id: string;
    order_number: string | null;
    date: string | null;
    amount: number;
    /** Blended over the order; the lines carry each product's own rate. */
    rate_percentage: number;
    level: number;
    status: 'pending' | 'claimable' | 'paid' | 'reversed';
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

export const partnerApi = {
    login: async (email: string, password: string): Promise<PartnerProfile['fullName']> => {
        const res = await apiClient.post<{
            success: boolean;
            data: { token: string; partner: { fullName: string } };
        }>('/partner/auth/login', { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.data.token);
        return res.data.data.partner.fullName;
    },

    logout: () => localStorage.removeItem(TOKEN_KEY),

    me: async (): Promise<PartnerProfile> => {
        const res = await apiClient.get<{ data: PartnerProfile }>('/partner/me');
        return res.data.data;
    },

    customers: async (): Promise<PartnerCustomer[]> => {
        const res = await apiClient.get<{ data: { customers: PartnerCustomer[] } }>(
            '/partner/customers'
        );
        return res.data.data.customers;
    },

    recruits: async (): Promise<PartnerRecruit[]> => {
        const res = await apiClient.get<{ data: { recruits: PartnerRecruit[] } }>(
            '/partner/recruits'
        );
        return res.data.data.recruits;
    },

    commissions: async (): Promise<PartnerCommission[]> => {
        const res = await apiClient.get<{ data: { commissions: PartnerCommission[] } }>(
            '/partner/commissions'
        );
        return res.data.data.commissions;
    },

    topProducts: async (): Promise<PartnerTopProduct[]> => {
        const res = await apiClient.get<{ data: { products: PartnerTopProduct[] } }>(
            '/partner/top-products'
        );
        return res.data.data.products;
    },

    recruit: async (payload: RecruitPartnerPayload): Promise<void> => {
        await apiClient.post('/partner/recruits', payload);
    },
};
