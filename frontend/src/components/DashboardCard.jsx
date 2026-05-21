import React from "react";

export default function DashboardCard({ label, value, icon: Icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md bg-teal-50 text-brand">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
