import { apiClient, ApiResponse } from './client';
import { PageResponse } from './students';

export interface InvoiceEntity {
  id: string;
  institutionId: string;
  invoiceNumber: string;
  studentId: string;
  academicTermId: string;
  title: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'CANCELLED';
  dueDate?: string;
}

export interface PaymentEntity {
  id: string;
  institutionId: string;
  studentId: string;
  invoiceId?: string;
  receiptNumber: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  status: string;
  createdAt: string;
}

export interface MpesaTransactionDto {
  id: string;
  merchantRequestId: string;
  checkoutRequestId: string;
  phoneNumber: string;
  amount: number;
  status: string;
}

export const financeApi = {
  getInvoices: async (page = 0, size = 20): Promise<ApiResponse<PageResponse<InvoiceEntity>>> => {
    return apiClient<PageResponse<InvoiceEntity>>(`/api/v1/finance/invoices?page=${page}&size=${size}`);
  },

  getStudentInvoices: async (studentId: string): Promise<ApiResponse<InvoiceEntity[]>> => {
    return apiClient<InvoiceEntity[]>(`/api/v1/finance/invoices/student/${studentId}`);
  },

  getStudentPayments: async (studentId: string): Promise<ApiResponse<PaymentEntity[]>> => {
    return apiClient<PaymentEntity[]>(`/api/v1/finance/payments/student/${studentId}`);
  },

  initiateMpesaStkPush: async (payload: {
    studentId: string;
    invoiceId?: string;
    phoneNumber: string;
    amount: number;
    accountReference?: string;
  }): Promise<ApiResponse<MpesaTransactionDto>> => {
    return apiClient<MpesaTransactionDto>('/api/v1/finance/payments/mpesa/stk-push', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  runReconciliation: async (): Promise<ApiResponse<any>> => {
    return apiClient<any>('/api/v1/finance/reconciliation/run', {
      method: 'POST',
    });
  },

  getReconciliationReport: async (): Promise<ApiResponse<any>> => {
    return apiClient<any>('/api/v1/finance/reconciliation/report');
  },
};
