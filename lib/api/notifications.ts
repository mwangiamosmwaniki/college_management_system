import { apiClient, ApiResponse } from './client';

export interface NotificationEntity {
  id: string;
  institutionId: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getMyNotifications: async (): Promise<ApiResponse<NotificationEntity[]>> => {
    return apiClient<NotificationEntity[]>('/api/v1/notifications');
  },

  markAsRead: async (id: string): Promise<ApiResponse<NotificationEntity>> => {
    return apiClient<NotificationEntity>(`/api/v1/notifications/${id}/read`, {
      method: 'PUT',
    });
  },
};
