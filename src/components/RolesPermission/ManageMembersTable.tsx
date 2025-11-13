import type { AdminType } from '../Admin/AdminTable';
import { useState } from 'react';
import MoreMenu from '../commonComponents/MoreMenu';

interface Props {
  isOpen?: boolean; // kept optional for compatibility (not used to control overlay)
  roleName: string;
  members: AdminType[];
  onClose: () => void;
  onEdit?: (admin: AdminType) => void;
  onDelete?: (admin: AdminType) => void;
}

const fmt = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export default function ManageMembersTable({ members, onEdit, onDelete }: Props) {
  const [openMenuFor, setOpenMenuFor] = useState<string | number | null>(null);

  return (
    <div>
      <div className="overflow-x-auto w-full border-[0.3px] px-[12px] border-[#B9B9B9] rounded-[8px]">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-[13px] text-[#0C2141]">
              <th className="w-[40px] pt-[22px] pb-[22px] text-[14px] font-medium leading-[20px] px-0 align-middle">
              <span className="sr-only">Select rows</span>
            </th>
              <th className="w-[300px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Full Name</th>
              <th className="w-[220px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Date Created</th>
              <th className="w-[250px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Email Address</th>
              <th className="w-[180px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Role</th>
              <th className="w-[170px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Last Active</th>
              <th className="w-[180px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Account Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => {
              const isSuspended = m.status === 'Suspended';
              const badgeClass = isSuspended
                ? 'bg-[#FF95001A] text-[#FF9500]'
                : (m.role === 'Super Admin' ? 'bg-[#EBF9F0] text-green-800' : 'bg-amber-100 text-amber-800');
              const badgeText = isSuspended ? 'Suspended' : 'Active';

              return (
              <tr key={m.id} className="border-t border-[#01010133]">
                <td className="w-[40px] py-[25px] align-middle"><input type="checkbox" /></td>
                <td className="py-3 px-0 py-[25px] flex items-center gap-3">
                  <img src={m.avatar || '/image/avatar/default.png'} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-sm">{m.name}</div>
                </td>
                <td className="py-3 px-0 py-[25px] text-sm">{fmt(m.dateCreated)}</td>
                <td className="py-3 px-0 py-[25px] text-sm">{m.email}</td>
                <td className="py-3 px-0 py-[25px] text-sm">{m.role}</td>
                <td className="py-3 px-0 py-[25px] text-sm">{m.active ?? '-'}</td>
                <td className="py-3 px-0 py-[25px]">
                  <div className="flex items-center gap-[10px]">
                    <span className={`inline-flex items-center gap-[4px] px-3 py-1 lg:px-[20px] lg:py-[8px] lg:leading-[16px] rounded-[4px] text-sm ${badgeClass}`}>
                      {/* use a different icon for suspended status */}
                      <img src={isSuspended ? '/icon/circle-yellow.svg' : '/icon/circle.svg'} alt={badgeText} />
                      {badgeText}
                    </span>

                    {/* More button (three-dots) */}
                    <div className="relative inline-block">
                      <button
                        aria-label="More options"
                        onClick={() => setOpenMenuFor(prev => prev === m.id ? null : m.id)}
                        className="p-2"
                      >
                        <img src="/icon/more.svg" alt="More" />
                      </button>

                      {openMenuFor === m.id && (
                        <MoreMenu
                          menuClassName="w-[220px] border border-[#0C2141]" /* increased width for this usage only */
                          onSuspendUser={() => { onDelete?.(m); }}
                          onManagePermission={() => { onEdit?.(m); }}
                          onViewActivity={() => console.log('View activity for', m)}
                          onClose={() => setOpenMenuFor(null)}
                        />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              );
            })}

            {members.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm text-gray-500">No members in this role.</td>
              </tr>
            )}
           </tbody>
         </table>
       </div>
     </div>
   );
 }
