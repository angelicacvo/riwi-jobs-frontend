import api from './api';
import { Application, ApplicationStats, PopularVacancy } from '@/types';

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const response = await api.get<Application[]>('/applications');
    return response.data;
  },

  async getById(id: string): Promise<Application> {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  },

  async create(vacancyId: string): Promise<Application> {
    const response = await api.post<Application>('/applications', { vacancyId });
    return response.data;
  },

  async update(id: string, status: string): Promise<Application> {
    const response = await api.patch<Application>(`/applications/${id}`, { status });
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/applications/${id}`);
    return response.data;
  },

  async getVacancyStats(vacancyId: string): Promise<{
    vacancyId: string;
    maxApplicants: number;
    currentApplications: number;
    availableSlots: number;
    isFullyBooked: boolean;
  }> {
    const response = await api.get(`/applications/vacancy/${vacancyId}/stats`);
    return response.data;
  },

  async getUserStats(userId: string): Promise<{
    userId: string;
    totalApplications: number;
    activeApplications: number;
    recentApplications: Application[];
  }> {
    const response = await api.get(`/applications/stats/user/${userId}`);
    return response.data;
  },

  async getPopularVacancies(): Promise<PopularVacancy[]> {
    const response = await api.get<PopularVacancy[]>('/applications/stats/popular/vacancies');
    return response.data;
  },

  async getDashboard(): Promise<ApplicationStats> {
    const response = await api.get<ApplicationStats>('/applications/stats/dashboard');
    return response.data;
  },
};
