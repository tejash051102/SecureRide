import { BadgeCheck, BriefcaseBusiness, Car, ClipboardList, CreditCard, ShieldCheck, UserCog, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import DashboardCard from "../components/DashboardCard.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/dashboard").then(({ data }) => setStats(data));
  }, []);

  const cards = [
    { label: "Customers", value: stats?.customers || 0, icon: Users, admin: true },
    { label: "Agents", value: stats?.agents || 0, icon: UserCog, admin: true },
    { label: "Managers", value: stats?.managers || 0, icon: BriefcaseBusiness, admin: true },
    { label: "Pending", value: stats?.pendingVerifications || 0, icon: BadgeCheck, verifier: true },
    { label: "Vehicles", value: stats?.vehicles || 0, icon: Car },
    { label: "Policies", value: stats?.policies || 0, icon: ShieldCheck },
    { label: "Claims", value: stats?.claims || 0, icon: ClipboardList },
    { label: "Payments", value: stats?.payments || 0, icon: CreditCard }
  ].filter((card) => {
    if (card.admin) return user.role === "admin";
    if (card.verifier) return user.role === "admin" || (user.isVerified && ["manager", "agent"].includes(user.role));
    return true;
  });

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A quick view of your insurance records" />
      {!user.isVerified && user.role !== "admin" && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Your {user.role} account is pending verification. Some actions may be unavailable until an authorized user verifies it.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => <DashboardCard key={card.label} {...card} />)}
      </div>
      <div className="card mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-bold text-ink">Recent Claims</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3">Policy</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(stats?.recentClaims || []).map((claim) => (
                <tr key={claim._id}>
                  <td className="px-5 py-3">{claim.policy?.policyNumber}</td>
                  <td className="px-5 py-3">{claim.customer?.name}</td>
                  <td className="px-5 py-3">₹{claim.claimAmount}</td>
                  <td className="px-5 py-3"><StatusBadge value={claim.status} /></td>
                </tr>
              ))}
              {!stats?.recentClaims?.length && (
                <tr><td className="px-5 py-6 text-center text-slate-500" colSpan="4">No claim records yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
