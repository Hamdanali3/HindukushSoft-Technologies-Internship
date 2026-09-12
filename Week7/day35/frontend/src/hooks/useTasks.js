import { useCallback, useEffect, useState } from "react";
import taskService from "../services/taskService";
import { parseApiError } from "../utils/parseApiError";

/**
 * useTasks (Day 35 version)
 *
 * Same data-fetching responsibilities as before, but the error branch
 * now goes through the shared parseApiError() helper instead of
 * reaching into `err.response?.data?.message` by hand — one less
 * place for that logic to drift out of sync with the rest of the app.
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
      setError(parseApiError(err).message);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload) => {
    const response = await taskService.createTask(payload);
    await fetchTasks();
    return response.data;
  };

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
    tasks, meta, isLoading, error, filters, setFilters, page, setPage,
    refetch: fetchTasks, createTask, editTask, removeTask,
  };
}
