import { Link } from 'react-router-dom';
import { useState } from 'react';
import NotFound from '../commonComponents/NotFound';
import Toast from '../GlobalComponents/Toast';
import { doctorService } from '../../services';
import { getErrorMessage } from '../../services';
import type { OverviewDoctor } from '../../services/overviewService';

interface DoctorsCardProps {
  doctors?: OverviewDoctor[];
  isLoading?: boolean;
  onDoctorDeleted?: (doctorId: string) => void;
}

export default function DoctorsCard({ doctors = [], isLoading = false, onDoctorDeleted }: DoctorsCardProps) {
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

  const handleDelete = async (doctor: OverviewDoctor) => {
    try {
      showToast('Deleting doctor...', 'loading');
      await doctorService.deleteDoctor(String(doctor.id));
      showToast(`${doctor.full_name} deleted successfully! ✅`, 'success');
      onDoctorDeleted?.(String(doctor.id));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast(errorMessage, 'error');
    }
  };
  const displayDoctors = doctors.slice(0, 5); // Show top 5 doctors

  if (isLoading) {
    return (
      <div className="bg-white rounded-[10px]">
        <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px] justify-between mb-4">
          <h3 className="font-medium text-[#010101] text-lg lg:text-[18px] leading-[140%]">Doctors</h3>
          <a href="/doctors" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
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
        <h3 className="font-medium text-[#010101] text-lg lg:text-[18px] leading-[140%]">Doctors</h3>
        <a href="/doctors" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {displayDoctors.length > 0 ? (
          displayDoctors.map(d => (
            <div key={d.id} className="flex items-center py-[12px] justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  {d.profile_picture_url ? (
                    <img src={d.profile_picture_url} alt={d.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium truncate">{d.full_name}</div>
              </div>

              <Link to={`/doctors/${d.id}`} className="px-3 py-2 border border-[#E3E6EE] rounded-md text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition flex-shrink-0">
                <img src="/icon/eye.svg" alt="view" /> <span>View Profile</span>
              </Link>

              <button 
                onClick={() => handleDelete(d)}
                className="px-[12px] py-[10px] text-[#EF4444] hover:bg-red-50 transition"
                title="Delete"
              >
                <img src="/icon/delete.svg" alt="Delete" />
              </button>
            </div>
          ))
        ) : (
          <NotFound
            title="No Doctors Yet"
            description="No doctors available at the moment."
            imageSrc="/not-found.png"
            ctaText="Add New Doctor"
            onCta={() => window.location.href = '/doctors'}
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
