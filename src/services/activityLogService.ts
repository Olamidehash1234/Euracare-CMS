import apiClient from './apiClient';

export interface ActivityLogResponse {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity: string;
  entityId?: string;
  description?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

const activityLogService = {
  // Get all activity logs
  getAllActivityLogs: (params?: { page?: number; limit?: number; userId?: string; action?: string; entity?: string }) =>
    apiClient.get<{ data: ActivityLogResponse[]; total: number }>('/activity-logs', { params }),

  // Get activity logs for specific user
  getUserActivityLogs: (userId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<{ data: ActivityLogResponse[]; total: number }>(`/activity-logs/user/${userId}`, { params }),

  // Get activity log by id
  getActivityLogById: (id: string) =>
    apiClient.get<{ data: ActivityLogResponse }>(`/activity-logs/${id}`),

  // Export activity logs
  exportActivityLogs: (params?: { format?: 'csv' | 'pdf'; filters?: any }) =>
    apiClient.get('/activity-logs/export', { params, responseType: 'blob' }),
};

export default activityLogService;
