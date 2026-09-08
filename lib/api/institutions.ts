import { apiClient, ApiResponse } from './client';

export interface InstitutionDto {
  id: string;
  name: string;
  shortName: string;
  motto?: string;
  registrationNumber?: string;
  accreditationBody?: string;
  primaryColor?: string;
  currency?: string;
}

export const institutionsApi = {
  getCurrentInstitution: async (): Promise<ApiResponse<InstitutionDto>> => {
    return apiClient<InstitutionDto>('/api/v1/institutions/current');
  },

  updateInstitution: async (id: string, update: Partial<InstitutionDto>): Promise<ApiResponse<InstitutionDto>> => {
    return apiClient<InstitutionDto>(`/api/v1/institutions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  },
};
