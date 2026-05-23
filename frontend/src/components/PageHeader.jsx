import React from "react";

export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header-motion mb-6 flex flex-col gap-4 rounded-xl border border-white/70 bg-white/70 p-5 shadow-sm shadow-slate-200/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-black text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
