import { Car, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthShell title="Login to SecureRide">
      <form className="space-y-4" onSubmit={submit}>
        {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <input className="form-field" type="email" placeholder="Email address" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-field" type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn-primary w-full" type="submit">Login</button>
        <p className="text-center text-sm text-slate-500">
          New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, children }) {
  return (
    <div className="auth-bg grid min-h-screen place-items-center px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-2xl shadow-slate-950/20 backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[620px] overflow-hidden bg-ink p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.30),transparent_18rem),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.22),transparent_18rem)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" dark />
            </div>
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
                <Sparkles size={14} />
                Smart coverage desk
              </div>
              <h2 className="max-w-md text-5xl font-black leading-tight">Drive protected. Manage clearly.</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["Policies", "Claims", "Payments"].map((item) => (
                <div className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur" key={item}>
                  <Car className="mb-3 text-cyan-100" size={20} />
                  <p className="text-sm font-bold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="auth-card p-6 sm:p-8 lg:p-10">
          <div className="mb-7 text-center lg:text-left">
            <div className="brand-mark mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand text-white shadow-md shadow-teal-900/10 lg:mx-0 lg:hidden">
              <Logo showText={false} />
            </div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-brand">SecureRide</p>
            <h1 className="text-3xl font-black text-ink">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">Access your insurance workspace</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
