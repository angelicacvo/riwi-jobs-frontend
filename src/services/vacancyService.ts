import api from './api';
import { Vacancy, VacancyStats, VacancySingleStats, CreateVacancyDto, VacancyFilters } from '@/types';

export const vacancyService = {
  async getAll(filters?: VacancyFilters): Promise<Vacancy[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<Vacancy[]>(`/vacancies?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Vacancy> {
    const response = await api.get<Vacancy>(`/vacancies/${id}`);
    return response.data;
  },

  async create(data: CreateVacancyDto): Promise<Vacancy> {
    const response = await api.post<Vacancy>('/vacancies', data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateVacancyDto>): Promise<Vacancy> {
    const response = await api.patch<Vacancy>(`/vacancies/${id}`, data);
    return response.data;
  },

  async toggleActive(id: string): Promise<Vacancy> {
    const response = await api.patch<Vacancy>(`/vacancies/${id}/toggle-active`);
    return response.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/vacancies/${id}`);
    return response.data;
  },

  async getAvailableSlots(): Promise<Vacancy[]> {
    const response = await api.get<Vacancy[]>('/vacancies/available/slots');
    return response.data;
  },

  async getVacancyStats(id: string): Promise<VacancySingleStats> {
    const response = await api.get<VacancySingleStats>(`/vacancies/stats/${id}`);
    return response.data;
  },

  async getGeneralStats(): Promise<VacancyStats> {
    const response = await api.get<VacancyStats>('/vacancies/stats/general/overview');
    return response.data;
  },
};
