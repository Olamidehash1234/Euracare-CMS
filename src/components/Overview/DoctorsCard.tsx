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
  onDoctorEdit?: (doctor: OverviewDoctor) => void;
  onDoctorCreate?: () => void;
  onRefresh?: () => void;
}

export default function DoctorsCard({ doctors = [], isLoading = false, onDoctorDeleted, onDoctorEdit, onDoctorCreate, onRefresh }: DoctorsCardProps) {
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
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
      setLoadingItemId(String(doctor.id));
      showToast('Deleting doctor...', 'loading');
      await doctorService.deleteDoctor(String(doctor.id));
      showToast(`${doctor.full_name} deleted successfully!  `, 'success');
      onDoctorDeleted?.(String(doctor.id));

      // Refresh the doctors card after successful deletion
      setTimeout(() => onRefresh?.(), 500);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast(errorMessage, 'error');
    } finally {
      setLoadingItemId(null);
    }
  };
  const displayDoctors = doctors.slice(0, 5); // Show top 5 doctors

  if (isLoading) {
    return (
      <div className="bg-white rounded-[10px]">
        <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px] justify-between mb-4">
          <h3 className="font-medium text-[#010101] text-lg lg:text-[18px] leading-[140%]">Doctors</h3>
          <div className="flex items-center gap-3">
            <button onClick={onDoctorCreate} className="text-[14px] px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition">+ Add</button>
            <a href="/doctors" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
          </div>
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
        <div className="flex items-center gap-3">
          {/* <button onClick={onDoctorCreate} className="text-[14px] px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition">+ Add</button> */}
          <a href="/doctors" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
        </div>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {displayDoctors.length > 0 ? (
          displayDoctors.map(d => (
            <div key={d.id} className={`flex items-center py-[12px] justify-between gap-4 relative ${loadingItemId === String(d.id) ? 'opacity-60' : ''}`}>
              {loadingItemId === String(d.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-gray-600 font-medium">Processing...</span>
                  </div>
                </div>
              )}
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

              <Link to={`/doctors/${d.id}`} className="px-3 py-2 border border-[#E3E6EE] rounded-md text-sm inline-flex items-center gap-2 hover:bg-gray-50 transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed" onClick={(e) => loadingItemId !== null && e.preventDefault()}>
                <img src="/icon/eye.svg" alt="view" /> <span>View Profile</span>
              </Link>

              <div>
                <button
                  onClick={() => onDoctorEdit?.(d)}
                  disabled={loadingItemId !== null}
                  className="px-[12px] py-[10px] text-[#0C2141] hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit"
                >
                  <img src="/icon/edit.svg" alt="Edit" />
                </button>

                <button
                  onClick={() => handleDelete(d)}
                  disabled={loadingItemId !== null}
                  className="px-[12px] py-[10px] text-[#0C2141] hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  {loadingItemId === String(d.id) ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img src="/icon/delete.svg" alt="Delete" />
                  )}
                </button>
              </div>
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
