import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <h2 className="text-3xl font-bold text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-slate-500">The page you are looking for does not exist.</p>
        <Link className="btn-primary mt-5" to="/dashboard">Go to Dashboard</Link>
      </div>
    </div>
  );
}
