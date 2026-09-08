import { apiClient, ApiResponse } from './client';
import { PageResponse } from './students';

export interface ApplicationDto {
  id: string;
  institutionId: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  programId: string;
  kcseMeanGrade?: string;
  status: string;
  createdAt: string;
}

export const admissionsApi = {
  getApplications: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<ApplicationDto>>> => {
    return apiClient<PageResponse<ApplicationDto>>(`/api/v1/admissions/applications?page=${page}&size=${size}`);
  },

  submitApplication: async (app: Partial<ApplicationDto>): Promise<ApiResponse<ApplicationDto>> => {
    return apiClient<ApplicationDto>('/api/v1/admissions/applications', {
      method: 'POST',
      body: JSON.stringify(app),
    });
  },

  decideApplication: async (id: string, status: string, notes?: string): Promise<ApiResponse<ApplicationDto>> => {
    const query = new URLSearchParams({ status });
    if (notes) query.append('notes', notes);
    return apiClient<ApplicationDto>(`/api/v1/admissions/applications/${id}/decision?${query.toString()}`, {
      method: 'PUT',
    });
  },
};
