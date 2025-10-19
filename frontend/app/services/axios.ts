import axios from "axios";

const api = axios.create({
  baseURL: process.env.AXIOS_BACKEND_URL,
});

export default api;
