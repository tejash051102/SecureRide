import { LogOut, Menu } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/70 bg-white/75 px-4 shadow-sm shadow-slate-200/60 backdrop-blur-xl lg:px-8">
      <button className="btn-secondary px-2 lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brand">Welcome back</p>
        <h1 className="text-xl font-bold text-ink">{user.name}</h1>
      </div>
      <button className="btn-secondary" onClick={handleLogout}>
        <LogOut size={17} />
        Logout
      </button>
    </header>
  );
}
