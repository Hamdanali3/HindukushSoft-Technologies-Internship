import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import "./styles/app.css";

/**
 * App
 *
 * Defines the full route map for Day 34:
 *   /login, /register  -> public, auth forms
 *   /dashboard          -> protected, wrapped by <ProtectedRoute />
 *   /                   -> redirects into /dashboard (guard decides
 *                          whether that lands the user on the
 *                          dashboard itself or bounces to /login)
 *
 * <AuthProvider> wraps everything so any component in the tree can
 * call useAuth() to read the current user or trigger login/logout.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
