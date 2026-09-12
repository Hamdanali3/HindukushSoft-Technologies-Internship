import { useCallback, useEffect, useState } from "react";
import { taskService } from "../services/api";

/**
 * useTasks
 *
 * A small custom hook that owns all the "data fetching" concerns for
 * the task list: loading state, error state, pagination and filters.
 * Wrapping this logic in a hook (rather than duplicating it inside a
 * component) keeps <TaskList /> focused purely on rendering.
 *
 * @param {{status?: string, priority?: string, search?: string}} initialFilters
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
      // Network failures, 500s, timeouts etc. all land here.
      setError(
        err.response?.data?.message ||
          "Unable to reach the server. Please check your connection and try again."
      );
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
  };
}
