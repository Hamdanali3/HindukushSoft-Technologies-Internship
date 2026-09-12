import api from "./api";

/**
 * taskService
 *
 * Identical shape to Day 33's version, but now built on top of the
 * `api` instance from ./api.js — every call automatically carries the
 * logged-in user's bearer token, and the backend (Day 34's
 * TaskController) uses that token to scope results to that user only.
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

  async createTask(payload) {
    const response = await api.post("/tasks", payload);
    return response.data;
  },

  async updateTask(id, payload) {
    const response = await api.put(`/tasks/${id}`, payload);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default taskService;
