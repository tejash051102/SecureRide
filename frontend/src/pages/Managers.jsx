import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const empty = { name: "", email: "", phone: "", department: "", branch: "", status: "Active" };

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/managers?search=${search}`);
    setManagers(data);
  };

  useEffect(() => { load(); }, [search]);

  const save = async (form) => {
    if (form._id) await api.put(`/managers/${form._id}`, form);
    else await api.post("/managers", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this manager?")) {
      await api.delete(`/managers/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Managers" subtitle="Manage branch and department managers" action={<button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Add Manager</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search name, email, phone, department, or branch" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Department</th><th className="px-5 py-3">Branch</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {managers.map((manager) => (
              <tr key={manager._id}>
                <td className="px-5 py-3 font-medium">{manager.name}</td>
                <td className="px-5 py-3">{manager.email}</td>
                <td className="px-5 py-3">{manager.phone}</td>
                <td className="px-5 py-3">{manager.department}</td>
                <td className="px-5 py-3">{manager.branch}</td>
                <td className="px-5 py-3"><StatusBadge value={manager.status} /></td>
                <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing(manager)}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(manager._id)}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
            {!managers.length && <tr><td className="px-5 py-6 text-center text-slate-500" colSpan="7">No manager records yet</td></tr>}
          </tbody>
        </table>
      </div>
      {editing && <ManagerForm initial={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function ManagerForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);

  return (
    <Modal title={form._id ? "Edit Manager" : "Add Manager"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <input className="form-field" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-field" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-field" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="form-field" placeholder="Department" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <input className="form-field" placeholder="Branch" required value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />
        <select className="form-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
