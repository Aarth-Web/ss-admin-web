import axios from "axios";
import { API_CONFIG, AUTH_CONFIG } from "../config";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if this is a 401 error but not from the login or token verification endpoint
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login") &&
      !error.config.url.includes("/auth/verify")
    ) {
      // Don't redirect if we're already on the login page to prevent loops
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
