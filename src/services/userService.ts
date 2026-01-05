import api from './api';
import { User, UserStats, CreateUserDto, UpdateUserDto } from '@/types';

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<{ data: User[] }>('/users');
    return response.data.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await api.post<{ data: User }>('/users', data);
    return response.data.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.patch<{ data: User }>(`/users/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ data: { message: string } }>(`/users/${id}`);
    return response.data.data;
  },

  async getStats(): Promise<UserStats> {
    const response = await api.get<{ data: UserStats }>('/users/stats/overview');
    return response.data.data;
  },
};
