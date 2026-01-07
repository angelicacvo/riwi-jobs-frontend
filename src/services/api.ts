import axios from 'axios';
import Swal from 'sweetalert2';

// Backend URL - Se configura según el entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://riwi-jobs-production.up.railway.app';
const API_KEY = import.meta.env.VITE_API_KEY || 'riwi-2024-secret-key-pro';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        icon: 'error',
        title: 'Sesion expirada',
        text: 'Por favor inicia sesion nuevamente',
        confirmButtonColor: 'hsl(240, 50%, 12%)',
      }).then(() => {
        window.location.href = '/login';
      });
    } else if (status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos para realizar esta accion',
        confirmButtonColor: 'hsl(240, 50%, 12%)',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
