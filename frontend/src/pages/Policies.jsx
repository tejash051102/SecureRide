import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const empty = { policyNumber: "", customer: "", vehicle: "", policyType: "Comprehensive", premiumAmount: "", coverageAmount: "", startDate: "", endDate: "", status: "Active" };

export default function Policies() {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get(`/policies?search=${search}`);
    setItems(data);
  };

  useEffect(() => { load(); }, [search]);
  useEffect(() => {
    if (user.role === "admin") {
      api.get("/customers").then(({ data }) => setCustomers(data));
      api.get("/vehicles").then(({ data }) => setVehicles(data));
    }
  }, [user.role]);

  const save = async (form) => {
    if (form._id) await api.put(`/policies/${form._id}`, form);
    else await api.post("/policies", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this policy?")) {
      await api.delete(`/policies/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Policies" subtitle={user.role === "admin" ? "Create and manage insurance policies" : "View your insurance policies"} action={user.role === "admin" && <button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Add Policy</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search policy, type, or status" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Policy</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Vehicle</th><th className="px-5 py-3">Premium</th><th className="px-5 py-3">Status</th>{user.role === "admin" && <th className="px-5 py-3">Actions</th>}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-5 py-3"><p className="font-medium">{item.policyNumber}</p><p className="text-xs text-slate-500">{item.policyType}</p></td><td className="px-5 py-3">{item.customer?.name}</td><td className="px-5 py-3">{item.vehicle?.registrationNo}</td><td className="px-5 py-3">₹{item.premiumAmount}</td><td className="px-5 py-3"><StatusBadge value={item.status} /></td>
                {user.role === "admin" && <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing({ ...item, customer: item.customer?._id, vehicle: item.vehicle?._id, startDate: item.startDate?.slice(0, 10), endDate: item.endDate?.slice(0, 10) })}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(item._id)}><Trash2 size={16} /></button></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <PolicyForm initial={editing} customers={customers} vehicles={vehicles} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function PolicyForm({ initial, customers, vehicles, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  return (
    <Modal title={form._id ? "Edit Policy" : "Add Policy"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <input className="form-field" placeholder="Policy Number" required value={form.policyNumber} onChange={(e) => setForm({ ...form, policyNumber: e.target.value })} />
        <select className="form-field" required value={form.policyType} onChange={(e) => setForm({ ...form, policyType: e.target.value })}>{["Third Party", "Comprehensive", "Own Damage"].map((type) => <option key={type}>{type}</option>)}</select>
        <select className="form-field" required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })}><option value="">Select customer</option>{customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.name}</option>)}</select>
        <select className="form-field" required value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}><option value="">Select vehicle</option>{vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.registrationNo}</option>)}</select>
        <input className="form-field" type="number" placeholder="Premium Amount" required value={form.premiumAmount} onChange={(e) => setForm({ ...form, premiumAmount: e.target.value })} />
        <input className="form-field" type="number" placeholder="Coverage Amount" required value={form.coverageAmount} onChange={(e) => setForm({ ...form, coverageAmount: e.target.value })} />
        <input className="form-field" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        <input className="form-field" type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        <select className="form-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["Active", "Expired", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
