import apiClient from './apiClient';
import { uploadToCloudinary } from './cloudinaryService';

export interface CreateUserPayload {
  profile_picture_url?: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirm_password: string;
  notify_user: boolean;
}

export interface AdminResponse {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const adminService = {
  // Get all admins
  getAllAdmins: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: { users: AdminResponse[]; meta?: any } }>('/users/', { params }),

  // Get single admin
  getAdminById: (id: string) =>
    apiClient.get<{ data: AdminResponse }>(`/users/${id}`),

  // Create user (admin)
  createUser: (payload: CreateUserPayload) =>
    apiClient.post<{ data: AdminResponse }>('/users/', payload),

  // Update admin
  updateAdmin: (id: string, payload: Partial<CreateUserPayload>) =>
    apiClient.patch<{ data: AdminResponse }>(`/users/${id}`, payload),

  // Delete admin
  deleteAdmin: (id: string) =>
    apiClient.delete(`/users/${id}`),

  // Update admin password
  updatePassword: (id: string, password: string) =>
    apiClient.patch(`/users/${id}/password`, { password }),

  // Bulk delete admins
  bulkDeleteAdmins: (ids: string[]) =>
    apiClient.post('/users/bulk-delete', { ids }),

  // Upload admin avatar to Cloudinary
  uploadAdminAvatar: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/admins');
      return response.secure_url;
    } catch (error) {
      console.error('[AdminService] Avatar upload error:', error);
      throw error;
    }
  },
};

export default adminService;
