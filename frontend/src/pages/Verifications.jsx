import { BadgeCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Verifications() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await api.get(`/verifications?search=${search}`);
    setRequests(data);
  };

  useEffect(() => { load(); }, [search]);

  const verify = async (id) => {
    await api.put(`/verifications/${id}/verify`);
    setMessage("Account verified successfully");
    load();
  };

  return (
    <>
      <PageHeader title="Verifications" subtitle="Approve pending customer, agent, and manager accounts" />
      {message && <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
      <input className="form-field mb-4 max-w-md" placeholder="Search name, email, phone, or role" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="px-5 py-3 font-medium">{request.name}</td>
                <td className="px-5 py-3">{request.email}</td>
                <td className="px-5 py-3">{request.phone}</td>
                <td className="px-5 py-3 capitalize">{request.role}</td>
                <td className="px-5 py-3"><StatusBadge value="Pending" /></td>
                <td className="px-5 py-3">
                  <button className="btn-primary" onClick={() => verify(request._id)}>
                    <BadgeCheck size={17} />
                    Verify
                  </button>
                </td>
              </tr>
            ))}
            {!requests.length && <tr><td className="px-5 py-6 text-center text-slate-500" colSpan="6">No pending verification requests</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
