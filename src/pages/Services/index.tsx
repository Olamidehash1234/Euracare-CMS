import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import ServicesTable from '../../components/Services/ServicesTable';
import type { ServiceType } from '../../components/Services/ServicesTable';
import CreateServiceForm from './CreateServiceForm';
import type { ServicePayload } from './CreateServiceForm';
import { serviceService } from '@/services';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import Toast from '@/components/GlobalComponents/Toast';

const ServicesPage = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });
  
  const [showCreate, setShowCreate] = useState(false);
  const [editService, setEditService] = useState<ServiceType | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    // Fetch services on mount
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await serviceService.getAllServices();
      const servicesList = response.data?.data?.services || [];
      setServices(servicesList.map((service: any) => ({
        id: service.id,
        title: service.snippet?.service_name || 'Untitled Service',
        image: service.snippet?.cover_image_url,
        publishedAt: service.createdAt || new Date().toISOString(),
      })));
    } catch (err) {
      console.error('Failed to fetch services:', err);
      showToast('Failed to load services', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServiceDetails = async (serviceId: string) => {
    try {
      console.log('[ServicesPage] Starting to fetch service details for ID:', serviceId);
      const response = await serviceService.getServiceById(serviceId);
      console.log('[ServicesPage] Full API response:', response);
      console.log('[ServicesPage] Response data:', response.data);
      console.log('[ServicesPage] Response data.data:', response.data?.data);
      
      // The actual service is nested under response.data.data.service
      const service = response.data?.data?.service;
      console.log('[ServicesPage] Extracted service data:', service);
      
      if (service) {
        console.log('[ServicesPage] Service snippet:', service.snippet);
        console.log('[ServicesPage] Service page:', service.page);
        
        const enrichedService: ServiceType = {
          id: service.id,
          title: service.snippet?.service_name || 'Untitled Service',
          image: service.snippet?.cover_image_url,
          publishedAt: service.createdAt || new Date().toISOString(),
          // Store full details for form preloading
          shortDescription: service.snippet?.service_description,
          overview: service.page?.service_overview,
          videoLink: service.page?.video_url,
          bannerImage: service.page?.banner_image_url,
          conditions: service.page?.conditions_we_treat,
          tests: service.page?.test_and_diagnostics,
          treatments: service.page?.treatments_and_procedures,
        };
        
        console.log('[ServicesPage] Enriched service object:', enrichedService);
        setEditService(enrichedService);
        console.log('[ServicesPage] Edit service state updated');
      } else {
        console.warn('[ServicesPage] No service data returned from API');
      }
    } catch (err) {
      console.error('[ServicesPage] Failed to fetch service details:', err);
      showToast('Failed to load service details', 'error');
    }
  };

  const handleEdit = (s: ServiceType) => {
    // Fetch full service details for edit mode
    console.log('[ServicesPage] handleEdit called with service:', s);
    console.log('[ServicesPage] Service ID being passed to fetchServiceDetails:', String(s.id));
    setEditService(s);
    setShowCreate(true);
    fetchServiceDetails(String(s.id));
  };

  const handleDelete = async (s: ServiceType) => {
    try {
      showToast('Deleting service...', 'loading');
      await serviceService.deleteService(String(s.id));
      setServices(prev => prev.filter(x => x.id !== s.id));
      showToast('Service deleted successfully! ✅', 'success');
    } catch (err) {
      console.error('Failed to delete service:', err);
      showToast('Failed to delete service', 'error');
    }
  };

  const handleSave = async (payload: ServicePayload) => {
    try {
      showToast(editService ? 'Updating service...' : 'Creating service...', 'loading');

      if (editService) {
        // Update existing service (the API call is already made in the form)
        setServices(prev => prev.map(s => s.id === editService.id ? { ...s, title: payload.title, image: payload.image } : s));
        showToast('Service updated successfully! ✅', 'success');
      } else {
        // Create new service (the API call is already made in the form)
        // Fetch the updated list to get the new service with proper ID
        await fetchServices();
        showToast('Service created successfully! ✅', 'success');
      }

      // Close form after delay
      setTimeout(() => {
        setShowCreate(false);
        setEditService(null);
        // Refetch services after save
        fetchServices();
      }, 1500);
    } catch (err) {
      console.error('Failed to save service:', err);
      showToast('Failed to save service', 'error');
    }
  };

  const hasServices = services.length > 0;

  if (isLoading) {
    return (
      <section>
        <Header title="Services" />
        <div className="p-[16px] lg:p-[40px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (showCreate || editService) {
    return (
      <section>
        <Header title="Services" />
        <div className="p-[16px] lg:p-[40px]">
          <CreateServiceForm
            mode={editService ? 'edit' : 'create'}
            initialData={editService ? {
              title: editService.title,
              shortDescription: editService.shortDescription,
              image: editService.image,
              publishedAt: editService.publishedAt,
              serviceId: String(editService.id),
              overview: editService.overview,
              videoLink: editService.videoLink,
              bannerImage: editService.bannerImage,
              conditions: editService.conditions,
              tests: editService.tests,
              treatments: editService.treatments,
            } : undefined}
            onSave={handleSave}
            onClose={() => {
              setShowCreate(false);
              setEditService(null);
            }}
          />
        </div>
        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            show={toast.show} 
            onHide={hideToast}
          />
        )}
      </section>
    );
  }

  return (
    <section>
      <Header title="Services" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button onClick={() => setShowCreate(true)} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Add New Service
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar placeholder="Search for a Service" />
            </div>
          </div>

          {hasServices ? (
            <ServicesTable
              services={services}
              // onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <NotFound
              title="No Service Yet"
              description={`It looks like you haven't added any services yet. Once added, they'll appear here for you to manage.`}
              imageSrc="/not-found.png"
              ctaText="Add New Service"
              onCta={() => setShowCreate(true)}
            />
          )}
        </div>
      </div>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          show={toast.show} 
          onHide={hideToast}
        />
      )}
    </section>
  );
};

export default ServicesPage;
