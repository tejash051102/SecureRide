import React from "react";

const styles = {
  Active: "bg-emerald-50 text-emerald-700",
  Paid: "bg-emerald-50 text-emerald-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Expired: "bg-slate-100 text-slate-700",
  Failed: "bg-rose-50 text-rose-700",
  Rejected: "bg-rose-50 text-rose-700",
  Cancelled: "bg-rose-50 text-rose-700"
};

export default function StatusBadge({ value }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[value] || "bg-slate-100 text-slate-700"}`}>{value}</span>;
}
