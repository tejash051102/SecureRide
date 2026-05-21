import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const empty = { name: "", email: "", phone: "", licenseNo: "", region: "", status: "Active" };

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/agents?search=${search}`);
    setAgents(data);
  };

  useEffect(() => { load(); }, [search]);

  const save = async (form) => {
    if (form._id) await api.put(`/agents/${form._id}`, form);
    else await api.post("/agents", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this agent?")) {
      await api.delete(`/agents/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Agents" subtitle="Manage insurance field agents" action={<button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Add Agent</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search name, email, phone, license, or region" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">License</th><th className="px-5 py-3">Region</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agents.map((agent) => (
              <tr key={agent._id}>
                <td className="px-5 py-3 font-medium">{agent.name}</td>
                <td className="px-5 py-3">{agent.email}</td>
                <td className="px-5 py-3">{agent.phone}</td>
                <td className="px-5 py-3">{agent.licenseNo}</td>
                <td className="px-5 py-3">{agent.region}</td>
                <td className="px-5 py-3"><StatusBadge value={agent.status} /></td>
                <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing(agent)}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(agent._id)}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
            {!agents.length && <tr><td className="px-5 py-6 text-center text-slate-500" colSpan="7">No agent records yet</td></tr>}
          </tbody>
        </table>
      </div>
      {editing && <AgentForm initial={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function AgentForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);

  return (
    <Modal title={form._id ? "Edit Agent" : "Add Agent"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <input className="form-field" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-field" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-field" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="form-field" placeholder="License No" required value={form.licenseNo} onChange={(e) => setForm({ ...form, licenseNo: e.target.value })} />
        <input className="form-field" placeholder="Region" required value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        <select className="form-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
