import api from './api';
import { Application, ApplicationStats, PopularVacancy } from '@/types';

export const applicationService = {
  async getAll(): Promise<Application[]> {
    const response = await api.get<{ data: Application[] }>('/applications');
    return response.data.data;
  },

  async getById(id: string): Promise<Application> {
    const response = await api.get<{ data: Application }>(`/applications/${id}`);
    return response.data.data;
  },

  async create(vacancyId: string): Promise<Application> {
    const response = await api.post<{ data: Application }>('/applications', { vacancyId });
    return response.data.data;
  },

  async update(id: string, data: Partial<Application>): Promise<Application> {
    const response = await api.patch<{ data: Application }>(`/applications/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ data: { message: string } }>(`/applications/${id}`);
    return response.data.data;
  },

  async getVacancyStats(vacancyId: string): Promise<{
    vacancyId: string;
    maxApplicants: number;
    currentApplications: number;
    availableSlots: number;
    isFullyBooked: boolean;
  }> {
    const response = await api.get<{ data: any }>(`/applications/vacancy/${vacancyId}/stats`);
    return response.data.data;
  },

  async getUserStats(userId: string): Promise<{
    userId: string;
    totalApplications: number;
    activeApplications: number;
    recentApplications: Application[];
  }> {
    const response = await api.get<{ data: any }>(`/applications/stats/user/${userId}`);
    return response.data.data;
  },

  async getPopularVacancies(): Promise<PopularVacancy[]> {
    const response = await api.get<{ data: PopularVacancy[] }>('/applications/stats/popular/vacancies');
    return response.data.data;
  },

  async getDashboard(): Promise<ApplicationStats> {
    const response = await api.get<{ data: ApplicationStats }>('/applications/stats/dashboard');
    return response.data.data;
  },
};
