import React, { useState } from "react";
import useTasks from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import TaskFilters from "./TaskFilters";
import TaskForm from "./TaskForm";

/**
 * TaskList
 *
 * The orchestrator component for Day 33's full CRUD experience.
 * It wires the <TaskForm /> (create/edit) to the <TaskItem /> list
 * (read/delete) via the useTasks hook, so all four CRUD operations
 * are demonstrated end-to-end against the real Laravel API.
 */
export default function TaskList() {
  const {
    tasks,
    meta,
    isLoading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    refetch,
    createTask,
    editTask,
    removeTask,
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);

  const handleCreateOrUpdate = async (payload) => {
    if (editingTask) {
      await editTask(editingTask.id, payload);
      setEditingTask(null);
    } else {
      await createTask(payload);
    }
  };

  return (
    <section className="task-list">
      <TaskForm
        initialTask={editingTask}
        onSubmit={handleCreateOrUpdate}
        onCancel={editingTask ? () => setEditingTask(null) : null}
      />

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
          <button onClick={refetch} className="btn btn--retry">Try again</button>
        </div>
      )}

      {!isLoading && !error && tasks.length === 0 && (
        <div className="task-list__state">No tasks match your filters yet. Create one above!</div>
      )}

      {!isLoading && !error && tasks.length > 0 && (
        <>
          <div className="task-list__grid">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={removeTask}
              />
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="task-list__pagination">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn">
                Previous
              </button>
              <span>Page {meta.current_page} of {meta.last_page}</span>
              <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="btn">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
