import React from "react";
import useTasks from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import TaskFilters from "./TaskFilters";

/**
 * TaskList
 *
 * Fetches tasks from the Laravel API (via the useTasks hook) and
 * renders them. Explicitly handles the three states every API-driven
 * component must account for: loading, error, and empty — this is
 * what separates a "demo" fetch from a production-ready one.
 */
export default function TaskList() {
  const { tasks, meta, isLoading, error, filters, setFilters, page, setPage, refetch } =
    useTasks();

  return (
    <section className="task-list">
      <header className="task-list__header">
        <h2>My Tasks</h2>
        <TaskFilters filters={filters} onChange={setFilters} />
      </header>

      {isLoading && (
        <div className="task-list__state" role="status">
          <span className="spinner" aria-hidden="true" />
          Loading tasks…
        </div>
      )}

      {!isLoading && error && (
        <div className="task-list__state task-list__state--error" role="alert">
          <p>{error}</p>
          <button onClick={refetch} className="btn btn--retry">
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="task-list__state">No tasks match your filters yet.</div>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <>
          <div className="task-list__grid">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="task-list__pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn"
              >
                Previous
              </button>
              <span>
                Page {meta.current_page} of {meta.last_page}
              </span>
              <button
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
