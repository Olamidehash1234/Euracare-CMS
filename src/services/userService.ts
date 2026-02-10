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
    return apiClient.patch<{ success: boolean; data: UserResponse }>(`/users/${id}/suspend`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  /**
   * Reactivate a user by ID
   */
  reactivateUser: (id: string) => {
    return apiClient.patch<{ success: boolean; data: UserResponse }>(`/users/${id}/reactivate`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  /**
   * Get user by ID
   */
  getUserById: (id: string) => {
    return apiClient.get<{ success: boolean; data: UserResponse }>(`/users/${id}/`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },
};

export default userService;
