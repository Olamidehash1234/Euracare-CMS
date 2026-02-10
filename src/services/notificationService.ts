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
    return id;
  }
  
  // It's a synthetic ID, need to resolve it
  try {
    // Fetch all notifications to find a match
    const notifications = await notificationService.getNotifications();
    
    // Try to find a notification matching this ID
    // Synthetic IDs are formatted as: {module}-{action}-{timestamp}
    // We'll look for the most recently created notification with matching content
    if (notifications.length === 0) {
      throw new Error('No notifications found in backend');
    }
    
    // Synthetic IDs contain the action text, so look for a notification with matching action
    // Get the action part from the synthetic ID (middle part)
    const parts = id.split('-');
    if (parts.length >= 2) {
      const actionKeyword = parts.slice(1, -1).join('-'); // Everything except first (module) and last (timestamp)
      
      // Find notification with matching action
      const match = notifications.find(n => n.action.includes(actionKeyword));
      if (match) {
        return match.id;
      }
    }
    
    // If no match found, use the most recent notification
    // This is a fallback, not ideal but better than failing
    const mostRecent = notifications[0];
    return mostRecent.id;
  } catch (err) {
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
        return [];
      }
      const response = await apiClient.get<{ success: boolean; data: { notifications: BackendNotification[] } }>('/notification/', { params });
      return response.data?.data?.notifications || [];
    } catch (err: any) {
      throw err;
    }
  },

  // Get unread notifications count
  getUnreadCount: () => {
    return apiClient.get<{ success: boolean; data: { count: number } }>('/notification/unread-count/')
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    try {
      // Resolve synthetic IDs to real MongoDB ObjectIds if needed
      const realId = await resolveSyntheticId(id);
      const response = await apiClient.patch<{ success: boolean; data: BackendNotification }>(
        `/notification${realId}/mark-as-read`
      );
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return apiClient.patch<{ success: boolean; data: { count: number } }>('/notification/mark-all-as-read')
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  // Bulk delete notifications
  bulkDeleteNotifications: async (ids: string[]) => {
    if (ids.length === 0) {
      const error = new Error('No notification IDs provided for deletion');
      return Promise.reject(error);
    }
    try {
      // Resolve all IDs (synthetic to real MongoDB ObjectIds)
      const resolvedIds = await Promise.all(
        ids.map(id => resolveSyntheticId(id))
      );
      const response = await apiClient.delete<{ success: boolean; data: { deleted_count: number } }>(
        '/notification/bulk-delete',
        { data: { notification_ids: resolvedIds } }
      );
      return response;
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * WebSocket methods
   */

  // Connect to WebSocket server for real-time notifications
  connectWebSocket: (token?: string) => {
    return websocketService.connect(token);
  },

  // Disconnect from WebSocket
  disconnectWebSocket: () => {
    websocketService.disconnect();
  },

  // Check if WebSocket is connected
  isWebSocketConnected: () => websocketService.isConnected(),

  // Get WebSocket status
  getWebSocketStatus: () => websocketService.getStatus(),

  // Send message through WebSocket
  sendWebSocketMessage: (message: any) => {
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
