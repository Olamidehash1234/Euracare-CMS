import apiClient from './apiClient';
import { uploadToCloudinary } from './cloudinaryService';

export interface CreateDoctorPayload {
  full_name: string;
  email: string;
  profile_picture_url?: string;
  phone: string;
  language: string;
  reg_number?: string;
  years_of_experince?: string;
  bio?: string;
  programs_and_specialty?: string[];
  professional_association?: string | string[];
  research_interest?: string[];
  qualification?: string[];
  training_and_education?: string[];
  certification?: string[];
}

export interface DoctorResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  language?: string;
  bio?: string;
  profile_picture_url?: string;
  reg_number?: string;
  years_of_experince?: string;
  programs_and_specialty?: string[];
  professional_association?: string | string[];
  research_interest?: string[];
  qualification?: string[];
  training_and_education?: string[];
  certification?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const doctorService = {
  // Get all doctors
  getAllDoctors: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ data: DoctorResponse[]; total: number }>('/doctors', { params }),

  // Get single doctor
  getDoctorById: (id: string) =>
    apiClient.get<{ data: DoctorResponse }>(`/doctors/${id}`),

  // Create doctor
  createDoctor: (payload: CreateDoctorPayload) =>
    apiClient.post<{ data: DoctorResponse }>('/doctors/', payload),

  // Update doctor
  updateDoctor: async (id: string, payload: Partial<CreateDoctorPayload>) => {
    try {
      console.log('[DoctorService] Updating doctor with payload:', payload);
      const response = await apiClient.put<{ data: DoctorResponse }>(`/doctors/${id}`, payload);
      console.log('[DoctorService] Update successful:', response.data);
      return response;
    } catch (error: any) {
      console.error('[DoctorService] Update error status:', error.response?.status);
      console.error('[DoctorService] Update error message:', error.response?.data?.message || error.message);
      console.error('[DoctorService] Update error details:', error.response?.data);
      throw error;
    }
  },

  // Delete doctor
  deleteDoctor: (id: string) =>
    apiClient.delete(`/doctors/${id}`),

  // Bulk delete doctors
  bulkDeleteDoctors: (ids: string[]) =>
    apiClient.post('/doctors/bulk-delete', { ids }),

  // Upload doctor avatar to Cloudinary
  uploadDoctorAvatar: async (file: File): Promise<string> => {
    try {
      const response = await uploadToCloudinary(file, 'euracare/doctors');
      return response.secure_url;
    } catch (error) {
      console.error('[DoctorService] Avatar upload error:', error);
      throw error;
    }
  },

  // Create doctor with image upload
  createDoctorWithImage: async (
    payload: CreateDoctorPayload,
    imageFile?: File
  ): Promise<{ data: DoctorResponse }> => {
    try {
      // Upload image if provided
      if (imageFile) {
        const imageUrl = await doctorService.uploadDoctorAvatar(imageFile);
        payload.profile_picture_url = imageUrl;
      }

      // Create doctor with image URL
      const response = await doctorService.createDoctor(payload);
      return response.data;
    } catch (error) {
      console.error('[DoctorService] Create doctor with image error:', error);
      throw error;
    }
  },
};

export default doctorService;
