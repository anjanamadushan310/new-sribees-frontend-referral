/**
 * Partner Portal API — profile, customers, recruits and the commission ledger.
 *
 * Every endpoint is scoped server-side to the authenticated partner; none of
 * them accept a partner id, so there is nothing here to tamper with.
 */
import apiClient, { TOKEN_KEY } from './client';
import type {
    PartnerProfile,
    PartnerCustomer,
    PartnerRecruit,
    PartnerCommissionLine,
    PartnerCommission,
    PartnerTopProduct,
    RecruitPartnerPayload,
} from '../interface/partner';

export type {
    PartnerProfile,
    PartnerCustomer,
    PartnerRecruit,
    PartnerCommissionLine,
    PartnerCommission,
    PartnerTopProduct,
    RecruitPartnerPayload,
};

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
