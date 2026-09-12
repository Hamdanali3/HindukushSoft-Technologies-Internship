import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 *
 * A route guard used inside React Router's route tree:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 * While the auth state is still bootstrapping (checking localStorage
 * / verifying the token with the server) it shows a neutral loading
 * state rather than flashing the login page. Once resolved, it either
 * renders the nested route (<Outlet />) or redirects to /login,
 * remembering the page the user was trying to reach so we can send
 * them back there after a successful login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="app__loading">Checking your session…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
