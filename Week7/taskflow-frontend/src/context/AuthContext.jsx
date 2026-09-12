import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

/**
 * AuthProvider
 *
 * Owns the single source of truth for "who is logged in" across the
 * entire app. On first mount it checks localStorage for a previously
 * stored token and, if found, verifies it against GET /api/me so a
 * page refresh doesn't unexpectedly log the user out (or worse, keep
 * them "logged in" locally against a token the server has revoked).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("taskflow_token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await authService.me();
        setUser(response.data);
      } catch {
        // Token was invalid/expired — clean up quietly.
        localStorage.removeItem("taskflow_token");
        localStorage.removeItem("taskflow_user");
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem("taskflow_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    localStorage.setItem("taskflow_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("taskflow_token");
      setUser(null);
    }
  };

  const value = { user, isLoading, isAuthenticated: !!user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth
 * Convenience hook so components can do `const { user, logout } = useAuth()`
 * instead of importing/consuming the context manually every time.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
