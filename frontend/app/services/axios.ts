import axios, { isAxiosError } from "axios";
import { redirect } from "react-router";

const api = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BACKEND_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isAxiosError(error)) {
      if (
        error.status == 401 &&
        error.response?.data.message == "Token inválido ou expirado."
      ) {
        window.location.href = "/login";
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
