import React from "react";

export default function Logo({ size = "md", showText = true, dark = false }) {
  const sizes = {
    sm: "h-11 w-11",
    md: "h-14 w-14",
    lg: "h-16 w-16"
  };

  return (
    <div className="flex items-center gap-3">
      <img className={`${sizes[size]} rounded-xl object-contain`} src="/favicon.svg" alt="SecureRide logo" />
      {showText && (
        <div>
          <p className={`text-xl font-black leading-5 ${dark ? "text-white" : "text-ink"}`}>Secure Ride</p>
          <p className={`text-xs font-semibold ${dark ? "text-cyan-100/80" : "text-slate-500"}`}>Insurance Manager</p>
        </div>
      )}
    </div>
  );
}
