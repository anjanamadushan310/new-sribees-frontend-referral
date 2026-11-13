import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownToLine, ArrowRightLeft, Wallet, ShoppingBag, RefreshCw } from 'lucide-react';
import api from '../api/client';
import { partnerApi } from '../api/partner.api';
import { SideBar } from '../components/SideBar';
import { Header } from '../components/Header';
import { SectionCard } from '../components/Base';
import { useSidebarCollapse } from '../hooks/useSidebarCollapse';

interface Entry {
    id: string;
    kind: string;
    amount: string;
    balanceAfter: string;
    date: string;
}
interface Withdrawal {
    id: string;
    amount: string;
    status: string;
    accountNumber: string;
    bankName: string;
    note?: string;
}
interface WalletData {
    balance: string;
    pendingCommission: string;
    currency: string;
    entries: Entry[];
    withdrawals: Withdrawal[];
}

const inputStyle = 'mt-2 block min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#D81B60]';
const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#D81B60] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b41650]';
const secondaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50';
const amountPattern = /^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/;
const bankFields = [
    { key: 'bank_name', label: 'Bank name' },
    { key: 'branch_name', label: 'Branch' },
    { key: 'account_name', label: 'Account holder name' },
    { key: 'account_number', label: 'Account number' },
] as const;
const money = (value: string) => Number(value).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PartnerWallet() {
    const navigate = useNavigate();
    const cache = useQueryClient();
    const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
    const { data: profile } = useQuery({ queryKey: ['partner-me'], queryFn: partnerApi.me });
    const data = useQuery({
        queryKey: ['partner-wallet'],
        queryFn: async () => (await api.get<{ data: WalletData }>('/partner/wallet')).data.data,
    });
    const [mode, setMode] = useState<'transfer' | 'withdraw' | null>(null);
    const [requestId, setRequestId] = useState('');
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [values, setValues] = useState({ amount: '', bank_name: '', branch_name: '', account_name: '', account_number: '' });

    const open = (next: 'transfer' | 'withdraw') => {
        setRequestId(crypto.randomUUID());
        setMode(next);
        setFeedback('');
        setValues({ amount: '', bank_name: '', branch_name: '', account_name: '', account_number: '' });
    };
    const signOut = () => {
        partnerApi.logout();
        cache.clear();
        navigate('/login', { replace: true });
    };
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (busy || !mode || !amountPattern.test(values.amount) || Number(values.amount) <= 0) return;
        setBusy(true);
        setFeedback('');
        try {
            await api.post(`/partner/wallet/${mode === 'transfer' ? 'transfer-to-sribees' : 'withdrawals'}`, {
                request_id: requestId,
                amount: values.amount,
                ...(mode === 'withdraw' ? {
                    bank_name: values.bank_name,
                    branch_name: values.branch_name,
                    account_name: values.account_name,
                    account_number: values.account_number,
                } : {}),
            });
            setMode(null);
            setFeedback(mode === 'transfer' ? 'Transferred to Sribees Wallet.' : 'Withdrawal requested. Your funds are reserved while the request is reviewed.');
            await cache.invalidateQueries({ queryKey: ['partner-wallet'] });
        } catch {
            setFeedback('Could not confirm the operation. Refresh the wallet or retry this same request.');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="flex h-screen max-h-screen overflow-hidden bg-slate-50 p-0 sm:bg-[#8B1447] sm:p-3">
            <SideBar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(value => !value)}
                activeTab="wallet"
                onSelectTab={() => {}}
                isMasterPartner={profile?.role === 'master_partner' && profile?.canRecruit === true}
                showWallet={Boolean(profile?.linkedUserId)}
                onSignOut={signOut}
            />
            <div className="custom-scrollbar relative min-w-0 flex-1 overflow-y-auto bg-slate-50 sm:rounded-2xl">
                <Header title="Partner Wallet" onSignOut={signOut} />
                <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-7 sm:pb-10">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <p className="m-0 text-sm text-slate-500">Manage your affiliate earnings</p>
                        <button className={secondaryButton} onClick={() => data.refetch()} disabled={data.isFetching}>
                            <RefreshCw className={`h-4 w-4 ${data.isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />Refresh
                        </button>
                    </div>
                    {data.isLoading && <p role="status" className="rounded-2xl border border-slate-200 bg-white p-8">Loading wallet…</p>}
                    {data.isError && <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">Partner Wallet could not be loaded. Check your connection and retry. If this continues, contact support to check your account link.<button className="ml-3 underline" onClick={() => data.refetch()}>Retry</button></div>}
                    {feedback && <p role="status" className="mb-6 rounded-xl border border-pink-100 bg-pink-50 p-4 text-sm text-slate-800">{feedback}</p>}
                    {data.data && <>
                        <div className="mb-6 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                            <section className="rounded-2xl bg-[#8B1447] p-6 text-white sm:p-8">
                                <div className="mb-5 flex items-center gap-2 text-sm text-pink-100"><Wallet className="h-5 w-5" aria-hidden="true" />Partner Wallet</div>
                                <p className="mb-2 text-sm text-pink-100">Available balance</p>
                                <p className="m-0 break-words text-[clamp(1.6rem,5vw,3rem)] font-semibold tracking-tight tabular-nums"><span className="mr-2 text-lg font-normal">LKR</span>{money(data.data.balance)}</p>
                                <p className="mt-4 text-sm text-pink-100">Pending commission · LKR {money(data.data.pendingCommission)}</p>
                                <div className="mt-7 flex flex-wrap gap-3">
                                    <button disabled={busy} onClick={() => open('withdraw')} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#8B1447] hover:bg-pink-50"><ArrowDownToLine className="h-4 w-4" aria-hidden="true" />Request bank withdrawal</button>
                                    <button disabled={busy} onClick={() => open('transfer')} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"><ArrowRightLeft className="h-4 w-4" aria-hidden="true" />Transfer to Sribees Wallet</button>
                                </div>
                            </section>
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                                <span className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-pink-50 text-[#D81B60]"><ShoppingBag className="h-5 w-5" aria-hidden="true" /></span>
                                <h2 className="text-lg font-semibold text-slate-900">Sribees Wallet</h2>
                                <p className="text-sm leading-relaxed text-slate-500">View your shopping credit in the Sribees Online app’s Wallet screen.</p>
                                <p className="mt-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600">You can move Partner earnings into Sribees Wallet to buy groceries. Transfers are one-way.</p>
                            </section>
                        </div>
                        {mode && <section role="dialog" aria-label={mode === 'transfer' ? 'Transfer to Sribees Wallet' : 'Request withdrawal'} className="mb-6 rounded-2xl border border-pink-200 bg-white p-5 sm:p-7">
                            <h2 className="m-0 text-xl font-semibold text-slate-900">{mode === 'transfer' ? 'Transfer to Sribees Wallet' : 'Request withdrawal'}</h2>
                            <p className="mt-2 text-sm leading-relaxed text-slate-500">{mode === 'transfer' ? 'This money becomes shopping credit and cannot be transferred back.' : 'Check the bank details carefully before confirming your withdrawal request.'}</p>
                            <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
                                <label className="block text-sm font-medium text-slate-700">Amount (LKR)
                                    <input className={inputStyle} required inputMode="decimal" pattern={amountPattern.source} value={values.amount} onChange={event => setValues({ ...values, amount: event.target.value })} disabled={busy} />
                                </label>
                                {mode === 'withdraw' && bankFields.map(field => (
                                    <label className="block text-sm font-medium text-slate-700" key={field.key}>{field.label}
                                        <input className={inputStyle} required maxLength={field.key === 'account_number' ? 40 : 120} value={values[field.key]} onChange={event => setValues({ ...values, [field.key]: event.target.value })} disabled={busy} />
                                    </label>
                                ))}
                                <div className="flex flex-wrap gap-3 sm:col-span-2">
                                    <button disabled={busy} className={primaryButton}>{busy ? 'Processing…' : 'Confirm'}</button>
                                    <button type="button" disabled={busy} onClick={() => setMode(null)} className={secondaryButton}>Cancel</button>
                                </div>
                            </form>
                        </section>}
                        <SectionCard title="Withdrawals">
                            {data.data.withdrawals.length === 0 && <p className="py-6 text-center text-sm text-slate-500">No withdrawal requests.</p>}
                            <div className="divide-y divide-slate-100">
                                {data.data.withdrawals.map(withdrawal => (
                                    <div key={withdrawal.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                                        <div><p className="m-0 font-semibold text-slate-900">LKR {money(withdrawal.amount)}</p><p className="mb-0 mt-1 text-sm text-slate-500">{withdrawal.bankName} · {withdrawal.accountNumber}</p>{withdrawal.note && <p className="mb-0 mt-2 text-sm text-slate-600">{withdrawal.note}</p>}</div>
                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">{withdrawal.status.replaceAll('_', ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                        <SectionCard title="Transactions">
                            {data.data.entries.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Your commission credits, transfers and withdrawals will appear here.</p>}
                            <div className="divide-y divide-slate-100">
                                {data.data.entries.map(entry => (
                                    <div key={entry.id} className="flex items-start justify-between gap-4 py-4 text-sm">
                                        <div className="min-w-0"><p className="m-0 font-medium capitalize text-slate-800">{entry.kind.replaceAll('_', ' ')}</p><p className="mb-0 mt-1 text-xs text-slate-500">{new Date(entry.date).toLocaleString()}</p></div>
                                        <div className="shrink-0 text-right tabular-nums"><p className="m-0 font-semibold text-slate-900">LKR {money(entry.amount)}</p><p className="mb-0 mt-1 text-xs text-slate-500">Balance {money(entry.balanceAfter)}</p></div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </>}
                </main>
            </div>
        </div>
    );
}
