
import axios from 'axios';

// Detect the correct base URL with fallback for different environments
const getBaseURL = () => {
  const meta = import.meta as any;
  if (meta.env?.VITE_API_BASE_URL) return meta.env.VITE_API_BASE_URL;
  if (typeof process !== 'undefined' && process.env.VITE_API_BASE_URL) return process.env.VITE_API_BASE_URL;
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token from persistent storage
api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh and session persistence
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token using the refresh token (handled by cookies/backend)
        const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        const { accessToken } = res.data;

        // Persist the new token
        window.localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed/expired - clear persistent session and redirect
        window.localStorage.removeItem('accessToken');
        window.localStorage.removeItem('aradhya_user');
        window.location.href = '#/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
