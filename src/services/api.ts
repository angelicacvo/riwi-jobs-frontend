import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'riwi-2024-secret-key-pro';

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
    const message = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      Swal.fire({
        icon: 'error',
        title: 'Sesión expirada',
        text: 'Por favor inicia sesión nuevamente',
        confirmButtonColor: 'hsl(235, 45%, 20%)',
      }).then(() => {
        window.location.href = '/login';
      });
    } else if (status === 403) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos para realizar esta acción',
        confirmButtonColor: 'hsl(235, 45%, 20%)',
      });
    }

    return Promise.reject(error);
  }
);

export default api;
