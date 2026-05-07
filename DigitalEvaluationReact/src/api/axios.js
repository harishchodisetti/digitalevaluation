import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "https://localhost:7275/api", // adjust to your API base
  withCredentials: true                  // ensures refreshToken cookie is sent
});

// Access token in memory
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// Request interceptor: attach access token if provided
API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: handle expired access token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Use API instance so withCredentials + baseURL are consistent
        const res = await API.get("/Auth/refreshToken");

        // Update memory with new access token
        setAccessToken(res.data.token);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        accessToken = null;
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
