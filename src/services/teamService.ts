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
      console.log('[TeamService] Fetching all team members', { params });
      const startTime = performance.now();
      
      const response = await apiClient.get<{ data: { team_members: TeamMemberResponse[]; meta?: any } }>('/teams/', { params });
      
      const endTime = performance.now();
      console.log('[TeamService] Fetch completed in', (endTime - startTime).toFixed(2), 'ms');
      console.log('[TeamService] Response status:', response.status);
      console.log('[TeamService] Response headers:', response.headers);
      
      if (response.data?.data?.team_members) {
        const count = response.data.data.team_members.length;
        console.log('[TeamService] Retrieved', count, 'team members');
        console.log('[TeamService] Team members data:', response.data.data.team_members);
        
        if (response.data.data.meta) {
          console.log('[TeamService] Pagination metadata:', response.data.data.meta);
        }
      }
      
      return response;
    } catch (error) {
      console.error('[TeamService] Error fetching all team members:', error);
      if (error instanceof Error) {
        console.error('[TeamService] Error message:', error.message);
        console.error('[TeamService] Error stack:', error.stack);
      }
      throw error;
    }
  },

  /**
   * Get single team member by ID
   */
  getTeamMemberById: (id: string) => {
    console.log('[TeamService] Fetching team member:', id);
    return apiClient.get<{ data: TeamMemberResponse }>(`/teams/${id}/`);
  },

  /**
   * Create a new team member with optional Cloudinary image upload
   * @param payload Team member data
   * @param imageFileOrUrl Optional image file to upload to Cloudinary or pre-uploaded URL
   */
  createTeamMember: async (payload: CreateTeamMemberPayload, imageFileOrUrl?: File | string): Promise<{ data: TeamMemberResponse }> => {
    try {
      console.log('[TeamService] Creating team member', { payload, hasImage: !!imageFileOrUrl });

      let profilePictureUrl = payload.profile_picture_url;

      // Upload image to Cloudinary if provided as File
      if (imageFileOrUrl instanceof File) {
        try {
          console.log('[TeamService] Uploading profile picture to Cloudinary...');
          const uploadResponse = await uploadToCloudinary(imageFileOrUrl, 'euracare/team');
          profilePictureUrl = uploadResponse.secure_url;
          console.log('[TeamService] Image uploaded successfully:', profilePictureUrl);
        } catch (error) {
          console.error('[TeamService] Image upload failed:', error);
          throw new Error('Failed to upload profile picture. Please try again.');
        }
      } else if (typeof imageFileOrUrl === 'string') {
        // Use pre-uploaded URL directly
        profilePictureUrl = imageFileOrUrl;
        console.log('[TeamService] Using pre-uploaded avatar URL:', profilePictureUrl);
      }

      const teamMemberPayload = {
        ...payload,
        profile_picture_url: profilePictureUrl,
      };

      console.log('[TeamService] Sending create request with payload:', teamMemberPayload);
      const response = await apiClient.post<{ data: TeamMemberResponse }>('/teams/', teamMemberPayload);

      console.log('[TeamService] Team member created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('[TeamService] Error creating team member:', error);
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
      console.log('[TeamService] Updating team member:', id, { payload, hasImage: !!imageFileOrUrl });

      let updatedPayload: any = { ...payload };

      // Upload image to Cloudinary if provided as File
      if (imageFileOrUrl instanceof File) {
        try {
          console.log('[TeamService] Uploading new profile picture to Cloudinary...');
          const uploadResponse = await uploadToCloudinary(imageFileOrUrl, 'euracare/team');
          updatedPayload.profile_picture_url = uploadResponse.secure_url;
          console.log('[TeamService] Image uploaded successfully:', updatedPayload.profile_picture_url);
        } catch (error) {
          console.error('[TeamService] Image upload failed:', error);
          throw new Error('Failed to upload profile picture. Please try again.');
        }
      } else if (typeof imageFileOrUrl === 'string') {
        // Use pre-uploaded URL directly
        updatedPayload.profile_picture_url = imageFileOrUrl;
        console.log('[TeamService] Using pre-uploaded avatar URL:', imageFileOrUrl);
      }

      console.log('[TeamService] Sending update request with payload:', updatedPayload);
      const response = await apiClient.put<{ data: TeamMemberResponse }>(`/teams/${id}`, updatedPayload);

      console.log('[TeamService] Team member updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('[TeamService] Error updating team member:', error);
      throw error;
    }
  },

  /**
   * Delete a team member
   */
  deleteTeamMember: (id: string) => {
    console.log('[TeamService] Deleting team member:', id);
    return apiClient.delete(`/teams/${id}`);
  },

  /**
   * Bulk delete team members
   */
  bulkDeleteTeamMembers: (ids: string[]) => {
    console.log('[TeamService] Bulk deleting team members:', ids);
    return apiClient.post('/teams/bulk-delete/', { ids });
  },

  /**
   * Upload team member avatar to Cloudinary
   * Helper method for direct avatar uploads
   */
  uploadTeamMemberAvatar: async (file: File): Promise<string> => {
    try {
      console.log('[TeamService] Uploading team member avatar...');
      const response = await uploadToCloudinary(file, 'euracare/team');
      console.log('[TeamService] Avatar uploaded successfully');
      return response.secure_url;
    } catch (error) {
      console.error('[TeamService] Avatar upload error:', error);
      throw error;
    }
  },

  /**
   * Upload team member avatar to Cloudinary (alias for uploadTeamMemberAvatar)
   * @deprecated Use uploadTeamMemberAvatar instead
   */
  uploadTeamAvatar: async (file: File): Promise<string> => {
    try {
      console.log('[TeamService] Uploading team avatar...');
      const response = await uploadToCloudinary(file, 'euracare/team');
      console.log('[TeamService] Avatar uploaded successfully');
      return response.secure_url;
    } catch (error) {
      console.error('[TeamService] Avatar upload error:', error);
      throw error;
    }
  },
};

export default teamService;
