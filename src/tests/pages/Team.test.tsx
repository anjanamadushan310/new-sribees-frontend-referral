import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PartnerProfile } from '../../api/partner.api';
import { partnerApi } from '../../api/partner.api';
import Team from '../../pages/Team';
import { ToastProvider } from '../../components/Common/Toast';

vi.mock('../../api/partner.api', () => ({
    partnerApi: {
        me: vi.fn(),
        recruits: vi.fn(),
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

function renderTeam() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <ToastProvider>
                <MemoryRouter initialEntries={['/team']}>
                    <Routes>
                        <Route path="/team" element={<Team />} />
                        <Route path="/" element={<p>dashboard</p>} />
                        <Route path="/login" element={<p>login page</p>} />
                    </Routes>
                </MemoryRouter>
            </ToastProvider>
        </QueryClientProvider>,
    );
}

describe('Team Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.me.mockResolvedValue(profile());
        api.recruits.mockResolvedValue([
            { partner_id: 'rec-1', name: 'Nadeesha Fernando', joined_at: '2026-09-10T00:00:00Z', is_active: true, total_earned: 650 },
            { partner_id: 'rec-2', name: 'Saman Kumara', joined_at: '2026-09-12T00:00:00Z', is_active: false, total_earned: 200 },
        ]);
    });

    it('renders team overview stats and team members list', async () => {
        renderTeam();

        expect(await screen.findByRole('heading', { level: 1, name: 'My Team' })).toBeInTheDocument();
        expect(screen.getByText('TOTAL TEAM MEMBERS')).toBeInTheDocument();
        expect(screen.getByText('ACTIVE PARTNERS')).toBeInTheDocument();
        expect(screen.getByText('LEVEL 2 EARNINGS')).toBeInTheDocument();
        expect(await screen.findByText('Nadeesha Fernando')).toBeInTheDocument();
        expect(screen.getByText('Saman Kumara')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('filters team members by search query', async () => {
        renderTeam();

        expect(await screen.findByText('Nadeesha Fernando')).toBeInTheDocument();
        const searchInput = screen.getByPlaceholderText('Search partner by name or ID...');
        fireEvent.change(searchInput, { target: { value: 'Saman' } });

        expect(screen.getByText('Saman Kumara')).toBeInTheDocument();
        expect(screen.queryByText('Nadeesha Fernando')).not.toBeInTheDocument();
    });

    it('displays single-tier account warning when partner has an upline', async () => {
        api.me.mockResolvedValue(profile({ hasUpline: true }));
        renderTeam();

        expect(await screen.findByText('Partner Account')).toBeInTheDocument();
        expect(screen.queryByText('Recruit Partner')).not.toBeInTheDocument();
    });
});
