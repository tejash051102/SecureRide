import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const empty = { policy: "", incidentDate: "", claimAmount: "", reason: "", status: "Pending" };

export default function Claims() {
  const [items, setItems] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get(`/claims?search=${search}`);
    setItems(data);
  };

  useEffect(() => { load(); }, [search]);
  useEffect(() => { api.get("/policies").then(({ data }) => setPolicies(data)); }, []);

  const save = async (form) => {
    if (form._id) await api.put(`/claims/${form._id}`, form);
    else await api.post("/claims", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this claim?")) {
      await api.delete(`/claims/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Claims" subtitle={user.role === "admin" ? "Review and update claim requests" : "Submit and track claim requests"} action={<button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Submit Claim</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search reason or status" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Policy</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Incident</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-5 py-3">{item.policy?.policyNumber}</td><td className="px-5 py-3">{item.customer?.name}</td><td className="px-5 py-3">{item.incidentDate?.slice(0, 10)}</td><td className="px-5 py-3">₹{item.claimAmount}</td><td className="px-5 py-3"><StatusBadge value={item.status} /></td>
                <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing({ ...item, policy: item.policy?._id, incidentDate: item.incidentDate?.slice(0, 10) })}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(item._id)}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <ClaimForm initial={editing} policies={policies} isAdmin={user.role === "admin"} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function ClaimForm({ initial, policies, isAdmin, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  return (
    <Modal title={form._id ? "Edit Claim" : "Submit Claim"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <select className="form-field sm:col-span-2" required value={form.policy} onChange={(e) => setForm({ ...form, policy: e.target.value })}><option value="">Select policy</option>{policies.map((policy) => <option key={policy._id} value={policy._id}>{policy.policyNumber}</option>)}</select>
        <input className="form-field" type="date" required value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} />
        <input className="form-field" type="number" placeholder="Claim Amount" required value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: e.target.value })} />
        <textarea className="form-field sm:col-span-2" placeholder="Reason" required rows="3" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        {isAdmin && <select className="form-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["Pending", "Approved", "Rejected"].map((status) => <option key={status}>{status}</option>)}</select>}
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
