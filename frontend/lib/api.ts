import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status !== 401) {
      console.error(`API Error (${response.status}):`, error.message);
    }

    return Promise.reject(error);
  },
);

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Log public API errors (these shouldn't be auth errors)
    if (response) {
      console.error(`Public API Error (${response.status}):`, error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
