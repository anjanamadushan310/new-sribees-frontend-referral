import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PartnerProfile } from '../api/partner.api';
import { partnerApi } from '../api/partner.api';
import Dashboard from './Dashboard';

vi.mock('../api/partner.api', () => ({
    partnerApi: {
        me: vi.fn(),
        customers: vi.fn(),
        recruits: vi.fn(),
        commissions: vi.fn(),
        recruit: vi.fn(),
        logout: vi.fn(),
    },
}));
const api = vi.mocked(partnerApi);

const profile = (over: Partial<PartnerProfile> = {}): PartnerProfile => ({
    partnerId: 'p-1', fullName: 'Kamal Silva', email: 'kamal@example.test', referralCode: 'KAMAL7',
    commissionPercent: 3, currency: 'LKR', hasUpline: false,
    totals: { pending: 1200, claimable: 800, paid: 5000 }, byLevel: { level1: 6000, level2: 1000 }, ...over,
});

function renderDashboard() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <AntApp>
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<p>login page</p>} />
                    </Routes>
                </MemoryRouter>
            </AntApp>
        </QueryClientProvider>,
    );
}

function modal(): HTMLElement {
    const m = document.querySelector('.ant-modal');
    expect(m).not.toBeNull();
    return m as HTMLElement;
}

describe('Partner dashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.me.mockResolvedValue(profile());
        api.customers.mockResolvedValue([
            { user_id: 'u-1', name: 'Nimal', member_id: 'SB-0001', joined_at: '2026-09-01T00:00:00Z', orders: 4,
              total_earned: 300 },
        ]);
        api.recruits.mockResolvedValue([]);
        api.commissions.mockResolvedValue([
            { commission_id: 'c-1', order_number: 'SB-1001', date: '2026-09-20T00:00:00Z', amount: 90,
              rate_percentage: 3, level: 1, status: 'claimable' },
            { commission_id: 'c-2', order_number: 'SB-1002', date: '2026-09-21T00:00:00Z', amount: 45,
              rate_percentage: 3, level: 1, status: 'reversed' },
        ]);
        api.recruit.mockResolvedValue(undefined);
    });

    it('shows the invite code, the rate and the customers it brought in', async () => {
        renderDashboard();
        expect(await screen.findByText('KAMAL7')).toBeInTheDocument();
        expect(screen.getByText('3% of every order your customers place')).toBeInTheDocument();
        expect(await screen.findByText('Nimal')).toBeInTheDocument();
        expect(screen.getByText('SB-0001')).toBeInTheDocument();
        expect(screen.getByText('My Customers (1)')).toBeInTheDocument();
    });

    it('names each commission state in plain words', async () => {
        renderDashboard();
        fireEvent.click(await screen.findByText('Commission Ledger'));
        const ready = (await screen.findByText('SB-1001')).closest('tr')!;
        expect(within(ready).getByText('Ready')).toBeInTheDocument();
        const reversed = screen.getByText('SB-1002').closest('tr')!;
        expect(within(reversed).getByText('Cancelled')).toBeInTheDocument();
    });

    it('a recruited partner cannot recruit in turn: two levels, no deeper', async () => {
        api.me.mockResolvedValue(profile({ hasUpline: true }));
        renderDashboard();
        await screen.findByText('KAMAL7');
        expect(screen.queryByText('Recruit a partner')).not.toBeInTheDocument();
        expect(screen.queryByText(/My Team/)).not.toBeInTheDocument();
    });

    it('recruits a partner only with a valid form', async () => {
        renderDashboard();
        fireEvent.click((await screen.findByText('Recruit a partner')).closest('button')!);
        await waitFor(() => modal());
        fireEvent.click(within(modal()).getByText('Recruit').closest('button')!);
        expect(await within(modal()).findByText('Name is required')).toBeInTheDocument();
        expect(api.recruit).not.toHaveBeenCalled();

        fireEvent.change(within(modal()).getByPlaceholderText('e.g. Nadeesha Fernando'),
            { target: { value: '  Nadeesha  ' } });
        fireEvent.change(within(modal()).getByPlaceholderText('partner@example.com'),
            { target: { value: 'nadeesha@example.test' } });
        const password = modal().querySelector('input[type="password"]') as HTMLInputElement;
        fireEvent.change(password, { target: { value: 'Strong-Pass-123' } });
        fireEvent.click(within(modal()).getByText('Recruit').closest('button')!);
        await waitFor(() => expect(api.recruit).toHaveBeenCalled());
        expect(api.recruit.mock.calls[0][0]).toMatchObject({
            full_name: 'Nadeesha', email: 'nadeesha@example.test', phone: undefined,
        });
    });

    it('signing out clears the session and returns to the login page', async () => {
        renderDashboard();
        await screen.findByText('KAMAL7');
        fireEvent.click(screen.getByText('Sign out').closest('button')!);
        expect(api.logout).toHaveBeenCalled();
        expect(await screen.findByText('login page')).toBeInTheDocument();
    });
});
