import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const empty = { customer: "", registrationNo: "", make: "", model: "", year: new Date().getFullYear(), vehicleType: "Car" };

export default function Vehicles() {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get(`/vehicles?search=${search}`);
    setItems(data);
  };

  useEffect(() => { load(); }, [search]);
  useEffect(() => { if (user.role === "admin") api.get("/customers").then(({ data }) => setCustomers(data)); }, [user.role]);

  const save = async (form) => {
    if (form._id) await api.put(`/vehicles/${form._id}`, form);
    else await api.post("/vehicles", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this vehicle?")) {
      await api.delete(`/vehicles/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Vehicles" subtitle="Track insured cars and ownership" action={user.role === "admin" && <button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Add Vehicle</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search registration, make, or model" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Registration</th><th className="px-5 py-3">Vehicle</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Customer</th>{user.role === "admin" && <th className="px-5 py-3">Actions</th>}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-5 py-3 font-medium">{item.registrationNo}</td><td className="px-5 py-3">{item.make} {item.model} ({item.year})</td><td className="px-5 py-3">{item.vehicleType}</td><td className="px-5 py-3">{item.customer?.name}</td>
                {user.role === "admin" && <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing({ ...item, customer: item.customer?._id })}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(item._id)}><Trash2 size={16} /></button></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <VehicleForm initial={editing} customers={customers} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function VehicleForm({ initial, customers, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  return (
    <Modal title={form._id ? "Edit Vehicle" : "Add Vehicle"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <select className="form-field sm:col-span-2" required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })}><option value="">Select customer</option>{customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.name}</option>)}</select>
        <input className="form-field" placeholder="Registration No" required value={form.registrationNo} onChange={(e) => setForm({ ...form, registrationNo: e.target.value })} />
        <input className="form-field" placeholder="Make" required value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
        <input className="form-field" placeholder="Model" required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
        <input className="form-field" type="number" placeholder="Year" required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <select className="form-field" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}>{["Car", "SUV", "Truck", "Van", "Other"].map((type) => <option key={type}>{type}</option>)}</select>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
