import apiClient from './apiClient';

export interface RolePayload {
  name: string;
  description?: string;
  permission?: {
    resources: Record<string, Record<string, boolean>>;
  };
  [key: string]: any;
}

export interface RoleResponse {
  id: string;
  name: string;
  description?: string;
  permission?: {
    resources: Record<string, Record<string, boolean>>;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionResponse {
  id: string;
  name: string;
  description?: string;
}

const roleService = {
  // Get all roles
  getAllRoles: (params?: { page?: number; limit?: number }) =>
    apiClient.get<{ data: { roles: RoleResponse[]; meta?: any } }>('/roles', { params }),

  // Get single role
  getRoleById: (id: string) =>
    apiClient.get<{ data: RoleResponse }>(`/roles/${id}`),

  // Create role
  createRole: (payload: RolePayload) =>
    apiClient.post<{ data: RoleResponse }>('/roles', payload),

  // Update role
  updateRole: (id: string, payload: Partial<RolePayload>) =>
    apiClient.put<{ data: RoleResponse }>(`/roles/${id}`, payload),

  // Delete role
  deleteRole: (id: string) =>
    apiClient.delete(`/roles/${id}`),

  // Get all permissions
  getAllPermissions: () =>
    apiClient.get<{ data: PermissionResponse[] }>('/permissions'),

  // Assign role to user
  assignRoleToUser: (userId: string, roleId: string) =>
    apiClient.post(`/users/${userId}/roles`, { roleId }),
};

export default roleService;
