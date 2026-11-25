import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "../api/client";

type Invitation = { id: string; channel: "email" | "sms"; status: string; contactHint: string; createdAt: string };

export default function TeamInvitations() {
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [contact, setContact] = useState("");
  const cache = useQueryClient();
  const key = ["partner-team-invitations"];
  const history = useQuery({
    queryKey: key,
    queryFn: async () => (await client.get<{ data: Invitation[] }>("/partner/team-invitations")).data.data,
    refetchInterval: 30_000,
  });
  const send = useMutation({
    mutationFn: () => client.post("/partner/team-invitations", { channel, contact: contact.trim() }),
    onSuccess: () => setContact(""),
    onSettled: () => cache.invalidateQueries({ queryKey: key }),
  });
  const error = send.error as { response?: { data?: { detail?: unknown } } } | null;
  const detail = error?.response?.data?.detail;

  return (
    <section className="mb-6 rounded-2xl border border-pink-100 bg-white p-5">
      <h3 className="m-0 text-lg font-semibold text-slate-900">Invite a Partner</h3>
      <p className="mb-4 mt-2 text-sm text-slate-600">Send an invitation to an existing Sribees customer using their account email or verified mobile number.</p>
      <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); send.mutate(); }}>
        <label className="grid gap-1 text-sm">Send via
          <select className="rounded-lg border p-2" value={channel} disabled={send.isPending}
            onChange={(event) => { setChannel(event.target.value as "email" | "sms"); setContact(""); send.reset(); }}>
            <option value="email">Email</option><option value="sms">SMS</option>
          </select>
        </label>
        <label className="grid min-w-48 flex-1 gap-1 text-sm">{channel === "email" ? "Account email" : "Verified mobile number"}
          <input className="rounded-lg border p-2" required maxLength={254} disabled={send.isPending}
            type={channel === "email" ? "email" : "tel"} value={contact}
            onChange={(event) => { setContact(event.target.value); send.reset(); }} />
        </label>
        <button className="rounded-lg bg-[#8B1447] px-4 py-2 font-semibold text-white disabled:opacity-60"
          disabled={send.isPending || !contact.trim()}>{send.isPending ? "Sending…" : "Send invitation"}</button>
      </form>
      {send.isSuccess && <p role="status" className="mt-3 text-sm text-green-800">Invitation sent.</p>}
      {send.isError && <p role="alert" className="mt-3 text-sm text-red-800">{typeof detail === "string" ? detail : "The invitation could not be sent."}</p>}
      {history.isError && <p className="mt-3 text-sm text-slate-600">Invitation history could not be loaded.</p>}
      {!!history.data?.length && <ul className="mt-4 divide-y divide-slate-100 text-sm">
        {history.data.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-2 py-2">
          <span>{item.channel === "email" ? "Email" : "SMS"} · {item.contactHint} · {new Date(item.createdAt).toLocaleString()}</span>
          <strong>{item.status}</strong>
        </li>)}
      </ul>}
    </section>
  );
}
