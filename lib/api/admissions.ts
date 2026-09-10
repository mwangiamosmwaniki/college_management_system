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

  startReview: async (id: string): Promise<ApiResponse<ApplicationDto>> => {
    return apiClient<ApplicationDto>(`/api/v1/admissions/applications/${id}/review`, {
      method: 'PUT',
    });
  },

  acceptOffer: async (id: string): Promise<ApiResponse<ApplicationDto>> => {
    return apiClient<ApplicationDto>(`/api/v1/admissions/applications/${id}/accept-offer`, {
      method: 'POST',
    });
  },

  matriculateApplicant: async (applicationId: string, campusId?: string, termId?: string): Promise<ApiResponse<any>> => {
    const query = new URLSearchParams();
    if (campusId) query.append('campusId', campusId);
    if (termId) query.append('termId', termId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return apiClient<any>(`/api/v1/admissions/applications/${applicationId}/matriculate${qs}`, {
      method: 'POST',
    });
  },
};
