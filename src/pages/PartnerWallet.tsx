import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

interface Entry { id: string; kind: string; amount: string; balanceAfter: string; date: string; }
interface Withdrawal { id: string; amount: string; status: string; accountNumber: string; bankName: string; note?: string; }
interface Wallet { balance: string; pendingCommission: string; currency: string; entries: Entry[]; withdrawals: Withdrawal[]; }
const inputStyle = 'block w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900';
const amountPattern = /^(?:0|[1-9]\d{0,8})(?:\.\d{1,2})?$/;

export default function PartnerWallet() {
    const cache = useQueryClient();
    const data = useQuery({ queryKey: ['partner-wallet'], queryFn: async () => (await api.get<{ data: Wallet }>('/partner/wallet')).data.data });
    const [mode, setMode] = useState<'transfer' | 'withdraw' | null>(null);
    const [requestId, setRequestId] = useState('');
    const [busy, setBusy] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [values, setValues] = useState({ amount: '', bank_name: '', branch_name: '', account_name: '', account_number: '' });
    const open = (next: 'transfer' | 'withdraw') => { setRequestId(crypto.randomUUID()); setMode(next); setFeedback(''); setValues({ amount: '', bank_name: '', branch_name: '', account_name: '', account_number: '' }); };
    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (busy || !mode || !amountPattern.test(values.amount) || Number(values.amount) <= 0) return;
        setBusy(true); setFeedback('');
        try {
            await api.post(`/partner/wallet/${mode === 'transfer' ? 'transfer-to-sribees' : 'withdrawals'}`, {
                request_id: requestId, amount: values.amount,
                ...(mode === 'withdraw' ? { bank_name: values.bank_name, branch_name: values.branch_name, account_name: values.account_name, account_number: values.account_number } : {}),
            });
            setMode(null); setFeedback(mode === 'transfer' ? 'Transferred to Sribees Wallet.' : 'Withdrawal requested. Funds are reserved until Finance records payment or rejects the request.');
            await cache.invalidateQueries({ queryKey: ['partner-wallet'] });
        } catch { setFeedback('Could not confirm the operation. Refresh the wallet or retry this same request.'); }
        finally { setBusy(false); }
    };
    return <main className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-900 max-w-4xl mx-auto">
        <Link to="/" className="text-[#D81B60]">← Dashboard</Link>
        <h1 className="text-2xl font-bold my-5">Partner Wallet</h1>
        <p>Affiliate earnings are separate from shopping credit. Transfers to Sribees Wallet are one-way and cannot be withdrawn afterwards.</p>
        {data.isLoading && <p role="status">Loading wallet…</p>}
        {data.isError && <p role="alert">Partner Wallet is unavailable or this account has not been linked. <button onClick={() => data.refetch()}>Retry</button></p>}
        {data.data && <>
            <section className="my-5 rounded-2xl bg-white p-6 border border-pink-100">
                <p>Available balance</p><strong className="text-3xl text-[#D81B60]">LKR {data.data.balance}</strong>
                <p className="text-slate-500">Pending commission: LKR {data.data.pendingCommission}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                    <button onClick={() => open('withdraw')} className="rounded-xl bg-[#D81B60] text-white px-4 py-3">Request bank withdrawal</button>
                    <button onClick={() => open('transfer')} className="rounded-xl border border-pink-300 px-4 py-3">Transfer to Sribees Wallet</button>
                    <button onClick={() => data.refetch()} className="px-4 py-3">Refresh</button>
                </div>
            </section>
            {mode && <section role="dialog" aria-label={mode === 'transfer' ? 'Transfer to Sribees Wallet' : 'Request withdrawal'} className="my-5 bg-white p-5 rounded-2xl border border-slate-200">
                <h2 className="text-lg font-bold">{mode === 'transfer' ? 'Transfer to Sribees Wallet' : 'Request withdrawal'}</h2>
                <p>{mode === 'transfer' ? 'This money becomes shopping credit and cannot be transferred back.' : 'Finance pays manually to the bank account you provide. Check every detail before confirming.'}</p>
                <form onSubmit={submit} className="space-y-4 mt-4">
                    <label className="block">Amount (LKR)<input className={inputStyle} required inputMode="decimal" pattern={amountPattern.source} value={values.amount} onChange={e => setValues({ ...values, amount: e.target.value })} disabled={busy} /></label>
                    {mode === 'withdraw' && (['bank_name', 'branch_name', 'account_name', 'account_number'] as const).map(field => <label className="block" key={field}>{({ bank_name: 'Bank name', branch_name: 'Branch', account_name: 'Account holder name', account_number: 'Account number' })[field]}<input className={inputStyle} required maxLength={field === 'account_number' ? 40 : 120} value={values[field]} onChange={e => setValues({ ...values, [field]: e.target.value })} disabled={busy} /></label>)}
                    <button disabled={busy} className="rounded-xl bg-[#D81B60] text-white px-5 py-3">{busy ? 'Processing…' : 'Confirm'}</button>
                    <button type="button" disabled={busy} onClick={() => setMode(null)} className="ml-3 px-4 py-3">Cancel</button>
                </form>
            </section>}
            {feedback && <p role="status" className="p-4 bg-pink-50 rounded-xl">{feedback}</p>}
            <h2 className="font-bold mt-7 mb-3">Withdrawals</h2>
            {data.data.withdrawals.length === 0 && <p>No withdrawal requests.</p>}
            {data.data.withdrawals.map(r => <div key={r.id} className="border-b border-slate-200 py-3">LKR {r.amount} · {r.status} · {r.bankName} {r.accountNumber}{r.note && <p>{r.note}</p>}</div>)}
            <h2 className="font-bold mt-7 mb-3">Transactions</h2>
            {data.data.entries.map(e => <div key={e.id} className="border-b border-slate-200 py-3 flex justify-between gap-3"><span>{e.kind.replaceAll('_', ' ')}<small className="block text-slate-500">{new Date(e.date).toLocaleString()}</small></span><span>LKR {e.amount}<small className="block">Balance {e.balanceAfter}</small></span></div>)}
        </>}
    </main>;
}
