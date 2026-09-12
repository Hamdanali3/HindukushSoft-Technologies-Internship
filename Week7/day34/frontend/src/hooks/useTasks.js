import { useCallback, useEffect, useState } from "react";
import taskService from "../services/taskService";

/**
 * useTasks
 *
 * Same responsibilities as Day 33's version. The only functional
 * difference is invisible at this layer: taskService now rides on
 * top of the authenticated `api` instance, so every request already
 * carries the logged-in user's bearer token and the backend returns
 * only that user's tasks.
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
      setError(err.response?.data?.message || "Unable to load your tasks. Please try again.");
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
