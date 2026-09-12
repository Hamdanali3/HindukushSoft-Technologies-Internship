import React, { useEffect, useState } from "react";
import { parseApiError } from "../utils/parseApiError";
import { useToast } from "./ToastProvider";

const EMPTY_TASK = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  due_date: "",
};

/**
 * TaskForm (Day 35 version)
 *
 * Builds on Day 33's form by routing every failure through the shared
 * parseApiError() helper, and surfacing non-field-specific failures
 * (network errors, 500s) as a toast rather than a silent/blank state.
 * Field-level 422 errors are still shown inline next to each input —
 * two complementary error channels, used for the two different kinds
 * of problems they best represent.
 */
export default function TaskForm({ initialTask = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setForm(initialTask ? { ...EMPTY_TASK, ...initialTask } : EMPTY_TASK);
    setFieldErrors({});
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await onSubmit(form);
      showToast(initialTask ? "Task updated." : "Task created.", "success");
      if (!initialTask) setForm(EMPTY_TASK);
    } catch (err) {
      const { message, fieldErrors: fe } = parseApiError(err);
      if (Object.keys(fe).length > 0) {
        setFieldErrors(fe);
      }
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h3>{initialTask ? "Edit Task" : "New Task"}</h3>

      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title[0]}</span>}
      </label>

      <label>
        Description
        <textarea name="description" value={form.description || ""} onChange={handleChange} rows={3} />
        {fieldErrors.description && <span className="field-error">{fieldErrors.description[0]}</span>}
      </label>

      <div className="task-form__row">
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {fieldErrors.status && <span className="field-error">{fieldErrors.status[0]}</span>}
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {fieldErrors.priority && <span className="field-error">{fieldErrors.priority[0]}</span>}
        </label>

        <label>
          Due date
          <input type="date" name="due_date" value={form.due_date || ""} onChange={handleChange} />
          {fieldErrors.due_date && <span className="field-error">{fieldErrors.due_date[0]}</span>}
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
