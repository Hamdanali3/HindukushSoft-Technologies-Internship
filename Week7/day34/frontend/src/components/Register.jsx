import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Register
 *
 * Creates a new account via POST /api/register. Server-side validation
 * errors (duplicate email, password too short/mismatched, etc.) are
 * mapped field-by-field, mirroring the pattern used in Day 33's
 * <TaskForm />, for a consistent error-handling experience across
 * the whole app.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: [err.response?.data?.message || "Registration failed."] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create your account</h2>

        {errors.general && <p className="field-error">{errors.general[0]}</p>}

        <label>
          Name
          <input name="name" required value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name[0]}</span>}
        </label>

        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email[0]}</span>}
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <span className="field-error">{errors.password[0]}</span>}
        </label>

        <label>
          Confirm password
          <input
            type="password"
            name="password_confirmation"
            required
            value={form.password_confirmation}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Sign up"}
        </button>

        <p className="auth-form__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
