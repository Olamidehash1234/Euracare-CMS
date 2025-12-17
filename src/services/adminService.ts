import apiClient from './apiClient';

export interface AdminPayload {
  name: string;
  email: string;
  password?: string;
  role?: string;
  permissions?: string[];
  [key: string]: any;
}

export interface AdminResponse {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const adminService = {
  // Get all admins
  getAllAdmins: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: AdminResponse[]; total: number }>('/admins', { params }),

  // Get single admin
  getAdminById: (id: string) =>
    apiClient.get<{ data: AdminResponse }>(`/admins/${id}`),

  // Create admin
  createAdmin: (payload: AdminPayload) =>
    apiClient.post<{ data: AdminResponse }>('/admins', payload),

  // Update admin
  updateAdmin: (id: string, payload: Partial<AdminPayload>) =>
    apiClient.put<{ data: AdminResponse }>(`/admins/${id}`, payload),

  // Delete admin
  deleteAdmin: (id: string) =>
    apiClient.delete(`/admins/${id}`),

  // Update admin password
  updatePassword: (id: string, password: string) =>
    apiClient.patch(`/admins/${id}/password`, { password }),

  // Bulk delete admins
  bulkDeleteAdmins: (ids: string[]) =>
    apiClient.post('/admins/bulk-delete', { ids }),
};

export default adminService;
