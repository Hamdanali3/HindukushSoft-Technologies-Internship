import React, { useState } from "react";

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
 * TaskItem
 *
 * Day 33 adds Edit and Delete actions on top of the Day 32 read-only
 * card. Delete asks for confirmation first — a small UX detail that
 * prevents accidental, irreversible data loss.
 */
export default function TaskItem({ task, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
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
