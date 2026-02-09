import apiClient from './apiClient';

// Article/Blog item in overview
export interface OverviewArticle {
  id: string;
  snippet?: {
    title?: string;
    cover_image_url?: string;
  };
  title?: string;
  cover_image_url?: string;
  excerpt?: string;
  author?: string;
  status?: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

// Doctor item in overview
export interface OverviewDoctor {
  id: string;
  full_name: string;
  profile_picture_url?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  bio?: string;
}

// Service item in overview
export interface OverviewService {
  id: string;
  snippet?: {
    service_name?: string;
    cover_image_url?: string;
    service_description?: string;
  };
  page?: {
    banner_image_url?: string;
    service_overview?: string;
    video_url?: string;
    conditions_we_treat?: string[];
    test_and_diagnostics?: string[];
    treatments_and_procedures?: string[];
  };
  created_at?: string;
  updated_at?: string;
  title?: string;
  image?: string;
  description?: string;
}

// Overview data structure
export interface OverviewData {
  articles: OverviewArticle[];
  doctors: OverviewDoctor[];
  services?: OverviewService[];
  activities?: any[];
}

// API Response for overview endpoint
export interface OverviewResponse {
  success: boolean;
  data: {
    overview: OverviewData;
  };
}

const overviewService = {
  getOverviewData: async () => {
    try {
      console.log('📊 [overviewService] Fetching overview data from /overview/');
      const response = await apiClient.get<OverviewResponse>('/overview/');
      
      console.log('📊 [overviewService] Full response:', response);
      console.log('📊 [overviewService] Response data:', response.data);
      console.log('📊 [overviewService] Overview object:', response.data?.data?.overview);
      
      if (response.data?.data?.overview) {
        const overview = response.data.data.overview;
        console.log('📊 [overviewService] Articles:', overview.articles);
        console.log('📊 [overviewService] Doctors:', overview.doctors);
        console.log('📊 [overviewService] Services:', overview.services);
        console.log('📊 [overviewService] Activities:', overview.activities);
        console.log('📊 [overviewService] Activities count:', overview.activities?.length);
        if (overview.activities && overview.activities.length > 0) {
          console.log('📊 [overviewService] First activity:', overview.activities[0]);
        }
      }
      
      // Validate response structure
      if (!response.data.success) {
        throw new Error('Overview data fetch failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ [overviewService] Error fetching overview:', error);
      throw error;
    }
  },
};

export default overviewService;
