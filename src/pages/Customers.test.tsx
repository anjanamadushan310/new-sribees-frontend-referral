import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PartnerProfile } from '../api/partner.api';
import { partnerApi } from '../api/partner.api';
import Customers from './Customers';
import { ToastProvider } from '../components/Common/Toast';

vi.mock('../api/partner.api', () => ({
    partnerApi: {
        me: vi.fn(),
        customers: vi.fn(),
        recruit: vi.fn(),
        logout: vi.fn(),
    },
}));
const api = vi.mocked(partnerApi);

const profile = (over: Partial<PartnerProfile> = {}): PartnerProfile => ({
    partnerId: 'p-1',
    fullName: 'Kamal Silva',
    email: 'kamal@example.test',
    referralCode: 'KAMAL7',
    commissionPercent: 3,
    currency: 'LKR',
    hasUpline: false,
    totals: { pending: 1200, claimable: 800, paid: 5000 },
    byLevel: { level1: 6000, level2: 1000 },
    ...over,
});

function renderCustomers() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <ToastProvider>
                <MemoryRouter initialEntries={['/customers']}>
                    <Routes>
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/" element={<p>dashboard</p>} />
                        <Route path="/login" element={<p>login page</p>} />
                    </Routes>
                </MemoryRouter>
            </ToastProvider>
        </QueryClientProvider>,
    );
}

describe('Customers Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.me.mockResolvedValue(profile());
        api.customers.mockResolvedValue([
            { user_id: 'u-1', name: 'Nimal Perera', member_id: 'SB-0001', joined_at: '2026-09-01T00:00:00Z', orders: 4, total_earned: 300 },
            { user_id: 'u-2', name: 'Anura Dias', member_id: 'SB-0002', joined_at: '2026-09-05T00:00:00Z', orders: 2, total_earned: 150 },
        ]);
    });

    it('renders customer overview stats and customer list', async () => {
        renderCustomers();

        expect(await screen.findByRole('heading', { level: 1, name: 'My Customers' })).toBeInTheDocument();
        expect(await screen.findByText('KAMAL7')).toBeInTheDocument();
        expect(screen.getByText('TOTAL CUSTOMERS')).toBeInTheDocument();
        expect(screen.getByText('TOTAL ORDERS')).toBeInTheDocument();
        expect(await screen.findByText('Nimal Perera')).toBeInTheDocument();
        expect(screen.getByText('Anura Dias')).toBeInTheDocument();
        expect(screen.getByText('SB-0001')).toBeInTheDocument();
        expect(screen.getByText('SB-0002')).toBeInTheDocument();
    });

    it('filters customer list by customer name or member id', async () => {
        renderCustomers();

        expect(await screen.findByText('Nimal Perera')).toBeInTheDocument();
        const searchInput = screen.getByPlaceholderText('Search by customer name or member ID...');
        fireEvent.change(searchInput, { target: { value: 'SB-0002' } });

        expect(screen.getByText('Anura Dias')).toBeInTheDocument();
        expect(screen.queryByText('Nimal Perera')).not.toBeInTheDocument();
    });
});
