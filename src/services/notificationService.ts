import apiClient from './apiClient';

export interface NotificationResponse {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  updatedAt?: string;
}

const notificationService = {
  // Get all notifications for current user
  getNotifications: (params?: { page?: number; limit?: number; read?: boolean }) =>
    apiClient.get<{ data: NotificationResponse[]; total: number }>('/notifications', { params }),

  // Get unread notifications count
  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread/count'),

  // Mark notification as read
  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all'),

  // Delete notification
  deleteNotification: (id: string) =>
    apiClient.delete(`/notifications/${id}`),

  // Delete all notifications
  deleteAllNotifications: () =>
    apiClient.delete('/notifications/all'),
};

export default notificationService;
