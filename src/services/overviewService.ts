import apiClient from './apiClient';

// Article/Blog item in overview
export interface OverviewArticle {
  id: string;
  title: string;
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
  title: string;
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
      console.log('[OverviewService] Fetching overview data from /overview/...');
      const response = await apiClient.get<OverviewResponse>('/overview/');
      
      console.log('[OverviewService] Response received:', response.status);
      console.log('[OverviewService] Response data:', response.data);
      
      // Validate response structure
      if (!response.data.success) {
        console.warn('[OverviewService] API returned success: false');
      }
      
      if (response.data.data?.overview) {
        const { articles, doctors, services, activities } = response.data.data.overview;
        console.log('[OverviewService] Data breakdown:');
        console.log(`  - Articles: ${articles?.length || 0} items`);
        console.log(`  - Doctors: ${doctors?.length || 0} items`);
        console.log(`  - Services: ${services?.length || 0} items`);
        console.log(`  - Activities: ${activities?.length || 0} items`);
      }
      
      return response.data;
    } catch (error) {
      console.error('[OverviewService] Error fetching overview data:', error);
      if (error instanceof Error) {
        console.error('[OverviewService] Error message:', error.message);
        console.error('[OverviewService] Error stack:', error.stack);
      }
      throw error;
    }
  },
};

export default overviewService;
