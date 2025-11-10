import { useRef, useState } from 'react';

interface TeamMemberPayload {
  fullName: string;
  role: string;
  category: string;
  avatar?: string;
}

interface Props {
  mode?: 'create' | 'edit';
  initialData?: TeamMemberPayload;
  onSave: (data: TeamMemberPayload) => void;
  onClose: () => void;
}

export default function TeamMemberModal({ mode = 'create', initialData, onSave, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    role: initialData?.role || '',
    category: initialData?.category || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      avatar: avatarPreview || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-[850px] max-w-[85%] bg-white rounded-[10px] border border-[#01010133] shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 lg:px-[40px] py-4 border-b border-[#F0F0F0]">
          <h3 className="text-lg lg:text-[20px] font-medium">{mode === 'create' ? 'Add New' : 'Edit'} Team Member</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 lg:px-[40px] lg:pt-[40px] lg:pb-[14px]">
            <div className="border rounded-[8px] border-[#F0F0F0] p-6 lg:px-[30px] lg:pt-[20px] gap-8 items-center">
              <div>
                <h4 className="text-sm leading-[24px] lg:text-[16px] font-medium lg:leading-[20px] mb-4 lg:mb-[40px] text-[#010101]">Basic Information</h4>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-[60px]">
                {/* Avatar column */}
                <div className="lg:w-1/3 flex flex-col items-center">
                  <div className="w-[100px] h-[100px] lg:w-[240px] lg:h-[240px] rounded-full bg-[#F3F3FF] overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#01010180]"><img src="/test-avatar.png" alt="" /></div>
                    )}
                  </div>

                  <label
                    htmlFor="team-avatar"
                    className="mt-0 inline-block bg-[#0C2141] text-white text-[14px] lg:text-[16px] px-[10px] lg:px-[44px] lg:py-[13px] py-[8px] rounded-full cursor-pointer shadow-sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    Tap to change logo
                  </label>
                  <input
                    id="team-avatar"
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = URL.createObjectURL(file);
                      setAvatarPreview(url);
                    }}
                  />
                </div>

                {/* Form column */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-[30px]">
                    <div className='w-full'>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Full Name</label>
                      <input 
                        value={form.fullName}
                        onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Full Name" 
                        className="w-full rounded-md leading-[24px] border border-[#01010133] font-normal placeholder:text-[#01010180] focus:outline-none px-3 py-[8px] text-sm leading-[24px]" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Role</label>
                      <input 
                        value={form.role}
                        onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="Role" 
                        className="w-full rounded-md leading-[24px] border border-[#01010133] font-normal placeholder:text-[#01010180] focus:outline-none px-3 py-[8px] text-sm leading-[24px]" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Category</label>
                      <input 
                        value={form.category}
                        onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Category" 
                        className="w-full rounded-md leading-[24px] font-normal placeholder:text-[#01010180] border border-[#01010133] focus:outline-none px-3 py-[8px] text-sm leading-[24px]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-[26px] flex justify-end gap-3">
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm"
              >
                {mode === 'create' ? 'Create Team Member' : 'Update changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
