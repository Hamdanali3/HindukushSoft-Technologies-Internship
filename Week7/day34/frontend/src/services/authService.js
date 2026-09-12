import api from "./api";

/**
 * authService
 *
 * Wraps the four auth endpoints exposed by AuthController. Kept
 * separate from taskService so authentication concerns don't bleed
 * into business-domain (task) concerns.
 */
export const authService = {
  async register({ name, email, password, password_confirmation }) {
    const response = await api.post("/register", {
      name,
      email,
      password,
      password_confirmation,
    });
    return response.data;
  },

  async login({ email, password }) {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post("/logout");
    return response.data;
  },

  async me() {
    const response = await api.get("/me");
    return response.data;
  },
};

export default authService;
