import axios from "axios";

/**
 * Axios instance shared across the whole app. A request interceptor
 * automatically attaches the stored bearer token (if any) to every
 * outgoing request, so individual components/services never have to
 * remember to do it themselves.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * If the API ever responds with 401 (token missing/expired/revoked),
 * proactively clear local auth state and send the user back to the
 * login screen instead of leaving them staring at a broken page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("taskflow_token");
      localStorage.removeItem("taskflow_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
