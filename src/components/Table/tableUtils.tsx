import { Tag } from "antd";
import type { PartnerCommission } from "../../api/partner.api";

export const money = (v: number) =>
  `Rs ${v.toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const shortDate = (v: string | null) =>
  v ? new Date(v).toLocaleDateString("en-LK") : "—";

export const statusTag = (s: PartnerCommission["status"]) => {
  const map: Record<string, { colour: string; label: string }> = {
    pending: { colour: "gold", label: "Pending" },
    claimable: { colour: "green", label: "Ready" },
    paid: { colour: "default", label: "Paid" },
    reversed: { colour: "red", label: "Cancelled" },
  };
  const m = map[s] ?? map.pending;
  return <Tag color={m.colour}>{m.label}</Tag>;
};
