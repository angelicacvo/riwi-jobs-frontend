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
    const response = await api.get<{ data: Vacancy[] }>(`/vacancies?${params.toString()}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Vacancy> {
    const response = await api.get<{ data: Vacancy }>(`/vacancies/${id}`);
    return response.data.data;
  },

  async create(data: CreateVacancyDto): Promise<Vacancy> {
    const response = await api.post<{ data: Vacancy }>('/vacancies', data);
    return response.data.data;
  },

  async update(id: string, data: Partial<CreateVacancyDto>): Promise<Vacancy> {
    const response = await api.patch<{ data: Vacancy }>(`/vacancies/${id}`, data);
    return response.data.data;
  },

  async toggleActive(id: string): Promise<Vacancy> {
    const response = await api.patch<{ data: Vacancy }>(`/vacancies/${id}/toggle-active`);
    return response.data.data;
  },

  async delete(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ data: { message: string } }>(`/vacancies/${id}`);
    return response.data.data;
  },

  async getAvailableSlots(): Promise<Vacancy[]> {
    const response = await api.get<{ data: Vacancy[] }>('/vacancies/available/slots');
    return response.data.data;
  },

  async getVacancyStats(id: string): Promise<VacancySingleStats> {
    const response = await api.get<{ data: VacancySingleStats }>(`/vacancies/stats/${id}`);
    return response.data.data;
  },

  async getGeneralStats(): Promise<VacancyStats> {
    const response = await api.get<{ data: VacancyStats }>('/vacancies/stats/general/overview');
    return response.data.data;
  },
};
