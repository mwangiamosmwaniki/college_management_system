import { apiClient, ApiResponse } from './client';
import { PageResponse } from './students';

export interface BookEntity {
  id: string;
  institutionId: string;
  isbn?: string;
  title: string;
  author: string;
  publisher?: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation?: string;
}

export interface BorrowRecordEntity {
  id: string;
  institutionId: string;
  copyId: string;
  userId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  fineAmount: number;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

export const libraryApi = {
  getBooks: async (page = 0, size = 20, search?: string): Promise<ApiResponse<PageResponse<BookEntity>>> => {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    return apiClient<PageResponse<BookEntity>>(`/api/v1/library/books?page=${page}&size=${size}${q}`);
  },

  addBook: async (book: Partial<BookEntity>): Promise<ApiResponse<BookEntity>> => {
    return apiClient<BookEntity>('/api/v1/library/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  },

  borrowBook: async (payload: { bookId: string; userId: string }): Promise<ApiResponse<BorrowRecordEntity>> => {
    return apiClient<BorrowRecordEntity>('/api/v1/library/borrow', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  returnBook: async (recordId: string): Promise<ApiResponse<BorrowRecordEntity>> => {
    return apiClient<BorrowRecordEntity>(`/api/v1/library/return/${recordId}`, {
      method: 'POST',
    });
  },

  getUserRecords: async (userId: string): Promise<ApiResponse<BorrowRecordEntity[]>> => {
    return apiClient<BorrowRecordEntity[]>(`/api/v1/library/records/user/${userId}`);
  },
};
