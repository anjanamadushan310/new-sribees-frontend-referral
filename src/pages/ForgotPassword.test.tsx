import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { partnerApi } from '../api/partner.api';
import ForgotPassword from './ForgotPassword';

vi.mock('../api/partner.api', () => ({
    partnerApi: {
        forgotPassword: vi.fn(),
        verifyOtp: vi.fn(),
        resetPassword: vi.fn(),
    },
}));

const mockedApi = vi.mocked(partnerApi);

function renderForgotPassword() {
    return render(
        <MemoryRouter initialEntries={['/forgot-password']}>
            <Routes>
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<p>Login Page</p>} />
            </Routes>
        </MemoryRouter>
    );
}

describe('ForgotPassword Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial email step correctly', () => {
        renderForgotPassword();
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByText('Send OTP Code')).toBeInTheDocument();
        expect(screen.getByText('Back to Sign In')).toBeInTheDocument();
    });

    it('requires email before calling forgotPassword API', () => {
        renderForgotPassword();
        fireEvent.click(screen.getByText('Send OTP Code').closest('button')!);
        expect(mockedApi.forgotPassword).not.toHaveBeenCalled();
    });

    it('transitions to OTP step when OTP request succeeds', async () => {
        mockedApi.forgotPassword.mockResolvedValueOnce({
            success: true,
            message: 'Verification code has been sent to your email address.',
        });

        renderForgotPassword();

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'partner@example.com' },
        });
        fireEvent.click(screen.getByText('Send OTP Code').closest('button')!);

        await waitFor(() => {
            expect(mockedApi.forgotPassword).toHaveBeenCalledWith('partner@example.com');
        });

        expect(await screen.findByText('Enter Verification Code')).toBeInTheDocument();
        expect(screen.getByText('partner@example.com')).toBeInTheDocument();
        expect(screen.getByTestId('otp-input-0')).toBeInTheDocument();
    });

    it('displays error message when OTP request fails', async () => {
        mockedApi.forgotPassword.mockRejectedValueOnce({
            response: {
                data: {
                    message: 'No partner account found with this email address.',
                },
            },
        });

        renderForgotPassword();

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'unknown@example.com' },
        });
        fireEvent.click(screen.getByText('Send OTP Code').closest('button')!);

        expect(
            await screen.findByText('No partner account found with this email address.')
        ).toBeInTheDocument();
    });

    it('completes the full flow: request OTP -> verify OTP -> reset password', async () => {
        mockedApi.forgotPassword.mockResolvedValueOnce({
            success: true,
            message: 'OTP sent',
        });
        mockedApi.verifyOtp.mockResolvedValueOnce({
            success: true,
            message: 'OTP verified successfully.',
        });
        mockedApi.resetPassword.mockResolvedValueOnce({
            success: true,
            message: 'Password reset successful',
        });

        renderForgotPassword();

        // 1. Submit email
        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'agent@example.com' },
        });
        fireEvent.click(screen.getByText('Send OTP Code').closest('button')!);

        expect(await screen.findByText('Enter Verification Code')).toBeInTheDocument();

        // 2. Enter 6 digits
        for (let i = 0; i < 6; i++) {
            fireEvent.change(screen.getByTestId(`otp-input-${i}`), {
                target: { value: String(i + 1) },
            });
        }

        const verifyBtn = screen.getByText('Verify Code').closest('button')!;
        expect(verifyBtn).not.toBeDisabled();
        fireEvent.click(verifyBtn);

        await waitFor(() => {
            expect(mockedApi.verifyOtp).toHaveBeenCalledWith('agent@example.com', '123456');
        });

        // 3. New password step
        expect(await screen.findByText('Create New Password')).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText('New Password'), {
            target: { value: 'NewSecret123!' },
        });
        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: 'NewSecret123!' },
        });

        fireEvent.click(screen.getByText('Reset Password').closest('button')!);

        await waitFor(() => {
            expect(mockedApi.resetPassword).toHaveBeenCalledWith({
                email: 'agent@example.com',
                otp: '123456',
                newPassword: 'NewSecret123!',
                confirmPassword: 'NewSecret123!',
            });
        });

        // 4. Success state
        expect(await screen.findByText('Password Reset Complete!')).toBeInTheDocument();

        // Navigate to login
        fireEvent.click(screen.getByText('Sign In Now'));
        expect(await screen.findByText('Login Page')).toBeInTheDocument();
    });

    it('shows error if password is shorter than 8 characters or does not match', async () => {
        mockedApi.forgotPassword.mockResolvedValueOnce({ success: true, message: 'OTP sent' });
        mockedApi.verifyOtp.mockResolvedValueOnce({ success: true, message: 'OTP verified' });

        renderForgotPassword();

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'agent@example.com' },
        });
        fireEvent.click(screen.getByText('Send OTP Code').closest('button')!);

        await screen.findByText('Enter Verification Code');

        for (let i = 0; i < 6; i++) {
            fireEvent.change(screen.getByTestId(`otp-input-${i}`), {
                target: { value: '9' },
            });
        }
        fireEvent.click(screen.getByText('Verify Code').closest('button')!);

        await screen.findByText('Create New Password');

        fireEvent.change(screen.getByLabelText('New Password'), {
            target: { value: '123' },
        });
        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: '1234' },
        });

        fireEvent.click(screen.getByText('Reset Password').closest('button')!);

        expect(mockedApi.resetPassword).not.toHaveBeenCalled();
        expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    });

    it('allows changing email from OTP step back to step 1', async () => {
        mockedApi.forgotPassword.mockResolvedValueOnce({ success: true, message: 'OTP sent' });

        renderForgotPassword();

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'wrong@example.com' },
        });
        fireEvent.click(screen.getByText('Send OTP Code').closest('button')!);

        await screen.findByText('Enter Verification Code');

        fireEvent.click(screen.getByText('Change email address'));

        expect(await screen.findByText('Forgot Password?')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toHaveValue('wrong@example.com');
    });
});
