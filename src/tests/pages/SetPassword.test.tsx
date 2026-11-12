import { StrictMode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from '../../api/client';
import SetPassword from '../../pages/SetPassword';

vi.mock('../../api/client', () => ({ default: { post: vi.fn() } }));
const post = vi.mocked(apiClient.post);

function open(token = 'test-invitation') {
    window.history.replaceState({}, '', `/set-password${token ? `#token=${token}` : ''}`);
    render(<StrictMode><MemoryRouter><SetPassword /></MemoryRouter></StrictMode>);
}
function fill(confirmation = 'My password 19!') {
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'My password 19!' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: confirmation } });
    fireEvent.submit(screen.getByRole('button', { name: 'Set Password' }).closest('form')!);
}

describe('Partner invitation password setup', () => {
    beforeEach(() => { vi.clearAllMocks(); });
    it('requires a complete invitation link', () => {
        open('');
        expect(screen.getByText(/Open the full link/)).toBeInTheDocument();
        expect(post).not.toHaveBeenCalled();
    });
    it('keeps the token through StrictMode and removes it from the URL', async () => {
        post.mockResolvedValueOnce({ data: { success: true } });
        open();
        expect(window.location.hash).toBe('');
        fill();
        await waitFor(() => expect(post).toHaveBeenCalledWith('/partner/auth/set-password', {
            token: 'test-invitation', password: 'My password 19!',
        }));
        expect(await screen.findByRole('link', { name: 'Sign in to Partner Portal' })).toHaveAttribute('href', '/login');
    });
    it('requires matching passwords', async () => {
        open();
        fill('Other password 19!');
        expect(await screen.findByRole('alert')).toHaveTextContent('Passwords must match.');
        expect(post).not.toHaveBeenCalled();
    });
    it('shows an expired link error and recovery option', async () => {
        post.mockRejectedValueOnce({ response: { data: { detail: 'This invitation is invalid or expired.' } } });
        open();
        fill();
        expect(await screen.findByRole('alert')).toHaveTextContent('invalid or expired');
        expect(screen.getByRole('link', { name: /Request a verification code/ })).toHaveAttribute('href', '/forgot-password');
    });
});
