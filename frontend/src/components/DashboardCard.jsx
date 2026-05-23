import React from "react";

export default function DashboardCard({ label, value, icon: Icon }) {
  return (
    <div className="dashboard-card card relative overflow-hidden p-5 hover:-translate-y-1">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-100/50" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className="dashboard-icon grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-brand">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
