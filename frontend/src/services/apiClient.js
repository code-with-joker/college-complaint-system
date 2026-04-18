import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// console.log("API BASE:", API_BASE_URL); // 🔥 debug

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

// 🔐 token auto attach
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;