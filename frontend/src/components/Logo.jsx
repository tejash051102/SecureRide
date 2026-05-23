import React from "react";

export default function Logo({ size = "md", showText = true, dark = false }) {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14"
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} grid place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-950/20`}>
        <svg viewBox="0 0 64 64" className="h-[78%] w-[78%]" aria-hidden="true">
          <path d="M32 5 52 13v15c0 14.2-8.4 24.1-20 30-11.6-5.9-20-15.8-20-30V13L32 5Z" fill="white" />
          <path d="M22 35c1.4-4.6 3.1-8 5.2-10.1h9.6c2.1 2.1 3.8 5.5 5.2 10" fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5 35h27" fill="none" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" />
          <path d="M24 40h16" fill="none" stroke="#0891b2" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="35" r="2.8" fill="#0f766e" />
          <circle cx="40" cy="35" r="2.8" fill="#0f766e" />
          <path d="M28 48c2.8-2.2 5.2-2.2 8 0" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      {showText && (
        <div>
          <p className={`text-xl font-black leading-5 ${dark ? "text-white" : "text-ink"}`}>SecureRide</p>
          <p className={`text-xs font-semibold ${dark ? "text-cyan-100/80" : "text-slate-500"}`}>Insurance Manager</p>
        </div>
      )}
    </div>
  );
}
