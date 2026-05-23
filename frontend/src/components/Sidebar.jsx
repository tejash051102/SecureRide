import { BadgeCheck, BriefcaseBusiness, Car, ClipboardList, CreditCard, Gauge, UserCog, UserRound, Users, X } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/customers", label: "Customers", icon: Users, admin: true },
  { to: "/agents", label: "Agents", icon: UserCog, admin: true },
  { to: "/managers", label: "Managers", icon: BriefcaseBusiness, admin: true },
  { to: "/verifications", label: "Verifications", icon: BadgeCheck, verifier: true },
  { to: "/vehicles", label: "Vehicles", icon: Car },
  { to: "/policies", label: "Policies", icon: ShieldCheck },
  { to: "/claims", label: "Claims", icon: ClipboardList },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const canVerify = user.role === "admin" || (user.isVerified && ["manager", "agent"].includes(user.role));
  const visibleItems = navItems.filter((item) => {
    if (item.admin) return user.role === "admin";
    if (item.verifier) return canVerify;
    return true;
  });

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-[#111827] text-white shadow-2xl shadow-slate-900/20 transition lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.24),transparent_18rem)]" />
      <div className="relative flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Logo dark />
        <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
          <X size={22} />
        </button>
      </div>

      <nav className="relative space-y-1 px-3 py-5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-white text-ink shadow-lg shadow-slate-950/20" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
                }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
