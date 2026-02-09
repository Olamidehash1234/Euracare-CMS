import apiClient from './apiClient';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  status?: string;
  role?: string;
  [key: string]: any;
}

const userService = {
  /**
   * Suspend a user by ID
   */
  suspendUser: (id: string) => {
    console.log('⏸️ [userService] Suspending user:', id);
    return apiClient.patch<{ success: boolean; data: UserResponse }>(`/users/${id}`, { status: 'suspended' })
      .then((response) => {
        console.log('✅ [userService] User suspended successfully:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ [userService] Error suspending user:', error.message);
        throw error;
      });
  },

  /**
   * Reactivate a user by ID
   */
  reactivateUser: (id: string) => {
    console.log('✅ [userService] Reactivating user:', id);
    return apiClient.patch<{ success: boolean; data: UserResponse }>(`/users/${id}/reactivate`)
      .then((response) => {
        console.log('✅ [userService] User reactivated successfully:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ [userService] Error reactivating user:', error.message);
        throw error;
      });
  },

  /**
   * Get user by ID
   */
  getUserById: (id: string) => {
    console.log('📋 [userService] Fetching user:', id);
    return apiClient.get<{ success: boolean; data: UserResponse }>(`/users/${id}/`)
      .then((response) => {
        console.log('✅ [userService] User fetched:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ [userService] Error fetching user:', error.message);
        throw error;
      });
  },
};

export default userService;
