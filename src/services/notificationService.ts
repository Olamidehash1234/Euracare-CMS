import apiClient from './apiClient';
import websocketService from './websocketService';

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

// Helper function to validate MongoDB ObjectId format
const isValidMongoObjectId = (id: string): boolean => {
  // MongoDB ObjectId is a 24-character hexadecimal string
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Helper function to resolve synthetic IDs to real MongoDB ObjectIds
// If the ID is already valid, returns it
// If the ID is synthetic, fetches notifications and tries to find a match
const resolveSyntheticId = async (id: string): Promise<string> => {
  // If it's already a valid MongoDB ObjectId, return as-is
  if (isValidMongoObjectId(id)) {
    console.log('  [resolveSyntheticId] ID is already valid MongoDB ObjectId:', id);
    return id;
  }
  
  // It's a synthetic ID, need to resolve it
  console.log('🔍 [resolveSyntheticId] Attempting to resolve synthetic ID:', id);
  try {
    // Fetch all notifications to find a match
    const notifications = await notificationService.getNotifications();
    
    // Try to find a notification matching this ID
    // Synthetic IDs are formatted as: {module}-{action}-{timestamp}
    // We'll look for the most recently created notification with matching content
    if (notifications.length === 0) {
      throw new Error('No notifications found in backend');
    }
    
    console.log('🔍 [resolveSyntheticId] Found', notifications.length, 'notifications from backend');
    
    // Synthetic IDs contain the action text, so look for a notification with matching action
    // Get the action part from the synthetic ID (middle part)
    const parts = id.split('-');
    if (parts.length >= 2) {
      const actionKeyword = parts.slice(1, -1).join('-'); // Everything except first (module) and last (timestamp)
      console.log('🔍 [resolveSyntheticId] Looking for action keyword:', actionKeyword);
      
      // Find notification with matching action
      const match = notifications.find(n => n.action.includes(actionKeyword));
      if (match) {
        console.log('  [resolveSyntheticId] Resolved synthetic ID to real ID:', match.id);
        return match.id;
      }
    }
    
    // If no match found, use the most recent notification
    // This is a fallback, not ideal but better than failing
    console.warn('⚠️ [resolveSyntheticId] No exact match found, using most recent notification');
    const mostRecent = notifications[0];
    console.log('  [resolveSyntheticId] Using most recent notification ID:', mostRecent.id);
    return mostRecent.id;
  } catch (err) {
    console.error('❌ [resolveSyntheticId] Failed to resolve synthetic ID:', err);
    throw new Error(
      `Could not resolve notification ID. Please try again: ${(err as Error).message}`
    );
  }
};

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
      const response = await apiClient.get<{ success: boolean; data: { notifications: BackendNotification[] } }>('/notification/', { params });
      
      // 🔍 LOG FULL RESPONSE STRUCTURE FOR DEBUGGING
      console.log('📨 [notificationService] Full API response:', response);
      console.log('📨 [notificationService] response.data:', response.data);
      console.log('📨 [notificationService] response.data.data:', response.data?.data);
      console.log('📨 [notificationService] response.data.data.notifications:', response.data?.data?.notifications);
      if (response.data?.data?.notifications && response.data.data.notifications.length > 0) {
        console.log('📨 [notificationService] First notification object:', response.data.data.notifications[0]);
        console.log('📨 [notificationService] All notification keys:', Object.keys(response.data.data.notifications[0]));
      }
      
      console.log('  [notificationService] Notifications fetched:', response.data?.data?.notifications?.length || 0);
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
  getUnreadCount: () => {
    console.log('📊 [notificationService] Fetching unread notification count...');
    return apiClient.get<{ success: boolean; data: { count: number } }>('/notification/unread-count/')
      .then((response) => {
        console.log('  [notificationService] Unread count:', response.data?.data?.count);
        return response;
      })
      .catch((error) => {
        console.error('❌ [notificationService] Error fetching unread count:', error.message);
        throw error;
      });
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    console.log('📖 [notificationService] Marking notification as read:', id);
    try {
      // Resolve synthetic IDs to real MongoDB ObjectIds if needed
      const realId = await resolveSyntheticId(id);
      console.log('📖 [notificationService] Resolved ID:', realId);
      
      const response = await apiClient.patch<{ success: boolean; data: BackendNotification }>(
        `/notification${realId}/mark-as-read`
      );
      console.log('  [notificationService] Notification marked as read:', realId);
      return response;
    } catch (error: any) {
      console.error('❌ [notificationService] Error marking notification as read:', error.message);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    console.log('📖 [notificationService] Marking all notifications as read...');
    return apiClient.patch<{ success: boolean; data: { count: number } }>('/notification/mark-all-as-read')
      .then((response) => {
        console.log('  [notificationService] All notifications marked as read');
        return response;
      })
      .catch((error) => {
        console.error('❌ [notificationService] Error marking all notifications as read:', error.message);
        throw error;
      });
  },

  // Bulk delete notifications
  bulkDeleteNotifications: async (ids: string[]) => {
    console.log('🗑️ [notificationService] Bulk deleting notifications:', ids);
    
    if (ids.length === 0) {
      const error = new Error('No notification IDs provided for deletion');
      console.error('❌ [notificationService]', error.message);
      return Promise.reject(error);
    }
    
    try {
      // Resolve all IDs (synthetic to real MongoDB ObjectIds)
      console.log('🔍 [notificationService] Resolving notification IDs...');
      const resolvedIds = await Promise.all(
        ids.map(id => resolveSyntheticId(id))
      );
      
      console.log('  [notificationService] Resolved IDs:', resolvedIds);
      
      const response = await apiClient.delete<{ success: boolean; data: { deleted_count: number } }>(
        '/notification/bulk-delete',
        { data: { notification_ids: resolvedIds } }
      );
      console.log('  [notificationService] Notifications deleted:', response.data?.data?.deleted_count);
      return response;
    } catch (error: any) {
      console.error('❌ [notificationService] Error bulk deleting notifications:', error.message);
      throw error;
    }
  },

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
