import React, { useEffect, useState } from "react";

const EMPTY_TASK = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  due_date: "",
};

/**
 * TaskForm
 *
 * A single reusable form for BOTH creating and editing a task —
 * driven by whether an `initialTask` prop is supplied. This avoids
 * maintaining two near-identical forms and mirrors how most
 * production React codebases handle the "create vs edit" pattern.
 *
 * Server-side validation errors (HTTP 422 from Laravel, see Day 35)
 * are displayed inline, next to the field that failed.
 */
export default function TaskForm({ initialTask = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(initialTask ? { ...EMPTY_TASK, ...initialTask } : EMPTY_TASK);
    setErrors({});
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit(form);
      if (!initialTask) setForm(EMPTY_TASK); // reset after a successful create
    } catch (err) {
      // Laravel's 422 validation response shape: { message, errors: { field: [msgs] } }
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setErrors({ general: [err.response?.data?.message || "Something went wrong."] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h3>{initialTask ? "Edit Task" : "New Task"}</h3>

      {errors.general && <p className="field-error">{errors.general[0]}</p>}

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
        {errors.title && <span className="field-error">{errors.title[0]}</span>}
      </label>

      <label>
        Description
        <textarea name="description" value={form.description || ""} onChange={handleChange} rows={3} />
        {errors.description && <span className="field-error">{errors.description[0]}</span>}
      </label>

      <div className="task-form__row">
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {errors.status && <span className="field-error">{errors.status[0]}</span>}
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <span className="field-error">{errors.priority[0]}</span>}
        </label>

        <label>
          Due date
          <input type="date" name="due_date" value={form.due_date || ""} onChange={handleChange} />
          {errors.due_date && <span className="field-error">{errors.due_date[0]}</span>}
        </label>
      </div>

      <div className="task-form__actions">
        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : initialTask ? "Update Task" : "Create Task"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
