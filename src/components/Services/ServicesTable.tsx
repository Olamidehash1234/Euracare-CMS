export interface ServiceType {
  id: string | number;
  title: string;
  image?: string;
  publishedAt: string;
  shortDescription?: string;
  overview?: string;
  videoLink?: string;
  bannerImage?: string;
  conditions?: string[];
  tests?: string[];
  treatments?: string[];
}

interface ServicesTableProps {
  services: ServiceType[];
  onView?: (s: ServiceType) => void;
  onEdit?: (s: ServiceType) => void;
  onDelete?: (s: ServiceType) => void;
}

import { formatTableDateTime } from '../../utils/dateFormatter';

export default function ServicesTable({ services, onView, onEdit, onDelete }: ServicesTableProps) {
  return (
    <div className="overflow-x-auto w-full border-[0.3px] px-[24px] border-[#B9B9B9] rounded-[14px]">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-[14px] text-[#0C2141]">
            <th className="pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle"><span className="sr-only">Select rows</span></th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Image</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Service</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Date Published</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-t border-[#01010133]">
              <td className="py-[19px] align-middle"><input type="checkbox" /></td>
              <td className="py-[19px] pl-4 pr-0 align-middle">
                <div className="w-12 h-12 rounded-[4px] overflow-hidden">
                  <img src={s.image ?? '/image/services/doctor.jpg'} alt={s.title} className="w-full h-full object-cover rounded-[4px]" />
                </div>
              </td>
              <td className="py-[19px] px-4 align-middle">
                <div className="font-normal text-[14px]">{s.title}</div>
              </td>
              <td className="py-[19px] px-4 text-[14px] align-middle">{formatTableDateTime(s.publishedAt)}</td>
              <td className="py-[19px] px-4 align-middle text-center">
                <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                  <button onClick={() => onView?.(s)} className="px-[12px] py-[10px] text-[#0C2141]" title="View">
                    <img src="/icon/eye.svg" alt="View" />
                  </button>

                  <button onClick={() => onEdit?.(s)} className="px-[12px] py-[10px] text-[#0C2141]" title="Edit">
                    <img src="/icon/edit.svg" alt="Edit" />
                  </button>

                  <button onClick={() => onDelete?.(s)} className="px-[12px] py-[10px] text-[#EF4444]" title="Delete">
                    <img src="/icon/delete.svg" alt="Delete" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
