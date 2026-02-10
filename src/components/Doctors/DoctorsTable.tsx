import React, { useState } from 'react';
import MoreOptionsModal from './MoreOptionsModal';
import { Link } from 'react-router-dom';
import { formatTableDateTime } from '../../utils/dateFormatter';

export interface Doctor {
  id: string | number;
  name: string;
  avatar?: string;
  createdAt: string;
  email?: string;
  specialties?: string[];
}

interface DoctorsTableProps {
  doctors: Doctor[];
  onView?: (d: Doctor) => void;
  onEdit?: (d: Doctor) => void;
  onDelete?: (d: Doctor) => void;
}

const formatDate = (iso?: string) => {
  if (!iso) return '-';
  try {
    return formatTableDateTime(iso);
  } catch (e) {
    return iso;
  }
};

const DoctorsTable: React.FC<DoctorsTableProps> = ({ doctors, onEdit, onDelete }) => {
   const [activeMoreOptions, setActiveMoreOptions] = useState<{id: string | number; rect?: DOMRect} | null>(null);
   return (
    <div className="overflow-x-auto border-[0.3px] px-[24px] border-[#B9B9B9] rounded-[14px]">
      <table className="w-full text-left table-auto justify-between">
        <thead>
          <tr className="text-[14px] text-[#0C2141]">
            <th className="pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle"><span className="sr-only">Select rows</span></th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[230px]">Doctor's Name</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[190px]">Date Created</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[270px]">Email Address</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Specialties</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id} className="border-t border-[#01010133]">
              <td className="py-[29px] align-middle"><input type="checkbox" /></td>
              <td className="py-[29px] pl-4 pr-0 align-middle">
                <div className="flex items-center gap-3">
                  <img src={d.avatar ? d.avatar : '/placeholder-image.png'} alt={d.name} className="w-10 h-10 lg:w-[46px] lg:h-[46px] rounded-full object-cover" />
                  <div>
                    <div className="font-normal capitalize text-[13px]">{d.name}</div>
                  </div>
                </div>
              </td>
              <td className="py-[29px] px-4 text-[14px] align-middle">{formatDate(d.createdAt)}</td>
              <td className="py-[29px] px-4 text-[14px] align-middle">{d.email ?? '-'}</td>
              <td className="py-[29px] px-4 align-middle">
                <div className="text-[13px] capitalize max-w-[183px]">
                  {d.specialties?.join(', ') ?? '-'}
                </div>
              </td>
              <td className="py-[29px] px-4 align-middle text-center">
                <div className="flex items-center gap-3 lg:gap-[30px]">
                  <Link
                    to={`/doctors/${d.id}`}
                    className="px-3 py-2 border border-[#E3E3E3] rounded-[4px] text-[14px] flex items-center gap-2 inline-flex"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7z" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    <span>View Profile</span>
                  </Link>

                  <button 
                    className="p-2 relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setActiveMoreOptions(activeMoreOptions?.id === d.id ? null : { id: d.id, rect });
                    }}
                  >
                    <img src="/icon/more.svg" alt="More options" />
                    <MoreOptionsModal
                      isOpen={activeMoreOptions?.id === d.id}
                      onClose={() => setActiveMoreOptions(null)}
                      onEdit={() => {
                        onEdit?.(d);
                        setActiveMoreOptions(null);
                      }}
                      onDelete={() => {
                        onDelete?.(d);
                        setActiveMoreOptions(null);
                      }}
                      style={{
                        position: 'fixed',
                        top: (activeMoreOptions?.rect?.bottom ?? 0) + 8,
                        left: (activeMoreOptions?.rect?.left ?? 0) - 100,
                      }}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsTable;
