import { useState, useEffect } from 'react';
import Header from '../../components/commonComponents/Header';
import SearchBar from '../../components/commonComponents/SearchBar';
import NotFound from '../../components/commonComponents/NotFound';
import AdminTable from '../../components/Admin/AdminTable';
import CreateAdminForm from './CreateAdminForm';
import type { AdminType } from '../../components/Admin/AdminTable';
import type { AdminPayload } from './CreateAdminForm';
import Toast from '../../components/GlobalComponents/Toast';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import { adminService } from '@/services';

export const sampleAdminsInitial: AdminType[] = [
];

const AdminPage = () => {
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editAdmin, setEditAdmin] = useState<AdminPayload | null>(null);
  const [isFetchingAdminData, setIsFetchingAdminData] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('success');
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message: string, type: 'success' | 'error' | 'loading') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Fetch admins on mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // console.log('[AdminPage] Fetching admins...');
      const response = await adminService.getAllAdmins();
      // console.log('[AdminPage] Raw API response:', response);

      // API returns: response.data.data.users as AdminResponse[]
      const adminsData = response?.data?.data?.users || [];

      // console.log('[AdminPage] Parsed admins data:', adminsData);

      if (!Array.isArray(adminsData)) {
        throw new Error('Invalid response format: expected array of admins');
      }

      // Map role ID to display name
      const getRoleDisplayName = (roleId: string | object) => {
        if (typeof roleId === 'object' && roleId !== null && '_id' in roleId) {
          const id = (roleId as any)._id;
          switch(id) {
            case '6940060fc2a3695489abc932':
              return 'Super Admin';
            case '6940060fc2a3695489abc933':
              return 'Admin';
            default:
              return 'Admin';
          }
        }
        switch(roleId) {
          case '6940060fc2a3695489abc932':
            return 'Super Admin';
          case '6940060fc2a3695489abc933':
            return 'Admin';
          default:
            return 'Admin';
        }
      };

      // Transform API response to match AdminType interface
      const transformedAdmins: AdminType[] = adminsData.map((admin: any) => ({
        id: admin._id || admin.id,
        name: admin.full_name || admin.fullName || '',
        avatar: admin.profile_picture_url || admin.profilePictureUrl,
        dateCreated: admin.createdAt || new Date().toISOString(),
        email: admin.email || '',
        role: getRoleDisplayName(admin.role),
        active: admin.lastLogin ? 'Active' : 'Inactive',
        status: admin.status === 'active' ? 'Active' : 'Suspended',
      }));

      setAdmins(transformedAdmins);
      // console.log('[AdminPage] Admins loaded:', transformedAdmins);
    } catch (err: any) {
      // console.error('[AdminPage] Error fetching admins:', err);
      let errorMessage = 'Failed to load admins';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleView = (admin: AdminType) => { /* console.log('view admin', admin); */ };

  const handleEdit = async (admin: AdminType) => {
    try {
      setIsFetchingAdminData(true);
      // console.log('[AdminPage] Attempting to fetch full admin data for ID:', admin.id);

      // Fetch full admin data by ID
      const response = await adminService.getAdminById(admin.id.toString());
      const fullAdmin = response.data?.data;

      if (fullAdmin) {
        // console.log('[AdminPage] Full admin data loaded:', fullAdmin);

        // Map role ID to display name
        const getRoleId = (roleObj: any) => {
          if (typeof roleObj === 'object' && roleObj !== null && '_id' in roleObj) {
            return roleObj._id;
          }
          return roleObj;
        };

        // Parse phone number and country code from fullAdmin.phone
        let countryCode = '+234';
        let phoneNumber = '';
        const phone = (fullAdmin as any).phone;
        if (phone) {
          const countryCodePatterns = ['+234', '+233', '+1'];
          const matchedCode = countryCodePatterns.find(code => phone.startsWith(code));
          if (matchedCode) {
            countryCode = matchedCode;
            phoneNumber = phone.substring(matchedCode.length);
          } else {
            phoneNumber = phone;
          }
        }

        setEditAdmin({
          id: admin.id,
          fullName: fullAdmin.full_name || '',
          email: fullAdmin.email || '',
          phone: phoneNumber,
          roleType: getRoleId(fullAdmin.role),
          avatar: (fullAdmin as any).profile_picture_url || '',
          notifyByEmail: false,
          countryCode: countryCode,
        });
        setShowCreate(true);
      }
    } catch (err: any) {
      // console.error('[AdminPage] Error fetching admin details:', err);
      let errorMessage = 'Failed to load admin details for editing';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      }

      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
    } finally {
      setIsFetchingAdminData(false);
    }
  };

  const getFilteredAdmins = () => {
    if (!searchTerm.trim()) {
      return admins;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    return admins.filter(admin =>
      admin.name?.toLowerCase().includes(lowercaseSearch) ||
      admin.email?.toLowerCase().includes(lowercaseSearch) ||
      admin.role?.toLowerCase().includes(lowercaseSearch)
    );
  };

  const handleDelete = async (admin: AdminType) => {
    try {
      // console.log('[AdminPage] Deleting admin with ID:', admin.id);
      await adminService.deleteAdmin(admin.id.toString());
      // console.log('[AdminPage] Admin deleted successfully');

      // Remove the deleted admin from the list
      setAdmins(admins.filter(a => a.id !== admin.id));

      // Show success toast
      setToastMessage('Admin deleted successfully! ✅');
      setToastType('success');
      setShowToast(true);
    } catch (err: any) {
      // console.error('[AdminPage] Error deleting admin:', err);
      let errorMessage = 'Failed to delete admin';

      if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleSave = (payload: AdminPayload) => {
    // Map role ID to display name
    const getRoleDisplayName = (roleId: string) => {
      switch(roleId) {
        case '6940060fc2a3695489abc932':
          return 'Super Admin';
        case '6940060fc2a3695489abc933':
          return 'Admin';
        default:
          return 'Admin';
      }
    };

    if (editAdmin) {
      setAdmins(prev => prev.map(a => 
        a.id === editAdmin.id 
          ? { 
              ...a, 
              name: payload.fullName,
              email: payload.email,
              role: getRoleDisplayName(payload.roleType),
              avatar: payload.avatar
            }
          : a
      ));
      setToastMessage('Admin updated successfully! ✅');
    } else {
      setAdmins(prev => [
        ...prev,
        {
          id: Date.now(),
          name: payload.fullName,
          email: payload.email,
          role: getRoleDisplayName(payload.roleType),
          avatar: payload.avatar,
          dateCreated: new Date().toISOString()
        },
      ]);
      setToastMessage('Admin created successfully! ✅');
    }
    setToastType('success');
    setShowToast(true);
    setShowCreate(false);
    setEditAdmin(null);
    // Refetch admins after save
    setTimeout(() => fetchAdmins(), 1500);
  };

  if (showCreate || editAdmin) {
    return (
      <section>
        <Header title="Admin Management" />
        <div className="p-[16px] lg:p-[40px]">
          <CreateAdminForm
            mode={editAdmin ? 'edit' : 'create'}
            initialData={editAdmin || undefined}
            isLoadingData={isFetchingAdminData}
            onSave={handleSave}
            onClose={() => {
              setShowCreate(false);
              setEditAdmin(null);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => setShowToast(false)}
      />
      <Header title="Admin Management" />
      <div className="p-[16px] lg:p-[40px]">
        <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
          <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
            <button onClick={() => setShowCreate(true)} className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium">
              <span className="text-lg">+</span> Create New Admin
            </button>

            <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
              <SearchBar 
                placeholder="Search for an admin" 
                value={searchTerm}
                onSearch={setSearchTerm}
              />
            </div>
          </div>

          {admins.length > 0 ? (
            <AdminTable
              admins={getFilteredAdmins()}
              // onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : isLoading ? (
            <LoadingSpinner heightClass="py-[200px]"/>
          ) : error ? (
            <NotFound
              title="Error Loading Admins"
              description={error}
              imageSrc="/not-found.png"
              ctaText="Try Again"
              onCta={fetchAdmins}
            />
          ) : (
            <NotFound
              title="No Admin Yet"
              description="It looks like you haven't added any admin yet. Once added, they'll appear here for you to manage."
              imageSrc="/not-found.png"
              ctaText="Create New Admin"
              onCta={() => setShowCreate(true)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
