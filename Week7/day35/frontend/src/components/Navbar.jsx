import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar
 *
 * Shows the logged-in user's name and a logout button. Kept outside
 * of the Dashboard so it can eventually be reused across other
 * authenticated pages without duplication.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar__brand">TaskFlow</Link>
      {user && (
        <div className="navbar__user">
          <span>Hi, {user.name}</span>
          <button className="btn btn--small btn--secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
