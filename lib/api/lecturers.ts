import { apiClient, ApiResponse } from './client';
import { StudentEntity } from './students';

export interface CourseEntity {
  id: string;
  programId: string;
  code: string;
  name: string;
  creditHours: number;
  semester: number;
  lecturerUserId?: string;
  createdAt: string;
}

export interface ClassInfo {
  courseId: string;
  code: string;
  name: string;
  programId: string;
  creditHours: number;
  semester: number;
  enrolledCount: number;
}

export interface LecturerWorkload {
  totalCourses: number;
  totalCreditHours: number;
  totalStudents: number;
  assignedClasses: number;
}

export const lecturersApi = {
  getMyCourses: async (): Promise<ApiResponse<CourseEntity[]>> => {
    return apiClient<CourseEntity[]>('/api/v1/lecturers/me/courses');
  },

  getMyClasses: async (): Promise<ApiResponse<ClassInfo[]>> => {
    return apiClient<ClassInfo[]>('/api/v1/lecturers/me/classes');
  },

  getMyStudents: async (): Promise<ApiResponse<StudentEntity[]>> => {
    return apiClient<StudentEntity[]>('/api/v1/lecturers/me/students');
  },

  getMyWorkload: async (): Promise<ApiResponse<LecturerWorkload>> => {
    return apiClient<LecturerWorkload>('/api/v1/lecturers/me/workload');
  },
};
