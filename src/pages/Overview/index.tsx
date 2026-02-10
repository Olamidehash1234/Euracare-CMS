import { useEffect, useState } from 'react';
import Header from "../../components/commonComponents/Header";
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import Toast from '../../components/GlobalComponents/Toast';
import ServicesCard from '../../components/Overview/ServicesCard';
import BlogCard from '../../components/Overview/BlogCard';
import DoctorsCard from '../../components/Overview/DoctorsCard';
import RecentActivityCard from '../../components/Overview/RecentActivityCard';
import overviewService from '../../services/overviewService';
import { doctorService, serviceService, blogService } from '../../services';
import type { OverviewArticle, OverviewDoctor, OverviewService } from '../../services/overviewService';
import DoctorForm from '../Doctors/CreateDoctorForm';
import type { NewDoctorPayload } from '../Doctors/CreateDoctorForm';
import CreateServiceForm from '../Services/CreateServiceForm';
import type { ServicePayload } from '../Services/CreateServiceForm';
import CreateBlogForm from '../Blogs/CreateBlogForm';
import type { BlogPayload } from '../Blogs/CreateBlogForm';

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

  // Doctor form state
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<NewDoctorPayload | null>(null);
  const [isFetchingDoctor, setIsFetchingDoctor] = useState(false);

  // Service form state
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<ServicePayload | null>(null);
  const [isFetchingService, setIsFetchingService] = useState(false);

  // Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPayload | null>(null);
  const [isFetchingBlog, setIsFetchingBlog] = useState(false);

  // Function to refresh specific card data
  const refreshCardData = async (cardType: 'services' | 'articles' | 'doctors' | 'audit') => {
    try {
      const response = await overviewService.getOverviewData();
      if (response.success && response.data.overview) {
        const overview = response.data.overview;
        
        if (cardType === 'services' && overview.services) {
          setServices(overview.services);
          // console.log('🔄 [OverviewPage] Services card refreshed');
        } else if (cardType === 'articles' && overview.articles) {
          setArticles(overview.articles);
          // console.log('🔄 [OverviewPage] Articles card refreshed');
        } else if (cardType === 'doctors' && overview.doctors) {
          setDoctors(overview.doctors);
          // console.log('🔄 [OverviewPage] Doctors card refreshed');
        } else if (cardType === 'audit' && overview.audit) {
          const transformedActivities = (overview.audit || []).map((audit: any) => ({
            id: audit.id,
            title: audit.details || 'Activity',
            subtitle: audit.action_type,
            time: audit.created_at,
          }));
          setActivities(transformedActivities);
          // console.log('🔄 [OverviewPage] Activities card refreshed');
        }
      }
    } catch (err) {
      // console.error(`❌ [OverviewPage] Error refreshing ${cardType} card:`, err);
    }
  };

  // Handle doctor edit
  const handleEditDoctor = async (doctor: OverviewDoctor) => {
    try {
      setIsFetchingDoctor(true);
      setToast({
        show: true,
        type: 'loading',
        message: 'Loading doctor details...',
      });
      
      // Fetch full doctor data
      const response = await doctorService.getDoctorById(doctor.id.toString());
      const fullDoctor = (response.data?.data as any)?.doctor || response.data?.data;
      
      if (fullDoctor) {
        const editData: NewDoctorPayload = {
          fullName: fullDoctor.full_name,
          email: fullDoctor.email || '',
          phone: fullDoctor.phone || '',
          languages: fullDoctor.language || '',
          regNumber: fullDoctor.reg_number || '',
          yearsExperience: fullDoctor.years_of_experince || '',
          bio: fullDoctor.bio || '',
          avatar: fullDoctor.profile_picture_url,
          programs: fullDoctor.programs_and_specialty || [],
          researchInterests: fullDoctor.research_interest || [],
          qualifications: fullDoctor.qualification || [],
          trainings: fullDoctor.training_and_education || [],
          associations: Array.isArray(fullDoctor.professional_association) 
            ? fullDoctor.professional_association 
            : (fullDoctor.professional_association ? [fullDoctor.professional_association] : []),
          certifications: fullDoctor.certification || [],
          doctorId: doctor.id.toString()
        };
        setEditingDoctor(editData);
        setShowDoctorForm(true);
        setToast({
          show: false,
          type: 'loading',
          message: '',
        });
      }
    } catch (err) {
      setToast({
        show: true,
        type: 'error',
        message: 'Failed to load doctor details',
      });
    } finally {
      setIsFetchingDoctor(false);
    }
  };

  // Handle doctor form save
  const handleDoctorFormSave = () => {
    setShowDoctorForm(false);
    setEditingDoctor(null);
    // Refresh the doctors card
    refreshCardData('doctors');
  };
  // Service/Blog handlers implemented later in file (deduplicated)
  const handleEditService = async (service: OverviewService) => {
    try {
      setIsFetchingService(true);
      setToast({
        show: true,
        type: 'loading',
        message: 'Loading service details...',
      });

      // Fetch full service data
      const response = await serviceService.getServiceById(service.id.toString());
      const fullService = (response.data?.data as any)?.service || response.data?.data;

      if (fullService) {
        const editData: ServicePayload = {
          title: fullService.snippet?.service_name || '',
          shortDescription: fullService.snippet?.service_description || '',
          image: fullService.snippet?.cover_image_url,
          bannerImage: fullService.page?.banner_image_url,
          overview: fullService.page?.service_overview || '',
          conditions: fullService.page?.conditions_we_treat || [],
          tests: fullService.page?.test_and_diagnostics || [],
          treatments: fullService.page?.treatments_and_procedures || [],
          videoLink: fullService.page?.video_url || '',
          serviceId: service.id.toString(),
        };
        setEditingService(editData);
        setShowServiceForm(true);
        setToast({
          show: false,
          type: 'loading',
          message: '',
        });
      }
    } catch (err) {
      setToast({
        show: true,
        type: 'error',
        message: 'Failed to load service details',
      });
    } finally {
      setIsFetchingService(false);
    }
  };

  // Handle service form save
  const handleServiceFormSave = () => {
    setShowServiceForm(false);
    setEditingService(null);
    // Refresh the services card
    refreshCardData('services');
  };

  // Handle blog edit
  const handleEditBlog = async (blog: OverviewArticle) => {
    try {
      setIsFetchingBlog(true);
      setToast({
        show: true,
        type: 'loading',
        message: 'Loading blog details...',
      });

      // Fetch full blog data
      const response = await blogService.getBlogById(blog.id.toString());
      const fullBlog: any = (response.data?.data as any)?.article || response.data?.data || response.data;

      if (fullBlog) {
        const fb: any = fullBlog;
        const editData: any = {
          blogId: blog.id.toString(),
          snippet: {
            title: fb.snippet?.title || fb.title || '',
            cover_image_url: fb.snippet?.cover_image_url || fb.image || '',
          },
          page: {
            content: {
              additionalProp1: fb.page?.content?.additionalProp1 || fb.content || '',
            },
            video_link_url: fb.page?.video_link_url || fb.video_link_url || '',
            category: fb.page?.category || fb.category || '',
          },
          video_link_url: fb.page?.video_link_url || fb.video_link_url || '',
        };
        setEditingBlog(editData as BlogPayload);
        setShowBlogForm(true);
        setToast({
          show: false,
          type: 'loading',
          message: '',
        });
      }
    } catch (err) {
      setToast({
        show: true,
        type: 'error',
        message: 'Failed to load blog details',
      });
    } finally {
      setIsFetchingBlog(false);
    }
  };

  // Handle blog form save
  const handleBlogFormSave = () => {
    setShowBlogForm(false);
    setEditingBlog(null);
    // Refresh the articles card
    refreshCardData('articles');
  };

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // console.log('👁️ [OverviewPage] Starting to fetch overview data...');
        const response = await overviewService.getOverviewData();
        // console.log('👁️ [OverviewPage] Received response:', response);
        // console.log('👁️ [OverviewPage] Response.success:', response.success);
        // console.log('👁️ [OverviewPage] Response.data:', response.data);
        // console.log('👁️ [OverviewPage] Response.data.overview:', response.data?.overview);

        if (response.success && response.data.overview) {
          const overview = response.data.overview;
          // console.log('👁️ [OverviewPage] Overview object destructured:', overview);
          
          const { articles: fetchedArticles, doctors: fetchedDoctors, services: fetchedServices, audit: fetchedAudit } = overview;
          
          // console.log('👁️ [OverviewPage] Fetched articles:', fetchedArticles);
          // console.log('👁️ [OverviewPage] Fetched doctors:', fetchedDoctors);
          // console.log('👁️ [OverviewPage] Fetched services:', fetchedServices);
          // console.log('👁️ [OverviewPage] Fetched audit data:', fetchedAudit);
          // console.log('👁️ [OverviewPage] Audit count:', fetchedAudit?.length);
          
          // Transform audit data to ActivityItem format
          const transformedActivities = (fetchedAudit || []).map((audit: any) => ({
            id: audit.id,
            title: audit.details || 'Activity',
            subtitle: audit.action_type,
            time: audit.created_at,
          }));
          
          // if (transformedActivities.length > 0) {
          //   console.log('👁️ [OverviewPage] Transformed Activity 1:', transformedActivities[0]);
          // }

          setArticles(fetchedArticles || []);
          setDoctors(fetchedDoctors || []);
          setServices(fetchedServices || []);
          setActivities(transformedActivities);
          
          // console.log('👁️ [OverviewPage] States set successfully');
        } else {
          const errorMsg = 'Failed to fetch overview data - Invalid response structure';
          // console.error('👁️ [OverviewPage] Invalid response structure:', { success: response.success, hasOverview: !!response.data?.overview });
          throw new Error(errorMsg);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching data';
        // console.error('👁️ [OverviewPage] Error caught:', err);
        // console.error('👁️ [OverviewPage] Error message:', errorMessage);
        
        setError(errorMessage);
        setToast({
          show: true,
          type: 'error',
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
        // console.log('👁️ [OverviewPage] Loading complete');
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
        ) : showDoctorForm ? (
          <div>
            <DoctorForm
              mode={editingDoctor ? 'edit' : 'create'}
              initialData={editingDoctor || undefined}
              isLoadingData={isFetchingDoctor}
              onSave={handleDoctorFormSave}
              onClose={() => {
                setShowDoctorForm(false);
                setEditingDoctor(null);
              }}
            />
          </div>
        ) : showServiceForm ? (
          <div>
            <CreateServiceForm
              mode={editingService ? 'edit' : 'create'}
              initialData={editingService || undefined}
              isLoading={isFetchingService}
              onSave={handleServiceFormSave}
              onClose={() => {
                setShowServiceForm(false);
                setEditingService(null);
              }}
            />
          </div>
        ) : showBlogForm ? (
          <div>
            <CreateBlogForm
              mode={editingBlog ? 'edit' : 'create'}
              initialData={editingBlog || undefined}
              isLoadingData={isFetchingBlog}
              onSave={handleBlogFormSave}
              onClose={() => {
                setShowBlogForm(false);
                setEditingBlog(null);
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-[20px]">
            <ServicesCard 
              services={services} 
              isLoading={isLoading}
              onServiceEdit={handleEditService}
              onServiceCreate={() => setShowServiceForm(true)}
              onRefresh={() => refreshCardData('services')} 
            />
            <BlogCard 
              articles={articles} 
              isLoading={isLoading}
              onBlogEdit={handleEditBlog}
              onBlogCreate={() => setShowBlogForm(true)}
              onRefresh={() => refreshCardData('articles')} 
            />
            <DoctorsCard 
              doctors={doctors} 
              isLoading={isLoading} 
              onDoctorEdit={handleEditDoctor}
              onDoctorCreate={() => setShowDoctorForm(true)}
              onRefresh={() => refreshCardData('doctors')} 
            />
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
