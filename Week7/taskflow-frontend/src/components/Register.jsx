import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parseApiError } from "../utils/parseApiError";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const { message, fieldErrors: fe } = parseApiError(err);
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
      } else {
        setGeneralError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create your account</h2>

        {generalError && <p className="field-error">{generalError}</p>}

        <label>
          Name
          <input name="name" required value={form.name} onChange={handleChange} />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name[0]}</span>}
        </label>

        <label>
          Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email[0]}</span>}
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
          {fieldErrors.password && <span className="field-error">{fieldErrors.password[0]}</span>}
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
