import React, { useState } from "react";
import { parseApiError } from "../utils/parseApiError";
import { useToast } from "./ToastProvider";

const PRIORITY_STYLES = {
  low: { background: "#E8F5E9", color: "#2E7D32" },
  medium: { background: "#FFF8E1", color: "#F9A825" },
  high: { background: "#FFEBEE", color: "#C62828" },
};

const STATUS_LABELS = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

/**
 * TaskItem (Day 35 version)
 *
 * Adds proper failure handling to the delete action: if the DELETE
 * request fails (network issue, the task was already removed by
 * another tab, a 403 because ownership somehow changed, etc.) the
 * user gets a clear toast instead of the button silently doing
 * nothing or the UI throwing an unhandled promise rejection.
 */
export default function TaskItem({ task, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      showToast("Task deleted.", "success");
    } catch (err) {
      const { message } = parseApiError(err);
      showToast(message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <span
          className="task-card__badge"
          style={{ background: priorityStyle.background, color: priorityStyle.color }}
        >
          {task.priority}
        </span>
      </div>

      {task.description && <p className="task-card__description">{task.description}</p>}

      <div className="task-card__footer">
        <span className={`task-card__status task-card__status--${task.status}`}>
          {STATUS_LABELS[task.status] || task.status}
        </span>
        {task.due_date && (
          <span className={`task-card__due ${task.is_overdue ? "task-card__due--overdue" : ""}`}>
            Due {task.due_date}
            {task.is_overdue && " (overdue)"}
          </span>
        )}
      </div>

      <div className="task-card__actions">
        <button className="btn btn--small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn--small btn--danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
