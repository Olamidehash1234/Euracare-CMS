import apiClient from './apiClient';
import websocketService from './websocketService';
import type { WebSocketNotification } from './websocketService';

export interface NotificationResponse {
  id: string;
  userId?: string;
  title?: string;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Backend API response format
export interface BackendNotification {
  id: string;
  module: string;
  action: string;
  created_at: string;
  updated_at: string;
}

// Export WebSocket notification type
export type { WebSocketNotification } from './websocketService';

const notificationService = {
  // Get all notifications from REST API
  getNotifications: async (params?: { page?: number; limit?: number }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('⚠️ [notificationService] No auth token found in localStorage. Make sure you are logged in.');
        return [];
      }
      
      console.log('📋 [notificationService] Fetching notifications from REST API...');
      console.log('📋 [notificationService] Token present:', !!token);
      const response = await apiClient.get<{ success: boolean; data: { notifications: BackendNotification[] } }>('/notification', { params });
      console.log('✅ [notificationService] Notifications fetched:', response.data?.data?.notifications?.length || 0);
      return response.data?.data?.notifications || [];
    } catch (err: any) {
      console.error('❌ [notificationService] Failed to fetch notifications:', err);
      
      // Log detailed error information
      if (err.response) {
        console.error('❌ [notificationService] Error Status:', err.response.status);
        console.error('❌ [notificationService] Error Message:', err.response.statusText);
        console.error('❌ [notificationService] Error Data:', err.response.data);
        console.error('❌ [notificationService] Error Headers:', err.response.headers);
      } else if (err.request) {
        console.error('❌ [notificationService] No response received:', err.request);
      } else {
        console.error('❌ [notificationService] Error message:', err.message);
      }
      
      throw err;
    }
  },

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

  /**
   * WebSocket methods
   */

  // Connect to WebSocket server for real-time notifications
  connectWebSocket: (token?: string) => {
    console.log('🔌 Connecting to notification WebSocket...');
    return websocketService.connect(token);
  },

  // Disconnect from WebSocket
  disconnectWebSocket: () => {
    console.log('🔌 Disconnecting from notification WebSocket...');
    websocketService.disconnect();
  },

  // Check if WebSocket is connected
  isWebSocketConnected: () => websocketService.isConnected(),

  // Get WebSocket status
  getWebSocketStatus: () => websocketService.getStatus(),

  // Send message through WebSocket
  sendWebSocketMessage: (message: any) => {
    console.log('📤 Sending WebSocket message:', message);
    websocketService.send(message);
  },

  // Subscribe to WebSocket messages
  onWebSocketMessage: (handler: (message: any) => void) => {
    return websocketService.onMessage(handler);
  },

  // Subscribe to connection changes
  onConnectionChange: (handler: (connected: boolean) => void) => {
    return websocketService.onConnectionChange(handler);
  },
};

export default notificationService;
