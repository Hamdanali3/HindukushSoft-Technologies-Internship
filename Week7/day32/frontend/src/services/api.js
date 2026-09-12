import axios from "axios";

/**
 * Centralised Axios instance for talking to the TaskFlow Laravel API.
 *
 * Keeping this configuration in one place (instead of hard-coding the
 * base URL inside every component) means that switching environments
 * (local -> staging -> production) is a one-line change, and every
 * request automatically benefits from shared defaults such as headers
 * and timeouts.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * taskService
 *
 * A thin wrapper around the raw Axios calls. Components should never
 * call `axios` or `api` directly — they should go through this
 * service. This keeps API concerns (URLs, query params) separate
 * from UI concerns (components), which makes both sides far easier
 * to test and to maintain.
 */
export const taskService = {
  /**
   * Fetch a paginated list of tasks, optionally filtered.
   * @param {{status?: string, priority?: string, search?: string, page?: number}} params
   */
  async getTasks(params = {}) {
    const response = await api.get("/tasks", { params });
    return response.data; // { success, message, data, meta }
  },

  /**
   * Fetch a single task by its ID.
   * @param {number|string} id
   */
  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
