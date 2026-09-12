import React from "react";

/**
 * TaskFilters
 *
 * Controlled form elements that let the user narrow down the task
 * list by status/priority/search term. Rather than filtering data
 * client-side, the chosen values are passed back up to the parent so
 * they can be sent to the Laravel API as query parameters — this
 * mirrors how a real production app would behave once the dataset
 * grows too large to ship to the browser in one go.
 */
export default function TaskFilters({ filters, onChange }) {
  const update = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return (
    <div className="task-filters">
      <input
        type="text"
        placeholder="Search by title…"
        defaultValue={filters.search || ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") update("search", e.target.value);
        }}
      />

      <select
        value={filters.status || ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={filters.priority || ""}
        onChange={(e) => update("priority", e.target.value)}
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
