import { BadgeCheck, BriefcaseBusiness, Car, ClipboardList, CreditCard, Gauge, ShieldCheck, UserCog, UserRound, Users, X } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-ink text-white transition lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-brand">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-lg font-bold">SecureRide</p>
            <p className="text-xs text-slate-300">Insurance Manager</p>
          </div>
        </div>
        <button className="lg:hidden" onClick={onClose} aria-label="Close menu">
          <X size={22} />
        </button>
      </div>

      <nav className="space-y-1 px-3 py-5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-brand text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
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
