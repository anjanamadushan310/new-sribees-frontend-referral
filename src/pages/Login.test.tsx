import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App as AntApp } from 'antd';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { partnerApi } from '../api/partner.api';
import Login from './Login';

vi.mock('../api/partner.api', () => ({ partnerApi: { login: vi.fn() } }));
const login = vi.mocked(partnerApi.login);

function renderLogin() {
    return render(
        <QueryClientProvider client={new QueryClient()}>
            <AntApp>
                <MemoryRouter initialEntries={['/login']}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<p>dashboard</p>} />
                    </Routes>
                </MemoryRouter>
            </AntApp>
        </QueryClientProvider>,
    );
}

function signIn(email: string, password: string) {
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
    fireEvent.click(screen.getByText('Sign in').closest('button')!);
}

describe('Partner login', () => {
    beforeEach(() => {
        login.mockReset();
    });

    it('opens the dashboard once the server accepts the partner', async () => {
        login.mockResolvedValue('Kamal');
        renderLogin();
        signIn('agent@example.test', 'pw');
        await waitFor(() => expect(login).toHaveBeenCalledWith('agent@example.test', 'pw'));
        expect(await screen.findByText('dashboard')).toBeInTheDocument();
    });

    it("shows the server's one message for every refusal, so it cannot reveal who is an agent", async () => {
        login.mockImplementation(async () => {
            throw Object.assign(new Error('401'), {
                response: { data: { detail: { error: { message: 'Invalid email or password' } } } },
            });
        });
        renderLogin();
        signIn('nobody@example.test', 'pw');
        expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
        expect(screen.queryByText('dashboard')).not.toBeInTheDocument();
    });

    it('falls back to a plain message when the server said nothing', async () => {
        login.mockImplementation(async () => {
            throw new Error('Network Error');
        });
        renderLogin();
        signIn('agent@example.test', 'pw');
        expect(await screen.findByText('Could not sign in. Please try again.')).toBeInTheDocument();
    });

    it('asks for both fields before calling the server', async () => {
        renderLogin();
        fireEvent.click(screen.getByText('Sign in').closest('button')!);
        expect(await screen.findByText('Enter your email')).toBeInTheDocument();
        expect(screen.getByText('Enter your password')).toBeInTheDocument();
        expect(login).not.toHaveBeenCalled();
    });
});
