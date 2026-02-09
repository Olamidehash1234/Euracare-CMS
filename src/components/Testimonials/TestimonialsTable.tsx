export interface TestimonialType {
  id: string | number;
  title: string;
  service: string;
  patientName: string;
  videoLink?: string;
}

interface TestimonialsTableProps {
  testimonials: TestimonialType[];
  onView?: (t: TestimonialType) => void;
  onEdit?: (t: TestimonialType) => void;
  onDelete?: (t: TestimonialType) => void;
}

export default function TestimonialsTable({ testimonials, onView, onEdit, onDelete }: TestimonialsTableProps) {
  return (
    <div className="overflow-x-auto w-full border-[0.3px] px-[24px] border-[#B9B9B9] rounded-[14px]">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-[14px] text-[#0C2141]">
            <th className="w-[40px] pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle">
              <span className="sr-only">Select rows</span>
            </th>
            <th className="w-[300px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Title</th>
            <th className="w-[200px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Service</th>
            <th className="w-[200px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Patient Name</th>
            <th className="w-[150px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id} className="border-t border-[#01010133]">
              <td className="w-[40px] py-[19px] align-middle"><input type="checkbox" /></td>
              <td className="w-[300px] py-[19px] px-4 align-middle">
                <div className="font-normal text-[14px] truncate">{t.title}</div>
              </td>
              <td className="w-[200px] py-[19px] px-4 align-middle text-[14px] text-[#010101]">{t.service}</td>
              <td className="w-[200px] py-[19px] px-4 align-middle text-[14px] text-[#010101]">{t.patientName}</td>
              <td className="w-[150px] py-[19px] px-4 align-middle text-center">
                <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                  {/* <button onClick={() => onView?.(t)} className="px-[12px] py-[10px] text-[#0C2141]" title="View">
                    <img src="/icon/eye.svg" alt="View" />
                  </button> */}

                  <button onClick={() => onEdit?.(t)} className="px-[12px] py-[10px] text-[#0C2141]" title="Edit">
                    <img src="/icon/edit.svg" alt="Edit" />
                  </button>

                  <button onClick={() => onDelete?.(t)} className="px-[12px] py-[10px] text-[#EF4444]" title="Delete">
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
