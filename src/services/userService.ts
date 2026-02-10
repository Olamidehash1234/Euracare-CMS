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
    console.log('🔗 [userService] Calling endpoint: /users/' + id + '/suspend');
    return apiClient.patch<{ success: boolean; data: UserResponse }>(`/users/${id}/suspend`)
      .then((response) => {
        console.log('✅ [userService] User suspended successfully');
        console.log('📊 [userService] Response status from backend:', response.data.data?.status);
        console.log('📝 [userService] Full suspended user data:', response.data.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ [userService] Error suspending user:', error.message);
        console.error('❌ [userService] Error response:', error.response?.data);
        throw error;
      });
  },

  /**
   * Reactivate a user by ID
   */
  reactivateUser: (id: string) => {
    console.log('♻️ [userService] Reactivating user:', id);
    console.log('🔗 [userService] Calling endpoint: /users/' + id + '/reactivate');
    return apiClient.patch<{ success: boolean; data: UserResponse }>(`/users/${id}/reactivate`)
      .then((response) => {
        console.log('✅ [userService] User reactivated successfully');
        console.log('📊 [userService] Response status from backend:', response.data.data?.status);
        console.log('📝 [userService] Full reactivated user data:', response.data.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ [userService] Error reactivating user:', error.message);
        console.error('❌ [userService] Error response:', error.response?.data);
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
        console.log('  [userService] User fetched:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ [userService] Error fetching user:', error.message);
        throw error;
      });
  },
};

export default userService;
