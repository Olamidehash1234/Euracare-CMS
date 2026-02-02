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
        setIsLoading(true);
        setError(null);

        const response = await overviewService.getOverviewData();

        if (response.success && response.data.overview) {
          const { articles: fetchedArticles, doctors: fetchedDoctors, services: fetchedServices, activities: fetchedActivities } = response.data.overview;

          setArticles(fetchedArticles || []);
          setDoctors(fetchedDoctors || []);
          setServices(fetchedServices || []);
          setActivities(fetchedActivities || []);
        } else {
          const errorMsg = 'Failed to fetch overview data - Invalid response structure';
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
        
        setError(errorMessage);
        setToast({
          show: true,
          type: 'error',
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Show error state
  if (error && !isLoading) {
    return (
      <div>
        <Header title="Overview" />
        <div className="p-[16px] lg:px-[40px] lg:mx-[40px] lg:my-[40px] rounded-[20px] border border-red-200 lg:py-[50px] flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="rounded-lg p-6 text-center">
            <img src="/not-found.png" alt="Error" className="mx-auto mb-4" />
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
