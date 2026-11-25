import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import BaseInput from "../components/Base/BaseInput";

function invitationError(cause: unknown, fallback: string) {
  const detail = (cause as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}

export default function JoinTeam() {
  const [token] = useState(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : "";
  });
  useEffect(() => {
    window.history.replaceState(window.history.state, "", window.location.pathname);
  }, []);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  const invitation = useQuery({
    queryKey: ["join-team", token],
    enabled: Boolean(token),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => (await apiClient.post<{ data: { masterName: string } }>(
      "/partner/auth/team-invitation", { token },
    )).data.data,
  });

  const accept = useMutation({
    mutationFn: () => apiClient.post("/partner/auth/team-invitation/accept", { token, password }),
    onSuccess: () => { setPassword(""); setConfirmation(""); },
    onError: (cause) => setError(invitationError(cause, "Could not accept the invitation. Please try again.")),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (accept.isPending || !invitation.data) return;
    if (password !== confirmation) {
      setError("Passwords must match.");
      return;
    }
    setError("");
    accept.mutate();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf3f7] px-5 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-sm">
        <header className="bg-[#8B1447] px-7 py-5 font-semibold text-white">Sribees Online · Partner Portal</header>
        <div className="p-7">
          <h1 className="mb-3 text-2xl font-semibold">Partner invitation</h1>
          {accept.isSuccess ? (
            <>
              <p role="status" className="mb-5">Your Partner account is active. Use your Sribees email address and your new password to sign in.</p>
              <Link className="font-semibold text-[#8B1447]" to="/login">Sign in to Partner Portal</Link>
            </>
          ) : !token ? (
            <p>Open the complete link from your email or SMS to review the invitation.</p>
          ) : invitation.isPending ? (
            <p role="status">Checking your invitation…</p>
          ) : invitation.isError ? (
            <p role="alert">{invitationError(invitation.error, "Could not load this invitation. Reopen the link to try again.")}</p>
          ) : (
            <>
              <p className="mb-5 text-slate-700"><strong>{invitation.data.masterName}</strong> invited you to join their Partner team. Choose a Partner Portal password to accept.</p>
              <form onSubmit={submit}>
                <BaseInput label="New password" type="password" autoComplete="new-password"
                  icon={<LockKeyhole size={18} />} required minLength={8} maxLength={128}
                  disabled={accept.isPending} value={password} onChange={event => setPassword(event.target.value)} />
                <BaseInput label="Confirm password" type="password" autoComplete="new-password"
                  icon={<LockKeyhole size={18} />} required minLength={8} maxLength={128}
                  disabled={accept.isPending} value={confirmation} onChange={event => setConfirmation(event.target.value)} />
                {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
                <button type="submit" disabled={accept.isPending}
                  className="w-full rounded-xl bg-[#8B1447] py-3 font-semibold text-white disabled:opacity-60">
                  {accept.isPending ? "Accepting…" : "Accept invitation"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
