import apiClient from './apiClient';

export interface TeamMemberPayload {
  name: string;
  position?: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export interface TeamMemberResponse {
  id: string;
  name: string;
  position?: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

const teamService = {
  // Get all team members
  getAllTeamMembers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: TeamMemberResponse[]; total: number }>('/team', { params }),

  // Get single team member
  getTeamMemberById: (id: string) =>
    apiClient.get<{ data: TeamMemberResponse }>(`/team/${id}`),

  // Create team member
  createTeamMember: (payload: TeamMemberPayload) =>
    apiClient.post<{ data: TeamMemberResponse }>('/team', payload),

  // Update team member
  updateTeamMember: (id: string, payload: Partial<TeamMemberPayload>) =>
    apiClient.put<{ data: TeamMemberResponse }>(`/team/${id}`, payload),

  // Delete team member
  deleteTeamMember: (id: string) =>
    apiClient.delete(`/team/${id}`),

  // Bulk delete team members
  bulkDeleteTeamMembers: (ids: string[]) =>
    apiClient.post('/team/bulk-delete', { ids }),
};

export default teamService;
