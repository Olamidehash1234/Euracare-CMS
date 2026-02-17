import React, { useRef, useState, useEffect } from 'react';
import CustomDropdown from '../../components/commonComponents/CustomDropdown';
import Toast from '../../components/GlobalComponents/Toast';
import { adminService, roleService } from '@/services';
import { getErrorMessage } from '@/services';

export type AdminPayload = {
  id?: string | number;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  roleType: string;
  avatar?: string;
  notifyByEmail?: boolean;
  countryCode?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: AdminPayload;
  isLoadingData?: boolean;
  onSave: (data: AdminPayload) => void;
  onClose: () => void;
}

const countryOptions = [
  { label: '+234 (Nigeria)', value: '+234' },
  { label: '+233 (Ghana)', value: '+233' },
  { label: '+1 (United States)', value: '+1' },
];

export default function CreateAdminForm({ mode = 'create', initialData, isLoadingData = false, onSave, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('loading');
  const [showToast, setShowToast] = useState(false);
  const [roleOptions, setRoleOptions] = useState<Array<{ label: string; value: string }>>([
    { label: 'Loading roles...', value: '' },
  ]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      setToastMessage('Uploading image...');
      setToastType('loading');
      setShowToast(true);

      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl);

      // Upload to Cloudinary
      const imageUrl = await adminService.uploadAdminAvatar(file);

      // Update preview with Cloudinary URL
      setAvatarPreview(imageUrl);

      setToastMessage('Image uploaded successfully!  ');
      setToastType('success');
      setShowToast(true);
    } catch (err: any) {
      let errorMessage = 'Failed to upload image';

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
      setAvatarPreview(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getAllRoles();
        const rolesData = response?.data?.data?.roles || [];

        if (Array.isArray(rolesData) && rolesData.length > 0) {
          const formattedRoles = rolesData.map((role: any) => ({
            label: role.name,
            value: role._id || role.id,
          }));
          setRoleOptions([
            { label: 'Choose a role type', value: '' },
            ...formattedRoles,
          ]);

          // If in edit mode and role is set, ensure it matches one of the API roles
          if (mode === 'edit' && initialData?.roleType) {
            const matchingRole = formattedRoles.find(r => r.value === initialData.roleType);
            if (matchingRole && form.roleType !== initialData.roleType) {
              setForm(prev => ({ ...prev, roleType: initialData.roleType || '' }));
            }
          }
        } else {
          setRoleOptions([{ label: 'No roles available', value: '' }]);
        }
      } catch (err: any) {
        let fallbackLabel = 'Failed to load roles';
        if (err.response?.status === 403) {
          fallbackLabel = 'You do not have permission to view roles';
        } else if (err.response?.status === 401) {
          fallbackLabel = 'Session expired, please log in again';
        }

        setRoleOptions([{ label: fallbackLabel, value: '' }]);
      }
    };

    fetchRoles();
  }, [mode, initialData?.roleType]);

  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    countryCode: initialData?.countryCode || '+234',
    password: '',
    confirmPassword: '',
    roleType: initialData?.roleType || '',
    notifyByEmail: initialData?.notifyByEmail ?? true,
  });





  const validateForm = (): boolean => {
    if (!form.fullName || !form.email || !form.phone || !form.roleType) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return false;
    }

    // Only require password in create mode
    if (mode === 'create' && (!form.password || !form.confirmPassword)) {
      setToastMessage('Password and confirm password are required');
      setToastType('error');
      setShowToast(true);
      return false;
    }

    // If password is being updated, both password and confirmPassword must match
    if ((form.password || form.confirmPassword) && form.password !== form.confirmPassword) {
      setToastMessage('Passwords do not match');
      setToastType('error');
      setShowToast(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setToastMessage('Please enter a valid email address');
      setToastType('error');
      setShowToast(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setToastType('loading');
    setToastMessage(mode === 'create' ? 'Creating admin profile...' : 'Updating admin profile...');
    setShowToast(true);

    try {
      const fullPhone = `${form.countryCode}${form.phone}`;
      
      const payload: any = {
        profile_picture_url: avatarPreview || '',
        full_name: form.fullName,
        email: form.email,
        phone: fullPhone,
        role: form.roleType,
        notify_user: form.notifyByEmail,
      };

      // Only include password fields if they have actual values (not empty)
      // In create mode, password is always required
      // In edit mode, password is optional (only include if user provided new password)
      if (form.password || mode === 'create') {
        payload.password = form.password;
        payload.confirm_password = form.confirmPassword;
      }

      if (mode === 'create') {
        await adminService.createUser(payload);
        setToastMessage('Admin profile created successfully!  ');
      } else {
        // For edit mode, use updateAdmin which should be able to handle optional password
        await adminService.updateAdmin(String(initialData?.id || ''), payload);
        setToastMessage('Admin profile updated successfully!  ');
      }

      setToastType('success');

      await new Promise(resolve => setTimeout(resolve, 1500));

      onSave({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        roleType: form.roleType,
        avatar: avatarPreview || undefined,
        notifyByEmail: form.notifyByEmail,
        countryCode: form.countryCode,
      });
    } catch (err: any) {
      // Log detailed error information for debugging
      // console.error('=== Admin Creation/Update Error ===');
      // console.error('Status Code:', err?.response?.status);
      // console.error('Backend Response:', err?.response?.data);
      // console.error('Error Message:', err?.message);
      // console.error('Full Error:', err);
      // console.error('Payload Sent:', payload);
      // console.error('=====================================');

      const errorMessage = getErrorMessage(err);
      setToastType('error');
      setToastMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => {
          if (toastType !== 'loading') {
            setShowToast(false);
          }
        }}
      />

      <div className="" style={{ opacity: isLoadingData ? 0.5 : 1, pointerEvents: isLoadingData ? 'none' : 'auto' }}>
        <button onClick={onClose} className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px] bg-none border-none cursor-pointer hover:text-[#0a1a2f] transition">
          <img src="/icon/right.svg" alt="" /> Back to Admin Management
        </button>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-6 lg:px-[30px] py-5 lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Create New Admin' : 'Edit Admin'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 lg:px-[40px] lg:py-[30px]">
            <div className="flex flex-col gap-6">
              <div className="flex gap-6 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0 justify-center flex flex-col items-center">
                  <div className="w-24 h-24 z-30 lg:w-[150px] lg:h-[150px] rounded-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full z-40">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {avatarPreview ? (
                      // eslint-disable-next-line
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#01010180]"><img src="/test-avatar.png" alt="" /></div>
                    )}
                  </div>

                  <label
                    htmlFor="avatar"
                    className={`mt-[-1px] z-10 inline-block text-[12px] bg-[#0C2141] text-[#F8F8F8] px-3 lg:px-[17px] py-[5px] rounded-full cursor-pointer text-center shadow-sm ${
                      isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploadingAvatar ? 'Uploading...' : 'Tap to change image'}
                  </label>
                  <input
                    id="avatar"
                    ref={fileRef}
                    onChange={handleAvatarChange}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </div>

                {/* Keep avatar alignment */}
                <div className="flex-1" />
              </div>

              <div className="border rounded-[10px] border-[#0101011A] p-6">
                <h3 className="text-[16px] font-medium mb-6">Basic Information</h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm text-[#010101] mb-2">Full Name</label>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter full name"
                      className="w-full rounded-md border border-[#01010133] leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#010101] mb-2">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className="w-full rounded-md border border-[#01010133] leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#010101] mb-2">Phone Number</label>
                    <div className="flex gap-2">
                      <CustomDropdown
                        options={countryOptions}
                        value={form.countryCode}
                        onChange={(value) => setForm(prev => ({ ...prev, countryCode: value }))}
                        className="w-[100px]"
                      />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="701 234 5678"
                        className="flex-1 rounded-md border border-[#01010133] px-3 py-[8px] text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#010101] mb-2">Role Type</label>
                    <CustomDropdown
                      options={roleOptions}
                      value={form.roleType}
                      onChange={(value) => setForm(prev => ({ ...prev, roleType: value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#010101] mb-2">
                      Password {mode === 'edit' && <span className="text-[#999]">(optional)</span>}
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder={mode === 'create' ? 'XXXXXXXXXX' : 'Leave empty to keep current password'}
                      className="w-full rounded-md border border-[#01010133] leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#010101] mb-2">
                      Confirm Password {mode === 'edit' && <span className="text-[#999]">(optional)</span>}
                    </label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder={mode === 'create' ? 'XXXXXXXXXX' : 'Leave empty to keep current password'}
                      className="w-full rounded-md border border-[#01010133] leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-6">
                    <p className="text-sm text-[#010101]">Do you want us to notify them about their new account at the email provided?</p>
                    <div className="flex gap-[20px]">
                      <label className="flex items-center gap-2">
                        <span className="text-sm">Yes</span>
                        <input
                          type="radio"
                          checked={form.notifyByEmail === true}
                          onChange={() => setForm(prev => ({ ...prev, notifyByEmail: true }))}
                          className="text-[#0C2141]"
                        />
                      </label>
                      <label className="flex items-center gap-2">
                        <span className="text-sm">No</span>

                        <input
                          type="radio"
                          checked={form.notifyByEmail === false}
                          onChange={() => setForm(prev => ({ ...prev, notifyByEmail: false }))}
                          className="text-[#0C2141]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Creating...' : (mode === 'create' ? 'Create Profile' : 'Update changes')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
