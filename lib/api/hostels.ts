import { apiClient, ApiResponse } from './client';

export interface HostelEntity {
  id: string;
  institutionId: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
  capacity: number;
  occupiedBeds?: number;
}

export interface HostelAllocationEntity {
  id: string;
  institutionId: string;
  bedId: string;
  studentId: string;
  academicTermId?: string;
  status: 'ACTIVE' | 'CHECKED_OUT' | 'CANCELLED';
  allocatedAt: string;
  checkedInAt?: string;
  checkedOutAt?: string;
}

export const hostelsApi = {
  getHostels: async (): Promise<ApiResponse<HostelEntity[]>> => {
    return apiClient<HostelEntity[]>('/api/v1/hostels');
  },

  createHostel: async (hostel: Partial<HostelEntity>): Promise<ApiResponse<HostelEntity>> => {
    return apiClient<HostelEntity>('/api/v1/hostels', {
      method: 'POST',
      body: JSON.stringify(hostel),
    });
  },

  allocateBed: async (payload: { bedId: string; studentId: string; academicTermId?: string }): Promise<ApiResponse<HostelAllocationEntity>> => {
    return apiClient<HostelAllocationEntity>('/api/v1/hostels/allocate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  checkout: async (allocationId: string): Promise<ApiResponse<HostelAllocationEntity>> => {
    return apiClient<HostelAllocationEntity>(`/api/v1/hostels/allocations/${allocationId}/checkout`, {
      method: 'POST',
    });
  },

  getStudentAllocations: async (studentId: string): Promise<ApiResponse<HostelAllocationEntity[]>> => {
    return apiClient<HostelAllocationEntity[]>(`/api/v1/hostels/allocations/student/${studentId}`);
  },
};
