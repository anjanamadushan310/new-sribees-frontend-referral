import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import apiClient from '../api/client';
import BaseInput from '../components/Base/BaseInput';

export default function SetPassword() {
    // Keep the invitation out of persistent storage and subsequent URLs.
    const [token] = useState(() => {
        const value = new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '';
        return value;
    });
    useEffect(() => {
        window.history.replaceState(window.history.state, '', window.location.pathname);
    }, []);
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [pending, setPending] = useState(false);
    const [complete, setComplete] = useState(false);
    const [error, setError] = useState('');

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        if (password !== confirmation) {
            setError('Passwords must match.');
            return;
        }
        setPending(true);
        setError('');
        try {
            await apiClient.post('/partner/auth/set-password', { token, password });
            setPassword('');
            setConfirmation('');
            setComplete(true);
        } catch (cause: unknown) {
            const detail = (cause as { response?: { data?: { detail?: unknown } } }).response?.data?.detail;
            setError(typeof detail === 'string' ? detail : 'Could not set your password. Please try again shortly.');
        } finally {
            setPending(false);
        }
    }

    return <main className="min-h-screen bg-[#f6f7fa] px-5 py-16 flex items-center justify-center">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
            <p className="font-bold text-[#D81B60] mb-2">SRIBEES ONLINE</p>
            <h1 className="text-2xl font-semibold mb-3">Set up your Partner password</h1>
            {complete ? <>
                <p role="status" className="mb-6">Your password is ready. Sign in with the email address that received your invitation.</p>
                <Link className="text-[#D81B60] font-semibold" to="/login">Sign in to Partner Portal</Link>
            </> : !token ? <>
                <p className="mb-6">Open the full link in your invitation email. If it has expired, request a new invitation or use Forgot Password.</p>
                <Link className="text-[#D81B60] font-semibold" to="/forgot-password">Forgot Password</Link>
            </> : <>
                <p className="text-sm text-gray-600 mb-6">Choose a password with 8–128 characters. Keep it private.</p>
                <form onSubmit={submit}>
                    <BaseInput label="New password" placeholder="New password" type="password" autoComplete="new-password"
                        icon={<LockKeyhole size={18} />} required minLength={8} maxLength={128}
                        disabled={pending} value={password} onChange={e => setPassword(e.target.value)} />
                    <BaseInput label="Confirm password" placeholder="Confirm password" type="password" autoComplete="new-password"
                        icon={<LockKeyhole size={18} />} required minLength={8} maxLength={128}
                        disabled={pending} value={confirmation} onChange={e => setConfirmation(e.target.value)} />
                    {error && <p role="alert" className="text-sm text-red-700 mb-4">{error}</p>}
                    <button type="submit" disabled={pending} className="w-full rounded-xl bg-[#D81B60] text-white font-semibold py-3 disabled:opacity-60">
                        {pending ? 'Saving…' : 'Set Password'}
                    </button>
                </form>
                <Link className="inline-block mt-5 text-sm text-[#D81B60]" to="/forgot-password">Invitation expired? Request a verification code</Link>
            </>}
        </section>
    </main>;
}
