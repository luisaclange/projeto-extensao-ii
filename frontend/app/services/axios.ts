import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BACKEND_URL,
});

export default api;
