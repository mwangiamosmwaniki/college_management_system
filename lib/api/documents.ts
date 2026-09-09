import { apiClient, ApiResponse } from './client';

export interface DocumentRecordDto {
  id: string;
  institutionId: string;
  documentType: string;
  studentId?: string;
  title: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  hashSha256: string;
  verificationCode: string;
  isVerified: boolean;
  createdBy: string;
  createdAt: string;
}

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
  getDocuments: async (): Promise<ApiResponse<DocumentRecordDto[]>> => {
    return apiClient<DocumentRecordDto[]>('/api/v1/documents');
  },

  getStudentDocuments: async (studentId: string): Promise<ApiResponse<DocumentRecordDto[]>> => {
    return apiClient<DocumentRecordDto[]>(`/api/v1/documents/student/${studentId}`);
  },

  getPresignedUrl: async (documentId: string, expireMinutes = 15): Promise<ApiResponse<{ downloadUrl: string; expiresInMinutes: number }>> => {
    return apiClient<{ downloadUrl: string; expiresInMinutes: number }>(`/api/v1/documents/${documentId}/presigned-url?expireMinutes=${expireMinutes}`);
  },

  uploadDocument: async (formData: FormData): Promise<ApiResponse<DocumentRecordDto>> => {
    const url = `/api/v1/documents/upload`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload document');
    }
    return data;
  },

  deleteDocument: async (documentId: string): Promise<ApiResponse<void>> => {
    return apiClient<void>(`/api/v1/documents/${documentId}`, {
      method: 'DELETE',
    });
  },

  verifyDocument: async (code: string): Promise<ApiResponse<DocumentVerificationDto>> => {
    return apiClient<DocumentVerificationDto>(`/api/v1/documents/verify/${encodeURIComponent(code)}`);
  },
};
