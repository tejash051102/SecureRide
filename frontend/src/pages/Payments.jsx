import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import Modal from "../components/Modal.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const empty = { policy: "", customer: "", amount: "", paymentDate: "", method: "UPI", status: "Paid" };

export default function Payments() {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    const { data } = await api.get(`/payments?search=${search}`);
    setItems(data);
  };

  useEffect(() => { load(); }, [search]);
  useEffect(() => {
    if (user.role === "admin") api.get("/customers").then(({ data }) => setCustomers(data));
    api.get("/policies").then(({ data }) => setPolicies(data));
  }, [user.role]);

  const save = async (form) => {
    if (form._id) await api.put(`/payments/${form._id}`, form);
    else await api.post("/payments", form);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this payment?")) {
      await api.delete(`/payments/${id}`);
      load();
    }
  };

  return (
    <>
      <PageHeader title="Payments" subtitle={user.role === "admin" ? "Record and review premium payments" : "View premium payment history"} action={user.role === "admin" && <button className="btn-primary" onClick={() => setEditing(empty)}><Plus size={17} /> Add Payment</button>} />
      <input className="form-field mb-4 max-w-md" placeholder="Search customer, policy, method, or status" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Policy</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Method</th><th className="px-5 py-3">Status</th>{user.role === "admin" && <th className="px-5 py-3">Actions</th>}</tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-5 py-3">{item.policy?.policyNumber}</td><td className="px-5 py-3">{item.customer?.name}</td><td className="px-5 py-3">₹{item.amount}</td><td className="px-5 py-3">{item.method}</td><td className="px-5 py-3"><StatusBadge value={item.status} /></td>
                {user.role === "admin" && <td className="px-5 py-3"><div className="flex gap-2"><button className="btn-secondary px-2" onClick={() => setEditing({ ...item, policy: item.policy?._id, customer: item.customer?._id, paymentDate: item.paymentDate?.slice(0, 10) })}><Edit size={16} /></button><button className="btn-danger px-2" onClick={() => remove(item._id)}><Trash2 size={16} /></button></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <PaymentForm initial={editing} customers={customers} policies={policies} onClose={() => setEditing(null)} onSave={save} />}
    </>
  );
}

function PaymentForm({ initial, customers, policies, onClose, onSave }) {
  const [form, setForm] = useState(initial);
  return (
    <Modal title={form._id ? "Edit Payment" : "Add Payment"} onClose={onClose}>
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <select className="form-field" required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })}><option value="">Select customer</option>{customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.name}</option>)}</select>
        <select className="form-field" required value={form.policy} onChange={(e) => setForm({ ...form, policy: e.target.value })}><option value="">Select policy</option>{policies.map((policy) => <option key={policy._id} value={policy._id}>{policy.policyNumber}</option>)}</select>
        <input className="form-field" type="number" placeholder="Amount" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input className="form-field" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} />
        <select className="form-field" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>{["Cash", "Card", "UPI", "Net Banking"].map((method) => <option key={method}>{method}</option>)}</select>
        <select className="form-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{["Paid", "Pending", "Failed"].map((status) => <option key={status}>{status}</option>)}</select>
        <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  );
}
