import { useState } from 'react';
import NotFound from '../commonComponents/NotFound';
import Toast from '../GlobalComponents/Toast';
import { serviceService } from '../../services';
import { getErrorMessage } from '../../services';
import type { OverviewService } from '../../services/overviewService';

interface ServicesCardProps {
  services?: OverviewService[];
  isLoading?: boolean;
  onServiceDeleted?: (serviceId: string) => void;
  onServiceEdit?: (service: OverviewService) => void;
}

export default function ServicesCard({ services = [], isLoading = false, onServiceDeleted, onServiceEdit }: ServicesCardProps) {
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error' | 'loading'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleEdit = (service: OverviewService) => {
    onServiceEdit?.(service);
  };

  const handleDelete = async (service: OverviewService) => {
    try {
      showToast('Deleting service...', 'loading');
      await serviceService.deleteService(String(service.id));
      showToast(`Service deleted successfully! ✅`, 'success');
      onServiceDeleted?.(String(service.id));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast(errorMessage, 'error');
    }
  };
  const displayServices = services.slice(0, 5); // Show top 5 services

  if (isLoading) {
    return (
      <div className="bg-white rounded-[10px]">
        <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px] justify-between mb-4">
          <h3 className="font-semibold text-lg lg:text-[18px] leading-[140%]">Services</h3>
          <a href="/services" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
        </div>
        <div className="p-5 lg:px-[20px] space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px]">
      <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px] justify-between mb-4">
        <h3 className="font-semibold text-lg lg:text-[18px] leading-[140%]">Services</h3>
        <a href="/services" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {displayServices.length > 0 ? (
          displayServices.map(s => (
            <div key={s.id} className="flex items-center py-[12px] justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100">
                  {(s.page?.banner_image_url || s.snippet?.cover_image_url || s.image) ? (
                    <img src={s.page?.banner_image_url || s.snippet?.cover_image_url || s.image} alt={s.snippet?.service_name || s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium truncate">{s.snippet?.service_name || s.title || 'Untitled'}</div>
              </div>

              <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                {/* <button className="px-[12px] py-[10px] text-[#0C2141] hover:bg-gray-100 transition" title="View">
                  <img src="/icon/eye.svg" alt="View" />
                </button> */}

                <button onClick={() => handleEdit(s)} className="px-[12px] py-[10px] text-[#0C2141] hover:bg-gray-100 transition" title="Edit">
                  <img src="/icon/edit.svg" alt="Edit" />
                </button>

                <button onClick={() => handleDelete(s)} className="px-[12px] py-[10px] text-[#EF4444] hover:bg-red-50 transition" title="Delete">
                  <img src="/icon/delete.svg" alt="Delete" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <NotFound
            title="No Services Yet"
            description="No services available at the moment."
            imageSrc="/not-found.png"
            ctaText="Add New Service"
            onCta={() => window.location.href = '/services'}
          />
        )}
      </div>

      {/* Toast notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onHide={hideToast}
      />
    </div>
  );
}
