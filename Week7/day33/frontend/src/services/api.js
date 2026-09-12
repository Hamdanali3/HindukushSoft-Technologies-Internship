import axios from "axios";

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
 * Day 33 extends the Day 32 read-only service into a full CRUD client
 * that mirrors every endpoint exposed by TaskController: index, store,
 * show, update, destroy. Every component that needs to talk to the
 * backend goes through this single module.
 */
export const taskService = {
  async getTasks(params = {}) {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  async getTask(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * @param {{title: string, description?: string, status?: string, priority?: string, due_date?: string}} payload
   */
  async createTask(payload) {
    const response = await api.post("/tasks", payload);
    return response.data;
  },

  /**
   * @param {number|string} id
   * @param {object} payload - partial or full task fields
   */
  async updateTask(id, payload) {
    const response = await api.put(`/tasks/${id}`, payload);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
