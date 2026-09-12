import React from "react";

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
 * Purely presentational — it receives a `task` object as a prop and
 * renders it. It holds no fetching logic of its own, which makes it
 * trivially reusable (e.g. inside a modal, a Kanban card, etc.) and
 * easy to unit test in isolation.
 */
export default function TaskItem({ task }) {
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

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

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

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
    </div>
  );
}
