export interface AdminType {
  id: string | number;
  name: string;
  avatar?: string;
  dateCreated: string;
  email: string;
  role: string;
  active?: string; // last active / human readable
  status?: 'Active' | 'Suspended'; // account status
}

interface AdminTableProps {
  admins: AdminType[];
  onView?: (b: AdminType) => void;
  onEdit?: (b: AdminType) => void;
  onDelete?: (b: AdminType) => void;
}

const fmt = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export default function AdminTable({ admins, onEdit, onDelete }: AdminTableProps) {
  return (
    <div className="overflow-x-auto w-full border-[0.3px] px-[24px] border-[#B9B9B9] rounded-[14px]">
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="text-[14px] text-[#0C2141]">
            <th className="w-[40px] pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle">
              <span className="sr-only">Select rows</span>
            </th>
            <th className="w-[250px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Full Name</th>
            <th className="w-[200px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Date Created</th>
            <th className="w-[230px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Email Address</th>
            <th className="w-[150px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Role</th>
            <th className="w-[150px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-t border-[#01010133]">
              <td className="w-[40px] py-[19px] align-middle"><input type="checkbox" /></td>
              <td className="w-[250px] py-[19px] pl-4 pr-0 align-middle">
                <div className="w-[250px] flex items-center gap-3"> 
                  <img src={admin.avatar ? admin.avatar : '/placeholder-image.png'} alt="" className="w-10 h-10 lg:w-[44px] lg:h-[44px] rounded-full" />
                  <span className="font-normal text-[14px]">{admin.name}</span>
                </div>
              </td>
              <td className="w-[200px] py-[19px] px-4 align-middle text-[14px]">{fmt(admin.dateCreated)}</td>
              <td className="w-[230px] py-[19px] px-4 align-middle text-[14px]">{admin.email}</td>
              <td className="w-[150px] py-[19px] px-4 align-middle text-[14px]">
                <span className={`inline-flex py-1 rounded-full text-[14px] ${
                  admin.role === 'Super Admin' ? '' : ''
                }`}>
                  {admin.role}
                </span>
              </td>
              <td className="w-[150px] py-[19px] px-4 align-middle text-center">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                    {/* <button onClick={() => onView?.(admin)} className="px-[12px] py-[10px] text-[#0C2141]" title="View">
                      <img src="/icon/eye.svg" alt="View" />
                    </button> */}
                    <button onClick={() => onEdit?.(admin)} className="px-[12px] py-[10px] text-[#0C2141]" title="Edit">
                      <img src="/icon/edit.svg" alt="Edit" />
                    </button>
                    <button onClick={() => onDelete?.(admin)} className="px-[12px] py-[10px] text-[#EF4444]" title="Delete">
                      <img src="/icon/delete.svg" alt="Delete" />
                    </button>
                  </div>
                  {/* <button className="p-2">
                    <img src="/icon/more.svg" alt="More options" />
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
