import axios from 'axios';

// In dev: use Vite proxy (/api -> backend) to avoid CORS
// In production: use env var or fallback to backend URL
const baseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to all requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 - clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
