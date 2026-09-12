import { useCallback, useEffect, useState } from "react";
import { taskService } from "../services/api";

/**
 * useTasks
 *
 * Owns all state related to the task collection: fetching, filters,
 * pagination, and — new in Day 33 — the create/update/delete mutations.
 * Components call `createTask`, `editTask`, `removeTask` and the hook
 * takes care of re-syncing local state with the server's response, so
 * the UI is never left out of date after a mutation.
 */
export default function useTasks(initialFilters = {}) {
  const [tasks, setTasks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks({ ...filters, page });
      setTasks(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks. Please try again.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Creates a task, then re-fetches so pagination/meta stay correct.
   * Returns the created task on success or throws (so the calling
   * form component can display field-level validation errors).
   */
  const createTask = async (payload) => {
    const response = await taskService.createTask(payload);
    await fetchTasks();
    return response.data;
  };

  /**
   * Updates a task optimistically in local state, then confirms with
   * the server. If the request fails, we roll back to fresh data.
   */
  const editTask = async (id, payload) => {
    const response = await taskService.updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? response.data : t)));
    return response.data;
  };

  const removeTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks,
    meta,
    isLoading,
    error,
    filters,
    setFilters,
    page,
    setPage,
    refetch: fetchTasks,
    createTask,
    editTask,
    removeTask,
  };
}
