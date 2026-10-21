import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PartnerProfile } from '../../api/partner.api';
import { partnerApi } from '../../api/partner.api';
import Products from '../../pages/Products';
import { ToastProvider } from '../../components/Common/Toast';

vi.mock('../../api/partner.api', () => ({
    partnerApi: {
        me: vi.fn(),
        topProducts: vi.fn(),
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

function renderProducts() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <ToastProvider>
                <MemoryRouter initialEntries={['/products']}>
                    <Routes>
                        <Route path="/products" element={<Products />} />
                        <Route path="/" element={<p>dashboard</p>} />
                        <Route path="/login" element={<p>login page</p>} />
                    </Routes>
                </MemoryRouter>
            </ToastProvider>
        </QueryClientProvider>,
    );
}

describe('Products Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        api.me.mockResolvedValue(profile());
        api.topProducts.mockResolvedValue([
            { product_id: 'prod-1', product_name: 'Samba Rice 5kg', total_earned: 150, units: 3, orders: 2 },
            { product_id: 'prod-2', product_name: 'Ceylon Tea 400g', total_earned: 50, units: 1, orders: 1 },
        ]);
    });

    it('renders the products page with summary stats and top products', async () => {
        renderProducts();

        expect(await screen.findByText('Samba Rice 5kg')).toBeInTheDocument();
        expect(screen.getByText('Ceylon Tea 400g')).toBeInTheDocument();
        expect(screen.getByText('TOTAL PRODUCT EARNINGS')).toBeInTheDocument();
        expect(screen.getByText('TOTAL UNITS SOLD')).toBeInTheDocument();
        expect(screen.getByText('TOTAL ORDERS GENERATED')).toBeInTheDocument();
    });

    it('filters products by search input', async () => {
        renderProducts();

        expect(await screen.findByText('Samba Rice 5kg')).toBeInTheDocument();
        const searchInput = screen.getByPlaceholderText('Search products by name or ID...');
        fireEvent.change(searchInput, { target: { value: 'Ceylon' } });

        expect(screen.getByText('Ceylon Tea 400g')).toBeInTheDocument();
        expect(screen.queryByText('Samba Rice 5kg')).not.toBeInTheDocument();
    });

    it('switches to grid view when toggled', async () => {
        renderProducts();

        expect(await screen.findByText('Samba Rice 5kg')).toBeInTheDocument();
        const gridToggle = screen.getByText('Grid');
        fireEvent.click(gridToggle);

        // In grid view, rank badges and unit labels are shown
        expect(screen.getByText('#1')).toBeInTheDocument();
        expect(screen.getByText('#2')).toBeInTheDocument();
        expect(screen.getByText('3 units')).toBeInTheDocument();
        expect(screen.getByText('1 unit')).toBeInTheDocument();
    });
});
