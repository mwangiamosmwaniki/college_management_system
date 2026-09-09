import { apiClient, ApiResponse } from './client';

export interface EmployeeEntity {
  id: string;
  institutionId: string;
  employeeNumber: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  departmentId?: string;
  jobTitle: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'ADJUNCT';
  basicSalary: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
}

export interface LeaveRequestEntity {
  id: string;
  institutionId: string;
  employeeId: string;
  leaveType: 'ANNUAL' | 'SICK' | 'MATERNITY' | 'STUDY' | 'COMPASSIONATE';
  startDate: string;
  endDate: string;
  reason?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
}

export interface PayrollBatchEntity {
  id: string;
  institutionId: string;
  month: number;
  year: number;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  status: 'DRAFT' | 'APPROVED' | 'PROCESSED';
  processedAt?: string;
}

export const hrApi = {
  getEmployees: async (): Promise<ApiResponse<EmployeeEntity[]>> => {
    return apiClient<EmployeeEntity[]>('/api/v1/hr/employees');
  },

  createEmployee: async (employee: Partial<EmployeeEntity>): Promise<ApiResponse<EmployeeEntity>> => {
    return apiClient<EmployeeEntity>('/api/v1/hr/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  },

  getLeaveRequests: async (): Promise<ApiResponse<LeaveRequestEntity[]>> => {
    return apiClient<LeaveRequestEntity[]>('/api/v1/hr/leave');
  },

  submitLeave: async (request: Partial<LeaveRequestEntity>): Promise<ApiResponse<LeaveRequestEntity>> => {
    return apiClient<LeaveRequestEntity>('/api/v1/hr/leave', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  decideLeave: async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<LeaveRequestEntity>> => {
    return apiClient<LeaveRequestEntity>(`/api/v1/hr/leave/${id}/decision?status=${status}`, {
      method: 'PUT',
    });
  },

  getPayrollBatches: async (): Promise<ApiResponse<PayrollBatchEntity[]>> => {
    return apiClient<PayrollBatchEntity[]>('/api/v1/hr/payroll');
  },
};
