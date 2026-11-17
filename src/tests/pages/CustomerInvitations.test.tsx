import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { partnerApi } from '../../api/partner.api';
import { ToastProvider } from '../../components/Common/Toast';
import Customers from '../../pages/Customers';

vi.mock('../../api/partner.api', () => ({
  partnerApi: { me: vi.fn(), customers: vi.fn(), upgradeCustomer: vi.fn(), resendCustomerInvitation: vi.fn(), logout: vi.fn() },
}));
const api = vi.mocked(partnerApi);

describe('customer invitation channels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.me.mockResolvedValue({
      partnerId: 'master', fullName: 'Master', email: 'master@example.test', referralCode: 'MASTER',
      commissionPercent: 1, currency: 'LKR', hasUpline: false, role: 'master_partner', canRecruit: true,
      totals: { pending: 0, claimable: 0, paid: 0 }, byLevel: { level1: 0, level2: 0 },
    });
    api.customers.mockResolvedValue([
      { user_id: 'customer', name: 'Customer Test', member_id: 'ABC123', joined_at: null, orders: 0, total_earned: 0 },
    ]);
  });

  it('resends links to an existing Partner without upgrading again', async () => {
    api.customers.mockResolvedValue([
      { user_id: 'existing', name: 'Existing Partner', member_id: 'ABC123', joined_at: null,
        orders: 2, total_earned: 20, partner_role: 'partner' },
    ]);
    api.resendCustomerInvitation.mockResolvedValue({
      invitation_sent: true, invitation_delivery: { sms: true, email: true },
    });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ToastProvider><MemoryRouter><Customers /></MemoryRouter></ToastProvider></QueryClientProvider>);
    fireEvent.click(await screen.findByRole('button', { name: 'Resend setup links' }));
    expect(screen.getByRole('heading', { name: 'Resend password setup links' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resend Email & SMS' }));
    expect(await screen.findByText('Partner account ready. Password setup links were sent by email and SMS.')).toBeInTheDocument();
    expect(api.resendCustomerInvitation).toHaveBeenCalledWith('existing');
    expect(api.upgradeCustomer).not.toHaveBeenCalled();
  });

  it.each([
    [true, true, 'Partner account created. Password setup links were sent by email and SMS.'],
    [true, false, 'Partner account created. SMS was sent, but the email could not be sent.'],
    [false, true, 'Partner account created. Email was sent, but the SMS could not be sent.'],
    [false, false, 'Partner account created, but email and SMS could not be sent. Contact Sribees support for a new invitation.'],
  ] as const)('reports SMS=%s and email=%s accurately', async (sms, email, notification) => {
    api.upgradeCustomer.mockResolvedValue({ invitation_sent: sms || email, invitation_delivery: { sms, email } });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ToastProvider><MemoryRouter><Customers /></MemoryRouter></ToastProvider></QueryClientProvider>);
    fireEvent.click(await screen.findByRole('button', { name: 'Make Partner' }));
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Make Partner & Send Links' }));
    expect(await screen.findByText(notification)).toBeInTheDocument();
    expect(api.upgradeCustomer).toHaveBeenCalledWith('customer');
  });
});
