import { useEffect, useState } from 'react';
import Header from "../../components/commonComponents/Header";
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import Toast from '../../components/GlobalComponents/Toast';
import ServicesCard from '../../components/Overview/ServicesCard';
import BlogCard from '../../components/Overview/BlogCard';
import DoctorsCard from '../../components/Overview/DoctorsCard';
import RecentActivityCard from '../../components/Overview/RecentActivityCard';
import overviewService from '../../services/overviewService';
import type { OverviewArticle, OverviewDoctor, OverviewService } from '../../services/overviewService';

interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'loading';
  message: string;
}

interface ActivityItem {
  id: string;
  icon?: string;
  title: string;
  subtitle?: string;
  time?: string;
}

const OverviewPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articles, setArticles] = useState<OverviewArticle[]>([]);
  const [doctors, setDoctors] = useState<OverviewDoctor[]>([]);
  const [services, setServices] = useState<OverviewService[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        console.log('[OverviewPage] Initiating data fetch...');
        setIsLoading(true);
        setError(null);

        const response = await overviewService.getOverviewData();

        console.log('[OverviewPage] API response received:', response);

        if (response.success && response.data.overview) {
          const { articles: fetchedArticles, doctors: fetchedDoctors, services: fetchedServices, activities: fetchedActivities } = response.data.overview;

          console.log('[OverviewPage] Successfully parsed overview data');
          console.log('[OverviewPage] Articles:', fetchedArticles);
          console.log('[OverviewPage] Doctors:', fetchedDoctors);
          console.log('[OverviewPage] Services:', fetchedServices);
          console.log('[OverviewPage] Activities:', fetchedActivities);

          setArticles(fetchedArticles || []);
          setDoctors(fetchedDoctors || []);
          setServices(fetchedServices || []);
          setActivities(fetchedActivities || []);

          console.log('[OverviewPage] State updated successfully');
        } else {
          const errorMsg = 'Failed to fetch overview data - Invalid response structure';
          console.error('[OverviewPage]', errorMsg);
          console.error('[OverviewPage] Response structure:', { success: response.success, hasOverview: !!response.data?.overview });
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
        console.error('[OverviewPage] Catch block - Error:', err);
        console.error('[OverviewPage] Error message:', errorMessage);
        console.error('[OverviewPage] Error type:', err instanceof Error ? err.constructor.name : typeof err);
        
        setError(errorMessage);
        setToast({
          show: true,
          type: 'error',
          message: errorMessage,
        });

        // Log error for debugging
        console.error('[OverviewPage] Data fetch failed:', err);
      } finally {
        setIsLoading(false);
        console.log('[OverviewPage] Data fetch completed');
      }
    };

    fetchOverviewData();
  }, []);

  // Show error state
  if (error && !isLoading) {
    return (
      <div>
        <Header title="Overview" />
        <div className="p-[16px] lg:px-[40px] lg:py-[50px]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Overview</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Overview" />
      <div className="p-[16px] lg:px-[40px] lg:py-[50px]">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[20px]">
            <ServicesCard services={services} isLoading={isLoading} />
            <BlogCard articles={articles} isLoading={isLoading} />
            <DoctorsCard doctors={doctors} isLoading={isLoading} />
            <RecentActivityCard activities={activities} isLoading={isLoading} />
          </div>
        )}
      </div>

      {/* Toast notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default OverviewPage;
