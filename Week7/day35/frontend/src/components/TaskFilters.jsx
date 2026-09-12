import React from "react";

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
      <select value={filters.status || ""} onChange={(e) => update("status", e.target.value)}>
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select value={filters.priority || ""} onChange={(e) => update("priority", e.target.value)}>
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
