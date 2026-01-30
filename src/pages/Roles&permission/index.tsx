import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import MoreMenu from '../../components/commonComponents/MoreMenu';
import { sampleAdminsInitial } from '../Admin';
import ManageMembersTable from '../../components/RolesPermission/ManageMembersTable';
import ManagePermissionModal from '../../components/RolesPermission/ManagePermissionModal';
import Toast from '../../components/GlobalComponents/Toast';
import roleService from '../../services/roleService';
import adminService from '../../services/adminService';

const roleMeta: Record<string, { description: string; icon: string }> = {
  'SUPER_ADMIN': {
    description: 'Manages system settings and user access.',
    icon: '/icon/super-admin.svg',
  },
  'ADMIN': {
    description: 'Manages system settings and user access.',
    icon: '/icon/admin1.svg',
  },
  'Support': {
    description: 'Manages queries settings and user access.',
    icon: '/icon/support.svg',
  },
};

const DepartmentPage = () => {
  // State for fetched roles
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // derive roles/groups from admin data for member counts
  const admins = sampleAdminsInitial;
  const grouped = admins.reduce<Record<string, { name: string; members: string[]; count: number }>>((acc, a) => {
    const key = a.role || 'Unknown';
    if (!acc[key]) acc[key] = { name: key, members: [], count: 0 };
    if (a.avatar) acc[key].members.push(a.avatar);
    acc[key].count += 1;
    return acc;
  }, {});

  // Fetch roles from API
  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[RolesPage] Fetching roles...');
      const response = await roleService.getAllRoles();
      console.log('[RolesPage] Raw API response:', response);

      // API returns: response.data.data.roles as RoleResponse[]
      const rolesData = response?.data?.data?.roles || [];

      console.log('[RolesPage] Parsed roles data:', rolesData);

      if (!Array.isArray(rolesData)) {
        throw new Error('Invalid response format: expected array of roles');
      }

      setRoles(rolesData);
      console.log('[RolesPage] Roles loaded:', rolesData);
    } catch (err: any) {
      console.error('[RolesPage] Error fetching roles:', err);
      
      let errorMessage = 'Failed to load roles';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles on mount
  useEffect(() => {
    fetchRoles();
  }, []);

  // Build display roles with member info from API response
  const displayRoles = roles.map((role: any) => {
    const users = role.users || [];
    const memberCount = users.length;
    const memberAvatars = users.map((user: any) => user.profile_picture_url).filter(Boolean);
    
    // Provide default meta if role name not found in roleMeta
    const meta = roleMeta[role.name] || { 
      description: role.description || `${memberCount} users assigned`,
      icon: ''
    };
    
    return {
      id: role.id,
      name: role.name,
      count: memberCount,
      description: role.description || meta.description,
      icon: meta.icon || '',
      members: memberAvatars,
    };
  });

  const mockRoles = displayRoles.length > 0 ? displayRoles : Object.entries(grouped).map(([roleName, data]) => {
    const meta = roleMeta[roleName] || roleMeta['Unknown'];
    return {
      id: roleName.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      count: data.count,
      description: meta.description || `${data.count} users assigned`,
      icon: meta.icon || '',
      members: data.members, // avatars from admin data
    };
  });

  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [openMembersFor, setOpenMembersFor] = useState<string | null>(null); // which role id to show members for
  const [membersData, setMembersData] = useState<any[]>([]); // Stores fetched members for the selected role
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionModalMode, setPermissionModalMode] = useState<'create' | 'edit'>('create');
  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState<string | null>(null);
  const [isLoadingPermission, setIsLoadingPermission] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading'; show: boolean }>({
    message: '',
    type: 'success',
    show: false,
  });

  const handleManageMembers = async (roleId: string) => {
    // close the small MoreMenu and open inline members table
    setOpenMenuFor(null);
    setIsLoadingMembers(true);

    try {
      // Fetch users filtered by roleId using the list users endpoint
      const params = { 
        roleId: roleId,
        limit: 100 // Get all users for this role
      };
      
      console.log('[RolesPage] Fetching members with params:', params);
      
      const response = await adminService.getAllAdmins(params);
      
      console.log('[RolesPage] Full response from backend:', response);
      console.log('[RolesPage] Response data:', response?.data);
      
      const usersData = response?.data?.data?.users || [];
      
      console.log('[RolesPage] Parsed users data:', usersData);
      console.log('[RolesPage] Users count:', usersData.length);

      if (Array.isArray(usersData) && usersData.length > 0) {
        // Get the role name from the mockRoles
        const role = mockRoles.find(r => r.id === roleId);
        const roleName = role?.name || 'Unknown';

        // Transform the users data to AdminType format
        const transformedMembers = usersData.map((user: any) => {
          console.log('[RolesPage] Transforming user:', {
            id: user.id || user._id,
            name: user.full_name,
            status: user.status,
          });

          return {
            id: user.id || user._id,
            name: user.full_name || user.fullName || '',
            avatar: user.profile_picture_url || user.profilePictureUrl,
            dateCreated: user.created_at || user.createdAt || new Date().toISOString(),
            email: user.email || '',
            role: roleName,
            active: user.lastLogin ? 'Active' : 'Inactive',
            status: user.status === 'Active' ? 'Active' : 'Suspended',
          };
        });

        console.log('[RolesPage] Transformed members:', transformedMembers);
        setMembersData(transformedMembers);
        setOpenMembersFor(roleId);
      } else {
        console.warn('[RolesPage] No users data found or empty array');
        showToast('No members found for this role', 'error');
      }
    } catch (error: any) {
      console.error('[RolesPage] Error fetching role members:', error);
      let errorMessage = 'Failed to load members for this role';

      if (error.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view members.';
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleManagePermission = (roleId: string) => {
    // open permission modal in edit mode
    setOpenMenuFor(null);
    setSelectedRoleForPermission(roleId);
    setPermissionModalMode('edit');
    setPermissionModalOpen(true);
  };

  const handleCreateRole = () => {
    setPermissionModalMode('create');
    setSelectedRoleForPermission(null);
    setPermissionModalOpen(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      console.log('[RolesPage] Deleting role:', roleId);
      await roleService.deleteRole(roleId);
      showToast('Role deleted successfully!', 'success');
      
      // Refresh roles list
      await new Promise(resolve => setTimeout(resolve, 1500));
      fetchRoles();
    } catch (error: any) {
      console.error('[RolesPage] Error deleting role:', error);
      let errorMessage = 'Failed to delete role. Please try again.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to delete this role.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Cannot delete this role.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }

      showToast(errorMessage, 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleSavePermission = async (data: {
    roleName: string;
    roleDescription: string;
    permissions: any[];
  }) => {
    setIsLoadingPermission(true);
    const isCreating = permissionModalMode === 'create';
    showToast(
      isCreating ? 'Creating role...' : 'Updating role...',
      'loading'
    );

    try {
      // Map permission names to backend enum values
      const resourceMapping: Record<string, string> = {
        'doctors': 'Doctor',
        'our_team': 'Team',
        'services': 'Service',
        'blog_articles': 'Article',
        'admin_management': 'User',
        'roles_and_permission': 'Roles_and_Permission',
      };

      // Transform permissions array into an object grouped by resource
      // Backend expects: { "Doctor": { "create": true, "view": true, ... } }
      const permissionObject: Record<string, Record<string, boolean>> = {};
      
      data.permissions.forEach((perm) => {
        // Normalize the permission name: remove special characters, replace spaces with underscores
        const normalizedName = perm.name
          .toLowerCase()
          .replace(/[&\s]+/g, '_') // Replace & and spaces with underscore
          .replace(/_{2,}/g, '_') // Remove multiple underscores
          .replace(/_$/, ''); // Remove trailing underscore
        
        // Map to backend enum value
        const resourceKey = resourceMapping[normalizedName] || normalizedName;
        
        if (perm.actions) {
          const actionObject: Record<string, boolean> = {
            create: perm.actions.create || false,
            view: perm.actions.view || false,
            edit: perm.actions.edit || false,
            delete: perm.actions.delete || false,
          };
          
          permissionObject[resourceKey] = actionObject;
        }
      });

      const payload = {
        name: data.roleName,
        description: data.roleDescription,
        permission: {
          resources: permissionObject, // Wrap in 'resources' key
        },
      };

      console.log('=== Backend Request Body ===');
      console.log('Endpoint:', isCreating ? 'POST /api/v1/roles/' : `PUT /api/v1/roles/${selectedRoleForPermission}`);
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('============================');

      if (isCreating) {
        await roleService.createRole(payload);
        console.log('✅ Role created successfully');
        showToast(
          `"${data.roleName}" role created successfully!`,
          'success'
        );
      } else if (selectedRoleForPermission) {
        // For update, extract the ID from selectedRoleForPermission or modify as needed
        await roleService.updateRole(selectedRoleForPermission, payload);
        console.log('✅ Role updated successfully');
        showToast(
          `"${data.roleName}" role updated successfully!`,
          'success'
        );
      }

      // Close modal after a brief delay
      setTimeout(() => {
        setPermissionModalOpen(false);
        // Refresh roles list from API
        fetchRoles();
      }, 1500);
    } catch (error: any) {
      // console.error('Error saving permission:', error);
      
      let errorMessage = 'Something went wrong. Please try again.';

      // Log backend response details
      if (error.response) {
        // console.log('=== Backend Error Response ===');
        // console.log('Status:', error.response.status);
        // console.log('Status Text:', error.response.statusText);
        // console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        // console.log('==============================');

        // Generate user-friendly error messages
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid role information. Please check and try again.';
        } else if (error.response.status === 409) {
          errorMessage = 'A role with this name already exists. Please use a different name.';
        } else if (error.response.status === 401) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error occurred. Please contact support if this persists.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // console.log('No response from server:', error.request);
        errorMessage = 'No response from server. Please check your connection and try again.';
      } else {
        // console.log('Error message:', error.message);
        errorMessage = error.message || errorMessage;
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsLoadingPermission(false);
    }
  };

  return (
    <div>
      <section>
        <Header title="Roles & Permission" />
        <div className="p-[16px] lg:p-[40px]">
          {openMembersFor && (
            <a href="/roles&permission" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
              <img src="/icon/right.svg" alt="" /> Back to Roles and Permissions Page
            </a>
          )}
          <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
            <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
              <button
                onClick={handleCreateRole}
                className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium"
              >
                <span className="text-lg">+</span> Create Roles
              </button>

              <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
                <SearchBar placeholder="Search Here" />
              </div>
            </div>

            {/* NEW: show ManageMembersTable alone when a role is selected */}
            {openMembersFor ? (
              (() => {
                const role = mockRoles.find(r => r.id === openMembersFor);
                return (
                  <div className="mt-0">
                    {isLoadingMembers ? (
                      <LoadingSpinner heightClass="py-[100px]" />
                    ) : (
                      <ManageMembersTable
                        isOpen={true}
                        roleName={role?.name ?? 'Members'}
                        members={membersData}
                        onClose={() => {
                          setOpenMembersFor(null);
                          setMembersData([]);
                        }}
                        onEdit={() => { /* console.log('edit admin from members table', admin); */ }}
                        onDelete={() => { /* console.log('delete admin from members table', admin); */ }}
                      />
                    )}
                  </div>
                );
              })()
            ) : isLoading ? (
              <LoadingSpinner heightClass="py-[200px]" />
            ) : error ? (
              <NotFound
                title="Error Loading Roles"
                description={error}
                imageSrc="/not-found.png"
                ctaText="Try Again"
                onCta={fetchRoles}
              />
            ) : mockRoles.length === 0 ? (
              <NotFound
              onCta={handleCreateRole}
                title="Nothing to see here"
                description={`It looks like you haven't defined any roles and permission yet. Once Added, they'll appear here for you to manage.`}
                imageSrc="/not-found.png"
                ctaText="Create Roles"
              />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:mb-[24px]">
                  {mockRoles.map((role) => {
                    const extra = Math.max(0, role.members.length - 3);
                    return (
                      <div key={role.id} className="relative bg-white border border-[#0101011A] rounded-[10px] p-[20px] shadow-sm flex flex-col gap-[21px]">
                        <div className='flex gap-[10px] items-center'>
                          <div className="flex-shrink-0">
                            {role.icon ? (
                              <img src={role.icon} alt={role.name} className="w-10 h-10 lg:h-[44px] lg:w-[44px] rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 lg:h-[44px] lg:w-[44px] rounded-full bg-[#92BDFF] flex items-center justify-center text-sky-800 font-medium">
                                {role.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="text-sm lg:text-[16px] text-[#010101]">{role.name} <span className="text-[#0C2141]">({role.count})</span></div>
                                <div className="text-xs lg:text-[13px] leading-[20px] text-[#010101CC]">{role.description}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-row justify-between items-center">
                          <div className="flex -space-x-[10px]">
                            {role.members.slice(0, 4).map((src: string, idx: number) => (
                              <img
                                key={idx}
                                src={src || '/image/avatar/default.png'}
                                alt=""
                                className="w-8 h-8 lg:w-[40px] lg:h-[40px] rounded-full object-cover"
                              />
                            ))}
                            {extra > 0 && (
                              <div className="w-8 h-8 lg:w-[40px] lg:h-[40px] rounded-full bg-gray-200 text-[14px] text-gray-700 flex items-center justify-center">
                                +{extra}
                              </div>
                            )}
                          </div>

                          <div>
                            <button
                              aria-label="More options"
                              onClick={() => setOpenMenuFor((s) => (s === role.id ? null : role.id))}
                              className=""
                            >
                              <img src="/icon/more2.svg" alt="" className='w-full h-full object-cover'/>
                            </button>

                            {openMenuFor === role.id && (
                              <MoreMenu
                                onClose={() => setOpenMenuFor(null)}
                                onManageMembers={() => handleManageMembers(role.id)}
                                onManagePermission={() => handleManagePermission(role.id)}
                                onDeleteRole={() => handleDeleteRole(role.id)}
                              />
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )
            }
          </div>
        </div>
      </section>

      {/* Permission Modal */}
      <ManagePermissionModal
        isOpen={permissionModalOpen}
        mode={permissionModalMode}
        roleId={selectedRoleForPermission || undefined}
        roleName={
          permissionModalMode === 'edit'
            ? mockRoles.find((r) => r.id === selectedRoleForPermission)?.name || ''
            : ''
        }
        roleDescription={
          permissionModalMode === 'edit'
            ? mockRoles.find((r) => r.id === selectedRoleForPermission)?.description || ''
            : ''
        }
        onClose={() => setPermissionModalOpen(false)}
        onSave={handleSavePermission}
        isLoading={isLoadingPermission}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onHide={hideToast}
      />
    </div>
  );
};

export default DepartmentPage;
