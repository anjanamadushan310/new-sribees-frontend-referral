import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import api from '../../api/client';
import PartnerWallet from '../../pages/PartnerWallet';

vi.mock('../../api/client', () => ({ default: { get: vi.fn(), post: vi.fn() } }));
const get = vi.mocked(api.get);
const post = vi.mocked(api.post);
function openWallet() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><MemoryRouter><PartnerWallet /></MemoryRouter></QueryClientProvider>);
}

describe('Partner Wallet', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        get.mockResolvedValue({ data: { data: { balance: '100.00', pendingCommission: '20.00', entries: [], withdrawals: [] } } } as Awaited<ReturnType<typeof api.get>>);
        post.mockResolvedValue({ data: {} } as Awaited<ReturnType<typeof api.post>>);
    });
    it('supports only Partner to Sribees transfers and reuses the key after an uncertain reply', async () => {
        post.mockRejectedValueOnce(new Error('reply lost'));
        openWallet();
        fireEvent.click(await screen.findByRole('button', { name: 'Transfer to Sribees Wallet' }));
        expect(screen.getByText(/cannot be transferred back/)).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('Amount (LKR)'), { target: { value: '25.50' } });
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        await screen.findByText(/Could not confirm the operation/);
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        await waitFor(() => expect(post).toHaveBeenCalledTimes(2));
        expect(post.mock.calls[0][0]).toBe('/partner/wallet/transfer-to-sribees');
        expect(post.mock.calls[0][1]).toEqual(post.mock.calls[1][1]);
        expect(post.mock.calls[0][1]).toMatchObject({ amount: '25.50' });
        expect(post.mock.calls[0][1]).not.toHaveProperty('user_id');
    });
    it('submits withdrawal details to a request endpoint rather than a payment endpoint', async () => {
        openWallet();
        fireEvent.click(await screen.findByRole('button', { name: 'Request bank withdrawal' }));
        for (const [label, value] of [['Amount (LKR)', '20.00'], ['Bank name', 'Test Bank'], ['Branch', 'Test'], ['Account holder name', 'Kamal Test'], ['Account number', '123456']]) {
            fireEvent.change(screen.getByLabelText(label), { target: { value } });
        }
        fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
        await waitFor(() => expect(post).toHaveBeenCalledWith('/partner/wallet/withdrawals', expect.objectContaining({ amount: '20.00', account_number: '123456' })));
    });
});
