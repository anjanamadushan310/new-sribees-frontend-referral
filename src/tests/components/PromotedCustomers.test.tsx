import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CustomerTable } from '../../components/Table';
import { useIsMobile } from '../../hooks/useIsMobile';

vi.mock('../../hooks/useIsMobile', () => ({ useIsMobile: vi.fn() }));

describe('promoted customer directory', () => {
  it.each([false, true])('shows the Partner badge and preserves earnings on mobile=%s', (mobile) => {
    vi.mocked(useIsMobile).mockReturnValue(mobile);
    const promote = vi.fn();
    render(<CustomerTable canPromote onPromote={promote} customers={[
      { user_id: 'upgraded', name: 'Upgraded customer', member_id: 'ABC123', joined_at: null,
        orders: 2, total_earned: 80, partner_role: 'partner' },
      { user_id: 'customer', name: 'Regular customer', member_id: 'DEF456', joined_at: null,
        orders: 1, total_earned: 10 },
    ]} />);
    expect(screen.getByText('Upgraded customer')).toBeInTheDocument();
    expect(screen.getByText('Partner')).toBeInTheDocument();
    expect(screen.getByText(/80\.00/)).toBeInTheDocument();
    const buttons = screen.getAllByRole('button', { name: 'Make Partner' });
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    expect(promote.mock.calls[0][0].user_id).toBe('customer');
  });
});
