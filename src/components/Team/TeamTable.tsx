export interface TeamMember {
  id: string | number;
  name: string;
  avatar?: string;
  createdAt: string;
  role?: string;
  category?: string;
}

interface TeamTableProps {
  members: TeamMember[];
  onView?: (m: TeamMember) => void;
  onEdit?: (m: TeamMember) => void;
  onDelete?: (m: TeamMember) => void;
}

const fmt = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export default function TeamTable({ members, onView, onEdit, onDelete }: TeamTableProps) {
  return (
    <div className="overflow-x-auto w-full border-[0.3px] px-[24px] border-[#B9B9B9] rounded-[14px]">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-[14px] text-[#0C2141]">
            <th className="pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle"><span className="sr-only">Select rows</span></th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Name</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Date Created</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Role</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Category</th>
            <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-[#01010133]">
              <td className="py-[29px] align-middle"><input type="checkbox" /></td>
              <td className="py-[29px] pl-4 pr-0 align-middle">
                <div className="flex items-center gap-3">
                  <img src={m.avatar ? m.avatar : '/image/doctor/test.png'} alt={m.name} className="w-10 h-10 lg:w-[36px] lg:h-[36px] rounded-full object-cover" />
                  <div>
                    <div className="font-normal text-[14px]">{m.name}</div>
                  </div>
                </div>
              </td>
              <td className="py-[29px] px-4 text-[14px] align-middle">{fmt(m.createdAt)}</td>
              <td className="py-[29px] px-4 text-[14px] align-middle">{m.role ?? '-'}</td>
              <td className="py-[29px] px-4 text-[14px] align-middle">{m.category ?? '-'}</td>
              <td className="py-[29px] px-4 align-middle text-center">
                <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                  <button onClick={() => onView?.(m)} className="px-[12px] py-[10px] text-[#0C2141]" title="View">
                    <img src="/icon/eye.svg" alt="" />
                  </button>

                  <button onClick={() => onEdit?.(m)} className="px-[12px] py-[10px] text-[#0C2141]" title="Edit">
                    <img src="/icon/edit.svg" alt="" />
                  </button>

                  <button onClick={() => onDelete?.(m)} className="px-[12px] py-[10px] text-[#EF4444]" title="Delete">
                    <img src="/icon/delete.svg" alt="" />
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

export const sampleTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Dr. Hammed Ninalowo',
    avatar: '/image/doctor/test.png',
    createdAt: new Date().toISOString(),
    role: 'Managing Director',
    category: 'Board of Directors',
  },
  {
    id: 2,
    name: 'Dr. Tosin Majekodunmi',
    avatar: '/image/doctor/test.png',
    createdAt: new Date().toISOString(),
    role: 'Cardiology Lead',
    category: 'Our Team',
  },
  {
    id: 3,
    name: 'Dr. Owen Woghiren',
    avatar: '/image/doctor/test.png',
    createdAt: new Date().toISOString(),
    role: 'Head of Research',
    category: 'Board of Directors',
  },
];
