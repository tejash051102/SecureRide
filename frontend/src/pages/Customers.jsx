import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";

const empty = { name: "", email: "", phone: "", address: "", password: "password123" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get(`/customers?search=${search}`);
    setCustomers(data);
  };

  useEffect(() => { load(); }, [search]);

  const save = async (form) => {
    if (form._id) await api.put(`/customers/${form._id}`, form);
    else await api.post("/customers", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this customer?")) {
      await api.delete(`/customers/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Customers" subtitle="Add, edit, delete, and search customer records" action={<button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Add Customer</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search by name, email, or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Address</th><th className="px-5 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="px-5 py-3 font-medium">{customer.name}</td><td className="px-5 py-3">{customer.email}</td><td className="px-5 py-3">{customer.phone}</td><td className="px-5 py-3">{customer.address}</td>
                <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing(customer)}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(customer._id)}><Trash2 size={16} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <CustomerForm initial={editing} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function CustomerForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  const submit = (event) => {
    event.preventDefault();
    onSave(form);
  };
  return (
    <Modal title={form._id ? "Edit Customer" : "Add Customer"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <input className="form-field" placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-field" type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {!form._id && <input className="form-field" placeholder="Initial password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />}
        <input className="form-field" placeholder="Phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className="form-field sm:col-span-2" placeholder="Address" rows="3" value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
