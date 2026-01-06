export interface BlogType {
  id: string | number;
  title: string;
  image?: string;
  publishedAt: string;
  category?: string; // <- added optional category
}

interface BlogsTableProps {
  blogs: BlogType[];
  onView?: (b: BlogType) => void;
  onEdit?: (b: BlogType) => void;
  onDelete?: (b: BlogType) => void;
}

const fmt = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export default function BlogsTable({ blogs, onView, onEdit, onDelete }: BlogsTableProps) {
  return (
    <div className="overflow-x-auto w-full border-[0.3px] px-[24px] border-[#B9B9B9] rounded-[14px]">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-[14px] text-[#0C2141]">
            <th className="w-[40px] pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle">
              <span className="sr-only">Select rows</span>
            </th>
            <th className="w-[100px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Image</th>
            <th className="w-[300px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Title</th>
            <th className="w-[200px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Category</th>
            <th className="w-[300px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Date Published</th>
            <th className="w-[150px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((b) => (
            <tr key={b.id} className="border-t border-[#01010133]">
              <td className="w-[40px] py-[19px] align-middle"><input type="checkbox" /></td>
              <td className="w-[100px] py-[19px] pl-4 pr-0 align-middle">
                <div className="w-12 h-12 rounded-[4px] overflow-hidden">
                  <img src={b.image ?? '/image/services/doctor.jpg'} alt={b.title} className="w-full h-full object-cover rounded-[4px]" />
                </div>
              </td>
              <td className="w-[300px] py-[19px] px-4 align-middle">
                <div className="font-normal text-[14px] truncate">{b.title}</div>
              </td>
              <td className="w-[200px] py-[19px] px-4 align-middle text-[14px] text-[#010101]">{b.category ?? '-'}</td>
              <td className="w-[200px] py-[19px] px-4 text-[14px] align-middle">{fmt(b.publishedAt)}</td>
              <td className="w-[150px] py-[19px] px-4 align-middle text-center">
                <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                  <button onClick={() => onView?.(b)} className="px-[12px] py-[10px] text-[#0C2141]" title="View">
                    <img src="/icon/eye.svg" alt="View" />
                  </button>

                  <button onClick={() => onEdit?.(b)} className="px-[12px] py-[10px] text-[#0C2141]" title="Edit">
                    <img src="/icon/edit.svg" alt="Edit" />
                  </button>

                  <button onClick={() => onDelete?.(b)} className="px-[12px] py-[10px] text-[#EF4444]" title="Delete">
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
