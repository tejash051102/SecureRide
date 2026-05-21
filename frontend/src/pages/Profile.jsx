import { Save } from "lucide-react";
import React, { useState } from "react";
import api from "../services/api.js";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateLocalUser } = useAuth();
  const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "", address: user.address || "", password: "" });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const { data } = await api.put("/profile", form);
    updateLocalUser(data);
    setForm({ ...form, password: "" });
    setMessage("Profile updated successfully");
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Update your account details" />
      <div className="card max-w-2xl p-5">
        <form className="space-y-4" onSubmit={submit}>
          {message && <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Name</label>
            <input className="form-field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Email</label>
            <input className="form-field bg-slate-50" value={user.email} disabled />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Phone</label>
            <input className="form-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">Address</label>
            <textarea className="form-field" rows="3" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">New Password</label>
            <input className="form-field" type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary"><Save size={17} /> Save Profile</button>
        </form>
      </div>
    </>
  );
}
