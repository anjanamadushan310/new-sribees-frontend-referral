import type { PartnerCommission } from "../../api/partner.api";

export const money = (v: number) =>
  `Rs ${v.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const shortDate = (v: string | null) =>
  v ? new Date(v).toLocaleDateString("en-LK") : "—";

export const statusTag = (s: PartnerCommission["status"]) => {
  const map: Record<
    string,
    { className: string; label: string }
  > = {
    pending: {
      className: "bg-amber-50 text-amber-700 border border-amber-200/80",
      label: "Pending",
    },
    claimable: {
      className: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
      label: "Ready",
    },
    paid: {
      className: "bg-slate-100 text-slate-700 border border-slate-200",
      label: "Paid",
    },
    reversed: {
      className: "bg-rose-50 text-rose-700 border border-rose-200/80",
      label: "Cancelled",
    },
  };
  const m = map[s] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${m.className}`}
    >
      {m.label}
    </span>
  );
};
