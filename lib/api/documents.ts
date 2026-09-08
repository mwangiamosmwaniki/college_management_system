import { apiClient, ApiResponse } from './client';

export interface DocumentVerificationDto {
  documentId: string;
  title: string;
  documentType: string;
  institutionId: string;
  issuedAt: string;
  isAuthentic: boolean;
  sha256Hash?: string;
  verificationCode: string;
}

export const documentsApi = {
  verifyDocument: async (code: string): Promise<ApiResponse<DocumentVerificationDto>> => {
    return apiClient<DocumentVerificationDto>(`/api/v1/documents/verify/${encodeURIComponent(code)}`);
  },
};
