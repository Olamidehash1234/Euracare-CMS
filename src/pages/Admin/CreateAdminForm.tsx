import React, { useRef, useState } from 'react';
import CustomDropdown from '../../components/commonComponents/CustomDropdown';

export type AdminPayload = {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  roleType: string;
  avatar?: string;
  notifyByEmail?: boolean;
  // countryCode?: string;
};

interface Props {
  mode?: 'create' | 'edit';
  initialData?: AdminPayload;
  onSave: (data: AdminPayload) => void;
  onClose: () => void;
}

const countryOptions = [
  { label: '+234 (Nigeria)', value: '+234' },
  { label: '+233 (Ghana)', value: '+233' },
  { label: '+1 (United States)', value: '+1' },
];

const roleOptions = [
  { label: 'Choose a role type', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'Super Admin', value: 'super_admin' },
];

export default function CreateAdminForm({ mode = 'create', initialData, onSave, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);

  // handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    password: '',
    confirmPassword: '',
    roleType: initialData?.roleType || '',
    notifyByEmail: initialData?.notifyByEmail ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      avatar: avatarPreview || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="">
        <a href="/admin" className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 gap-[4px]">
          <img src="/icon/right.svg" alt="" /> Back to Admin Management
        </a>

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
                    {avatarPreview ? (
                      // eslint-disable-next-line
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#01010180]"><img src="/test-avatar.png" alt="" /></div>
                    )}
                  </div>

                  <label
                    htmlFor="avatar"
                    className="mt-[-1px] z-10 inline-block text-[12px] lg:text-[12px] bg-[#0C2141] text-[#F8F8F8] px-3 lg:px-[17px] py-[5px] rounded-full cursor-pointer text-center shadow-sm"
                  >
                    Tap to change image
                  </label>
                  <input
                    id="avatar"
                    ref={fileRef}
                    onChange={handleAvatarChange}
                    type="file"
                    accept="image/*"
                    className="hidden"
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

                  {mode === 'create' && (
                    <>
                      <div>
                        <label className="block text-sm text-[#010101] mb-2">Password</label>
                        <input
                          type="password"
                          value={form.password}
                          onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="XXXXXXXXXX"
                          className="w-full rounded-md border border-[#01010133] leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-[#010101] mb-2">Confirm Password</label>
                        <input
                          type="password"
                          value={form.confirmPassword}
                          onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="XXXXXXXXXX"
                          className="w-full rounded-md border border-[#01010133] leading-[24px] px-3 py-[8px] text-sm focus:outline-none"
                        />
                      </div>
                    </>
                  )}
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
                <button type="button" onClick={onClose} className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm">
                  {mode === 'create' ? 'Create Profile' : 'Update changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
