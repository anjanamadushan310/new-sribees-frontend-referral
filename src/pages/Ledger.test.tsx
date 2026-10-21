import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PartnerProfile } from '../api/partner.api';
import { partnerApi } from '../api/partner.api';
import Ledger from './Ledger';
import { ToastProvider } from '../components/Common/Toast';

vi.mock('../api/partner.api', () => ({
    partnerApi: {
        me: vi.fn(),
        commissions: vi.fn(),
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

function renderLedger() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <ToastProvider>
                <MemoryRouter initialEntries={['/ledger']}>
                    <Routes>
                        <Route path="/ledger" element={<Ledger />} />
                        <Route path="/" element={<p>dashboard</p>} />
                        <Route path="/login" element={<p>login page</p>} />
                    </Routes>
                </MemoryRouter>
            </ToastProvider>
        </QueryClientProvider>,
    );
}

describe('Ledger Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.me.mockResolvedValue(profile());
        api.commissions.mockResolvedValue([
            {
                commission_id: 'c-1',
                order_number: 'SB-1001',
                date: '2026-09-20T00:00:00Z',
                amount: 90,
                rate_percentage: 3,
                level: 1,
                status: 'claimable',
                lines: [
                    {
                        product_id: 'r',
                        product_name: 'Samba Rice 5kg',
                        quantity: 2,
                        returned_quantity: 0,
                        rate_percentage: 5,
                        amount: 90,
                    },
                ],
            },
            {
                commission_id: 'c-2',
                order_number: 'SB-1002',
                date: '2026-09-21T00:00:00Z',
                amount: 45,
                rate_percentage: 3,
                level: 2,
                status: 'paid',
                lines: [
                    {
                        product_id: 't',
                        product_name: 'Ceylon Tea 400g',
                        quantity: 1,
                        returned_quantity: 0,
                        rate_percentage: 10,
                        amount: 45,
                    },
                ],
            },
        ]);
    });

    it('renders ledger header, stat cards, and commission transactions', async () => {
        renderLedger();

        expect(await screen.findByRole('heading', { level: 1, name: 'Commission Ledger' })).toBeInTheDocument();
        expect(screen.getByText('READY TO CLAIM')).toBeInTheDocument();
        expect(screen.getByText('LEVEL 1 EARNED')).toBeInTheDocument();
        expect(screen.getByText('LEVEL 2 EARNED')).toBeInTheDocument();
        expect(screen.getByText('TOTAL EARNED')).toBeInTheDocument();
        expect(await screen.findByText('SB-1001')).toBeInTheDocument();
        expect(screen.getByText('SB-1002')).toBeInTheDocument();
        expect(screen.getByText('Ready')).toBeInTheDocument();
        expect(screen.getAllByText('Paid').length).toBeGreaterThan(0);
    });

    it('filters ledger entries by search query', async () => {
        renderLedger();

        expect(await screen.findByText('SB-1001')).toBeInTheDocument();
        const searchInput = screen.getByPlaceholderText('Search by order # or product name...');
        fireEvent.change(searchInput, { target: { value: 'SB-1002' } });

        expect(screen.getByText('SB-1002')).toBeInTheDocument();
        expect(screen.queryByText('SB-1001')).not.toBeInTheDocument();
    });

    it('expands row details to reveal line item breakdown', async () => {
        renderLedger();

        expect(await screen.findByText('SB-1001')).toBeInTheDocument();
        const expandButtons = screen.getAllByLabelText('Expand details');

        // c-2 is newest (2026-09-21)
        fireEvent.click(expandButtons[0]);
        expect(await screen.findByText('Ceylon Tea 400g')).toBeInTheDocument();

        // c-1 is older (2026-09-20)
        fireEvent.click(expandButtons[1]);
        expect(await screen.findByText('Samba Rice 5kg')).toBeInTheDocument();
    });
});
