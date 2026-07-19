import axios from 'axios';

// Dynamically set API URL based on Vite env variables or proxy fallback
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send credentials (cookies) for HTTPOnly session & refresh tokens
  xsrfCookieName: 'XSRF-TOKEN', // Automatically extract CSRF token from cookie
  xsrfHeaderName: 'x-xsrf-token', // Automatically send CSRF token in header
});

// Request interceptor to attach JWT token (legacy support, cookies are primary)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error mapping
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-refresh token rotation if access token expires (returns 401)
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login' && originalRequest.url !== '/auth/refresh') {
      originalRequest._retry = true;
      try {
        const refreshRes = await authAPI.refresh();
        const { token } = refreshRes.data;
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.warn('Session expired, logging out user.');
        localStorage.removeItem('token');
        // Optional: redirect to login if window is available
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    const message =
      error.response?.data?.message || 'Something went wrong. Please check your internet connection.';
    
    // Create custom error object to pass readable messages
    const customError = new Error(message);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    
    return Promise.reject(customError);
  }
);

// Centralized API Operations Layer
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  refresh: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  profile: () => api.get('/auth/profile'),
};

export const aiAPI = {
  askChat: (query) => api.post('/ai/chat', { query }),
  askCompanion: (query) => api.post('/ai/companion', { query }),
  askSustainability: (query) => api.post('/ai/sustainability', { query }),
};

export const crowdAPI = {
  getStatus: () => api.get('/crowd/status'),
  updateStatus: (zoneId, statusData) => api.put(`/crowd/status/${zoneId}`, statusData),
};

export const emergencyAPI = {
  getAlerts: () => api.get('/emergency/alerts'),
  triggerAlert: (payload) => api.post('/emergency/trigger', payload),
  resolveAlert: (id) => api.put(`/emergency/resolve/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
};

export const contactAPI = {
  submit: (name, email, subject, message) => api.post('/contact', { name, email, subject, message }),
};

export default api;
