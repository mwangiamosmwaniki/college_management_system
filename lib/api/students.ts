import { apiClient, ApiResponse } from './client';

export interface StudentEntity {
  id: string;
  userId?: string;
  institutionId: string;
  campusId: string;
  programId: string;
  admissionNumber: string;
  fullName: string;
  gender?: string;
  nationalId?: string;
  phoneNumber?: string;
  email?: string;
  status: string;
  feeBalance: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export const studentsApi = {
  getStudents: async (page = 0, size = 20, search?: string): Promise<ApiResponse<PageResponse<StudentEntity>>> => {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) query.append('search', search);
    return apiClient<PageResponse<StudentEntity>>(`/api/v1/students?${query.toString()}`);
  },

  getStudentById: async (id: string): Promise<ApiResponse<StudentEntity>> => {
    return apiClient<StudentEntity>(`/api/v1/students/${id}`);
  },

  createStudent: async (student: Partial<StudentEntity>): Promise<ApiResponse<StudentEntity>> => {
    return apiClient<StudentEntity>('/api/v1/students', {
      method: 'POST',
      body: JSON.stringify(student),
    });
  },

  updateStudent: async (id: string, update: Partial<StudentEntity>): Promise<ApiResponse<StudentEntity>> => {
    return apiClient<StudentEntity>(`/api/v1/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(update),
    });
  },
};
