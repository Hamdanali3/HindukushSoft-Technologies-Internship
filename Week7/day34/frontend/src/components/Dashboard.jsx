import React, { useState } from "react";
import useTasks from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import TaskFilters from "./TaskFilters";
import TaskForm from "./TaskForm";
import Navbar from "./Navbar";

/**
 * Dashboard
 *
 * The page a user lands on after logging in — only ever reachable via
 * <ProtectedRoute />. Functionally the same CRUD experience built in
 * Day 33, but every task shown here is guaranteed by the backend to
 * belong exclusively to the currently authenticated user.
 */
export default function Dashboard() {
  const {
    tasks, meta, isLoading, error, filters, setFilters, page, setPage,
    refetch, createTask, editTask, removeTask,
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
    <div className="app">
      <Navbar />
      <main className="app__main">
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
              Loading your tasks…
            </div>
          )}

          {!isLoading && error && (
            <div className="task-list__state task-list__state--error" role="alert">
              <p>{error}</p>
              <button onClick={refetch} className="btn btn--retry">Try again</button>
            </div>
          )}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="task-list__state">You have no tasks yet. Create your first one above!</div>
          )}

          {!isLoading && !error && tasks.length > 0 && (
            <>
              <div className="task-list__grid">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onEdit={setEditingTask} onDelete={removeTask} />
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
      </main>
    </div>
  );
}
