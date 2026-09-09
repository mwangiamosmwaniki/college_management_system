import { apiClient, ApiResponse } from './client';

export interface ProcurementRequisitionEntity {
  id: string;
  institutionId: string;
  requisitionNumber: string;
  departmentId?: string;
  requestedBy: string;
  itemDescription: string;
  quantity: number;
  estimatedCost: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ORDERED';
  approvedBy?: string;
  createdAt: string;
}

export interface PurchaseOrderEntity {
  id: string;
  institutionId: string;
  poNumber: string;
  vendorName: string;
  vendorEmail?: string;
  requisitionId?: string;
  totalAmount: number;
  status: 'ISSUED' | 'DELIVERED' | 'PAID' | 'CANCELLED';
  createdAt: string;
}

export const procurementApi = {
  getRequisitions: async (): Promise<ApiResponse<ProcurementRequisitionEntity[]>> => {
    return apiClient<ProcurementRequisitionEntity[]>('/api/v1/procurement/requisitions');
  },

  createRequisition: async (requisition: Partial<ProcurementRequisitionEntity>): Promise<ApiResponse<ProcurementRequisitionEntity>> => {
    return apiClient<ProcurementRequisitionEntity>('/api/v1/procurement/requisitions', {
      method: 'POST',
      body: JSON.stringify(requisition),
    });
  },

  decideRequisition: async (id: string, status: 'APPROVED' | 'REJECTED'): Promise<ApiResponse<ProcurementRequisitionEntity>> => {
    return apiClient<ProcurementRequisitionEntity>(`/api/v1/procurement/requisitions/${id}/decision?status=${status}`, {
      method: 'PUT',
    });
  },

  getPurchaseOrders: async (): Promise<ApiResponse<PurchaseOrderEntity[]>> => {
    return apiClient<PurchaseOrderEntity[]>('/api/v1/procurement/orders');
  },

  issuePurchaseOrder: async (order: Partial<PurchaseOrderEntity>): Promise<ApiResponse<PurchaseOrderEntity>> => {
    return apiClient<PurchaseOrderEntity>('/api/v1/procurement/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  },
};
