export enum UserRole {
  ADMIN = "administrator",
  GESTOR = "manager",
  CODER = "developer"
}

export enum ModalityEnum {
  REMOTE = "remote",
  ONSITE = "onsite",
  HYBRID = "hybrid"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  description: string;
  technologies: string;
  seniority: string;
  softSkills?: string;
  location: string;
  modality: string;
  salaryRange: string;
  company: string;
  maxApplicants: number;
  isActive: boolean;
  createdAt: string;
  applications?: Application[];
}

export interface Application {
  id: string;
  userId: string;
  vacancyId: string;
  appliedAt: string;
  user?: User;
  vacancy?: Vacancy;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface UserStats {
  totalUsers: number;
  usersByRole: {
    [key: string]: number;
  };
  recentUsers: User[];
}

export interface VacancyStats {
  totalVacancies: number;
  activeVacancies: number;
  inactiveVacancies: number;
  vacanciesWithAvailableSlots: number;
  mostRecentVacancies: Vacancy[];
}

export interface ApplicationStats {
  totalApplications: number;
  vacanciesWithApplications: number;
  usersWithApplications: number;
  recentApplications: Application[];
  mostPopularVacancies: PopularVacancy[];
}

export interface PopularVacancy {
  vacancyId: string;
  title: string;
  company: string;
  applicationsCount: number;
}

export interface VacancySingleStats {
  vacancyId: string;
  title: string;
  company: string;
  maxApplicants: number;
  currentApplications: number;
  availableSlots: number;
  isFullyBooked: boolean;
  isActive: boolean;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface CreateVacancyDto {
  title: string;
  description: string;
  technologies: string;
  seniority: string;
  softSkills?: string;
  location: string;
  modality: string;
  salaryRange: string;
  company: string;
  maxApplicants: number;
}

export interface VacancyFilters {
  company?: string;
  location?: string;
  modality?: string;
  isActive?: boolean;
  hasAvailableSlots?: boolean;
  page?: number;
  limit?: number;
  order?: 'ASC' | 'DESC';
  orderBy?: string;
}
