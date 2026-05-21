import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Agents from "./pages/Agents.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Claims from "./pages/Claims.jsx";
import Customers from "./pages/Customers.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Managers from "./pages/Managers.jsx";
import NotFound from "./pages/NotFound.jsx";
import Payments from "./pages/Payments.jsx";
import Policies from "./pages/Policies.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import Verifications from "./pages/Verifications.jsx";
import Vehicles from "./pages/Vehicles.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/verifications" element={<Verifications />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/claims" element={<Claims />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
