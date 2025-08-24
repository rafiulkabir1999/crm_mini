import axios from "axios";

const fetchInstance = axios.create({
  baseURL: "/api", // your API routes
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token automatically
fetchInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken"); // or from context
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default fetchInstance;
