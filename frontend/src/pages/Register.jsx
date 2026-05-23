import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { AuthShell } from "./Login.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", phone: "", address: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create an account">
      <form className="space-y-4" onSubmit={submit}>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <input className="form-field" placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="form-field" type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-field" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="form-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="customer">Customer</option>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        {form.role !== "admin" && <p className="text-xs text-slate-500">Your {form.role} account will be active after verification.</p>}
        <input className="form-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea className="form-field" placeholder="Address" rows="2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
        <p className="text-center text-sm text-slate-500">
          Already registered? <Link className="font-semibold text-brand" to="/login">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
}
