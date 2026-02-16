import apiClient from './apiClient';
import { uploadToCloudinary } from './cloudinaryService';

/**
 * Team Member creation payload
 * Matches the API endpoint requirements
 */
export interface CreateTeamMemberPayload {
  profile_picture_url?: string;
  full_name: string;
  role: string;
  category: string;
  bio?: string;
}

/**
 * Team Member response from API
 */
export interface TeamMemberResponse {
  id: string;
  profile_picture_url?: string;
  full_name: string;
  role: string;
  category: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

const teamService = {
  /**
   * Get all team members
   * @param params Query parameters for pagination and search
   */
  getAllTeamMembers: async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      const response = await apiClient.get<{ data: { team_members: TeamMemberResponse[]; meta?: any } }>('/teams', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get single team member by ID
   */
  getTeamMemberById: (id: string) => {
    return apiClient.get<{ data: TeamMemberResponse }>(`/teams/${id}`);
  },

  /**
   * Create a new team member with optional Cloudinary image upload
   * @param payload Team member data
   * @param imageFileOrUrl Optional image file to upload to Cloudinary or pre-uploaded URL
   */
  createTeamMember: async (payload: CreateTeamMemberPayload, imageFileOrUrl?: File | string): Promise<{ data: TeamMemberResponse }> => {
    try {
      let profilePictureUrl = payload.profile_picture_url;

      // Upload image to Cloudinary if provided as File
      if (imageFileOrUrl instanceof File) {
        try {
          const uploadResponse = await uploadToCloudinary(imageFileOrUrl, 'euracare/team');
          profilePictureUrl = uploadResponse.secure_url;
        } catch (error) {
          throw new Error('Failed to upload profile picture. Please try again.');
        }
      } else if (typeof imageFileOrUrl === 'string') {
        // Use pre-uploaded URL directly
        profilePictureUrl = imageFileOrUrl;
      }

      const teamMemberPayload = {
        ...payload,
        profile_picture_url: profilePictureUrl,
      };

      const response = await apiClient.post<{ data: TeamMemberResponse }>('/teams', teamMemberPayload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing team member
   * @param id Team member ID
   * @param payload Updated team member data
   * @param imageFileOrUrl Optional image file to upload to Cloudinary or pre-uploaded URL
   */
  updateTeamMember: async (id: string, payload: Partial<CreateTeamMemberPayload>, imageFileOrUrl?: File | string): Promise<{ data: TeamMemberResponse }> => {
    try {
      let updatedPayload: any = { ...payload };

      // Upload image to Cloudinary if provided as File
      if (imageFileOrUrl instanceof File) {
        try {
          const uploadResponse = await uploadToCloudinary(imageFileOrUrl, 'euracare/team');
          updatedPayload.profile_picture_url = uploadResponse.secure_url;
        } catch (error) {
          throw new Error('Failed to upload profile picture. Please try again.');
        }
      } else if (typeof imageFileOrUrl === 'string') {
        // Use pre-uploaded URL directly
        updatedPayload.profile_picture_url = imageFileOrUrl;
      }

      const response = await apiClient.put<{ data: TeamMemberResponse }>(`/teams/${id}`, updatedPayload);

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a team member
   */
  deleteTeamMember: (id: string) => {
    return apiClient.delete(`/teams/${id}`);
  },

  /**
   * Bulk delete team members
   */
  bulkDeleteTeamMembers: (ids: string[]) => {
    return apiClient.post('/teams/bulk-delete/', { ids });
  },

  /**
   * Upload team member avatar to Cloudinary
   * Helper method for direct avatar uploads
   */
  uploadTeamMemberAvatar: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/team');
      return response.secure_url;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Upload team member avatar to Cloudinary (alias for uploadTeamMemberAvatar)
   * @deprecated Use uploadTeamMemberAvatar instead
   */
  uploadTeamAvatar: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/team');
      return response.secure_url;
    } catch (error) {
      throw error;
    }
  },
};

export default teamService;
