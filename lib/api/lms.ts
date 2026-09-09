import { apiClient, ApiResponse } from './client';

export interface LmsAssignmentEntity {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  maxScore: number;
  dueDate: string;
  createdAt: string;
}

export interface LmsSubmissionEntity {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionText?: string;
  fileAttachmentUrl?: string;
  score?: number;
  feedback?: string;
  gradedBy?: string;
  status: 'SUBMITTED' | 'LATE' | 'GRADED';
  submittedAt: string;
}

export const lmsApi = {
  getAssignments: async (courseId: string): Promise<ApiResponse<LmsAssignmentEntity[]>> => {
    return apiClient<LmsAssignmentEntity[]>(`/api/v1/lms/assignments/course/${courseId}`);
  },

  createAssignment: async (assignment: Partial<LmsAssignmentEntity>): Promise<ApiResponse<LmsAssignmentEntity>> => {
    return apiClient<LmsAssignmentEntity>('/api/v1/lms/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment),
    });
  },

  submitAssignment: async (assignmentId: string, payload: { studentId: string; submissionText: string }): Promise<ApiResponse<LmsSubmissionEntity>> => {
    return apiClient<LmsSubmissionEntity>(`/api/v1/lms/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getSubmissions: async (assignmentId: string): Promise<ApiResponse<LmsSubmissionEntity[]>> => {
    return apiClient<LmsSubmissionEntity[]>(`/api/v1/lms/assignments/${assignmentId}/submissions`);
  },

  gradeSubmission: async (submissionId: string, payload: { score: number; feedback?: string }): Promise<ApiResponse<LmsSubmissionEntity>> => {
    return apiClient<LmsSubmissionEntity>(`/api/v1/lms/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getStudentSubmissions: async (studentId: string): Promise<ApiResponse<LmsSubmissionEntity[]>> => {
    return apiClient<LmsSubmissionEntity[]>(`/api/v1/lms/submissions/student/${studentId}`);
  },
};
