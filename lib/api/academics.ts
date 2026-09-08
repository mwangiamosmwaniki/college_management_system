import { apiClient, ApiResponse } from './client';

export interface AssessmentDto {
  id: string;
  courseId: string;
  academicTermId: string;
  title: string;
  type: string;
  maxMarks: number;
  weightPercentage: number;
}

export interface StudentMarkDto {
  id: string;
  assessmentId: string;
  studentId: string;
  score: number;
  enteredBy: string;
  status: 'DRAFT' | 'SUBMITTED' | 'MODERATED' | 'APPROVED' | 'PUBLISHED';
}

export const academicsApi = {
  getAssessments: async (courseId: string): Promise<ApiResponse<AssessmentDto[]>> => {
    return apiClient<AssessmentDto[]>(`/api/v1/academics/assessments?courseId=${courseId}`);
  },

  getStudentMarks: async (studentId: string): Promise<ApiResponse<StudentMarkDto[]>> => {
    return apiClient<StudentMarkDto[]>(`/api/v1/academics/marks/student/${studentId}`);
  },

  enterMark: async (payload: {
    assessmentId: string;
    studentId: string;
    score: number;
  }): Promise<ApiResponse<StudentMarkDto>> => {
    return apiClient<StudentMarkDto>('/api/v1/academics/marks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  transitionStatus: async (markId: string, targetStatus: string): Promise<ApiResponse<StudentMarkDto>> => {
    return apiClient<StudentMarkDto>(`/api/v1/academics/marks/${markId}/status?targetStatus=${targetStatus}`, {
      method: 'PUT',
    });
  },
};
