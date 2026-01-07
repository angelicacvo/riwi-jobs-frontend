import api from './api';
import { LoginResponse, User, UserRole } from '@/types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<{ data: LoginResponse }>('/auth/login', { email, password });
    return response.data.data;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await api.post<{ data: User }>('/auth/register', { name, email, password });
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },

  saveAuth(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
