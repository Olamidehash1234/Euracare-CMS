import type { AdminType } from '../Admin/AdminTable';
import { useState } from 'react';
import MoreMenu from '../commonComponents/MoreMenu';
import Toast from '../GlobalComponents/Toast';
import { userService } from '../../services';
import adminService from '../../services/adminService';

interface Props {
  isOpen?: boolean; // kept optional for compatibility (not used to control overlay)
  roleName: string;
  members: AdminType[];
  onClose: () => void;
  onEdit?: (admin: AdminType) => void;
}

const fmt = (iso?: string) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export default function ManageMembersTable({ members, onEdit }: Props) {
  const [openMenuFor, setOpenMenuFor] = useState<string | number | null>(null);
  const [updatedMembers, setUpdatedMembers] = useState<AdminType[]>(members);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleSuspendUser = async (member: AdminType) => {
    try {
      setIsLoading(true);
      console.log('⏸️ [ManageMembersTable] Suspending user:', member.id);
      showToast('Suspending user...', 'loading');

      // Call the suspend user endpoint
      const response = await userService.suspendUser(member.id.toString());
      console.log('📨 [ManageMembersTable] Suspend response:', response.data);

      // Update the member's status in local state
      setUpdatedMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, status: 'Suspended' } : m
        )
      );

      showToast('User suspended successfully ✅', 'success');
      setOpenMenuFor(null);
    } catch (error: any) {
      let errorMessage = 'Failed to suspend user';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('❌ [ManageMembersTable] Error suspending user:', error);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateUser = async (member: AdminType) => {
    try {
      setIsLoading(true);
      console.log('✅ [ManageMembersTable] Reactivating user:', member.id);
      showToast('Reactivating user...', 'loading');

      // Call the reactivate user endpoint
      const response = await userService.reactivateUser(member.id.toString());
      console.log('📨 [ManageMembersTable] Reactivate response:', response.data);

      // Update the member's status in local state
      setUpdatedMembers((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, status: 'Active' } : m
        )
      );

      showToast('User reactivated successfully ✅', 'success');
      setOpenMenuFor(null);
    } catch (error: any) {
      let errorMessage = 'Failed to reactivate user';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('❌ [ManageMembersTable] Error reactivating user:', error);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (member: AdminType) => {
    try {
      setIsLoading(true);
      console.log('🗑️ [ManageMembersTable] Deleting user:', member.id);
      showToast('Deleting user...', 'loading');

      // Call the delete admin endpoint
      const response = await adminService.deleteAdmin(member.id.toString());
      console.log('📨 [ManageMembersTable] Delete response:', response);

      // Remove the member from local state
      setUpdatedMembers((prev) => prev.filter((m) => m.id !== member.id));

      showToast('User deleted successfully ✅', 'success');
      setOpenMenuFor(null);
    } catch (error: any) {
      let errorMessage = 'Failed to delete user';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('❌ [ManageMembersTable] Error deleting user:', error);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
              {/* <th className="w-[170px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Last Active</th> */}
              <th className="w-[180px] pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-0">Account Status</th>
            </tr>
          </thead>
          <tbody>
            {updatedMembers.map((m) => {
              const isSuspended = m.status === 'Suspended';
              const badgeClass = isSuspended
                ? 'bg-red-50 text-red-700 border border-red-300'
                : 'bg-[#EBF9F0] border border-[#C2E0C2] text-green-800';
              const badgeText = isSuspended ? 'Suspended' : 'Active';

              return (
              <tr key={m.id} className="border-t border-[#01010133]">
                <td className="w-[40px] py-[25px] align-middle"><input type="checkbox" disabled={isLoading} /></td>
                <td className="py-3 px-0 py-[25px] flex items-center gap-3">
                  <img src={m.avatar || '/image/avatar/default.png'} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-sm">{m.name}</div>
                </td>
                <td className="py-3 px-0 py-[25px] text-sm">{fmt(m.dateCreated)}</td>
                <td className="py-3 px-0 py-[25px] text-sm">{m.email}</td>
                <td className="py-3 px-0 py-[25px] text-sm">{m.role}</td>
                {/* <td className="py-3 px-0 py-[25px] text-sm">{m.active ?? '-'}</td> */}
                <td className="py-3 px-0 py-[25px]">
                  <div className="flex items-center gap-[10px]">
                    <span className={`inline-flex items-center gap-[4px] px-3 py-1 lg:px-[20px] lg:py-[8px] lg:leading-[16px] rounded-[4px] text-sm font-medium ${badgeClass}`}>
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
                        disabled={isLoading}
                      >
                        <img src="/icon/more.svg" alt="More" />
                      </button>

                      {openMenuFor === m.id && (
                        <MoreMenu
                          menuClassName="w-[220px] border border-[#0C2141]"
                          onSuspendUser={m.status === 'Active' ? () => handleSuspendUser(m) : undefined}
                          onReactivateUser={m.status === 'Suspended' ? () => handleReactivateUser(m) : undefined}
                          onDeleteUser={() => handleDeleteUser(m)}
                          onManagePermission={() => { onEdit?.(m); }}
                          onClose={() => setOpenMenuFor(null)}
                        />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
              );
            })}

            {updatedMembers.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm text-gray-500">No members in this role.</td>
              </tr>
            )}
           </tbody>
         </table>
       </div>

       <Toast
         message={toast.message}
         type={toast.type}
         show={toast.show}
         onHide={hideToast}
       />
     </div>
   );
 }
