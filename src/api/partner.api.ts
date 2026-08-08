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
    commissionPercent: number;
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

export interface PartnerCommission {
    commission_id: string;
    order_number: string | null;
    date: string | null;
    amount: number;
    rate_percentage: number;
    level: number;
    status: 'pending' | 'claimable' | 'paid' | 'reversed';
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
};
