import { useRef, useState, useEffect } from 'react';
import TiptapEditor from '../../components/Editor/TiptapEditor';
import LoadingSpinner from '../../components/commonComponents/LoadingSpinner';
import Toast from '../../components/GlobalComponents/Toast';
import teamService from '../../services/teamService';
import type { CreateTeamMemberPayload } from '../../services/teamService';
import { getErrorMessage } from '../../services';

interface TeamMemberFormData {
  id?: string | number; // For edit mode
  fullName: string;
  role: string;
  category: string;
  avatar?: string;
  bio?: string;
}

interface Props {
  mode?: 'create' | 'edit';
  initialData?: TeamMemberFormData;
  onSave: (data: any) => void;
  onClose: () => void;
}

interface ToastState {
  show: boolean;
  type: 'success' | 'error' | 'loading';
  message: string;
}

export default function TeamMemberModal({ mode = 'create', initialData, onSave, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatar || null);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(initialData?.avatar || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: initialData?.fullName || '',
    role: initialData?.role || '',
    category: initialData?.category || '',
    bio: initialData?.bio || '',
  });
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: 'success',
    message: '',
  });

  /**
   * Sync form state with initialData when it changes
   * This ensures form fields are pre-filled when editing a team member
   */
  useEffect(() => {
    setForm({
      fullName: initialData?.fullName || '',
      role: initialData?.role || '',
      category: initialData?.category || '',
      bio: initialData?.bio || '',
    });
    setAvatarPreview(initialData?.avatar || null);
    setUploadedAvatarUrl(initialData?.avatar || null);
  }, [initialData]);

  const showToast = (type: 'success' | 'error' | 'loading', message: string) => {
    setToast({ show: true, type, message });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allowed image types
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const allowedFormats = 'PNG, JPG, WebP';
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      showToast('error', `Invalid image format. Please use ${allowedFormats}`);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      showToast('error', `Image is too large (${sizeMB}MB). Maximum size is 5MB`);
      return;
    }

    // Show local preview immediately
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);

    // Start uploading to Cloudinary
    setIsUploadingImage(true);
    showToast('loading', 'Uploading image...');

    try {
      // Upload to Cloudinary via team service
      const imageUrl = await teamService.uploadTeamMemberAvatar(file);

      // Update preview with Cloudinary URL and store it for submission
      setAvatarPreview(imageUrl);
      setUploadedAvatarUrl(imageUrl);
      showToast('success', 'Image uploaded successfully!');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast('error', errorMessage);
      setAvatarPreview(null);
      setUploadedAvatarUrl(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!form.fullName.trim()) {
      showToast('error', 'Full name is required');
      return;
    }
    if (!form.role.trim()) {
      showToast('error', 'Role is required');
      return;
    }
    if (!form.category.trim()) {
      showToast('error', 'Category is required');
      return;
    }

    setIsSubmitting(true);

    try {
      showToast('loading', `${mode === 'create' ? 'Creating' : 'Updating'} team member...`);

      const payload: CreateTeamMemberPayload = {
        full_name: form.fullName.trim(),
        role: form.role.trim(),
        category: form.category.trim(),
        bio: form.bio?.trim() || undefined,
      };

      if (mode === 'create') {
        // For create, if avatar was uploaded, add it to payload
        const response = await teamService.createTeamMember(
          payload,
          uploadedAvatarUrl || undefined
        );
        
        // Extract team member from nested response structure
        const member = (response.data as any)?.team_member || response.data;
        showToast('success', 'Team member created successfully!');
        
        // Call parent onSave with the response data
        onSave({
          id: member.id,
          name: member.full_name,
          avatar: member.profile_picture_url,
          role: member.role,
          category: member.category,
          createdAt: member.created_at,
        });

        // Close modal after short delay to show success message
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Edit mode: Update existing team member
        
        // Call updateTeamMember with ID, payload, and optional avatar URL
        const response = await teamService.updateTeamMember(
          String(initialData?.id),
          payload,
          uploadedAvatarUrl || undefined
        );

        // Extract team member from nested response structure
        const member = (response.data as any)?.team_member || response.data;
        showToast('success', 'Team member updated successfully!');

        // Call parent onSave with the updated response data
        onSave({
          id: member.id,
          name: member.full_name,
          fullName: member.full_name,
          avatar: member.profile_picture_url,
          role: member.role,
          category: member.category,
          bio: member.bio,
          createdAt: member.created_at,
        });

        // Close modal after short delay to show success message
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save team member. Please try again.';
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* cap height and allow scrolling so modal stays compact on smaller viewports */}
      <div className="relative w-[850px] max-w-[85%] max-h-[80vh] bg-white rounded-[10px] border border-[#01010133] shadow-lg overflow-auto">
        <div className="flex items-center justify-between px-6 lg:px-[40px] py-4 border-b border-[#F0F0F0]">
          <h3 className="text-lg lg:text-[20px] font-medium">{mode === 'create' ? 'Add New' : 'Edit'} Team Member</h3>
        </div>

        <form onSubmit={handleSubmit}>
          {/* reduced paddings to make modal more compact */}
          <div className="p-4 lg:px-[28px] lg:pt-[24px] lg:pb-[12px]">
            <div className="border rounded-[8px] border-[#F0F0F0] p-4 lg:px-[24px] lg:pt-[16px] gap-6 items-center">
              <div>
                <h4 className="text-sm leading-[24px] lg:text-[16px] font-medium lg:leading-[20px] mb-4 lg:mb-[40px] text-[#010101]">Basic Information</h4>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-[60px]">
                {/* Avatar column */}
                <div className="lg:w-1/3 flex flex-col items-center">
                  <div className="w-[100px] h-[100px] lg:w-[160px] lg:h-[160px] rounded-full bg-[#F3F3FF] overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[#01010180]"><img src="/test-avatar.png" alt="" /></div>
                    )}
                  </div>

                  <label
                    htmlFor="team-avatar"
                    className="mt-0 inline-block bg-[#0C2141] text-white text-[14px] lg:text-[15px] px-[10px] lg:px-[28px] lg:py-[10px] py-[8px] rounded-full cursor-pointer shadow-sm hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingImage ? 'Uploading...' : 'Change logo'}
                  </label>
                  <input
                    id="team-avatar"
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isUploadingImage || isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG up to 5MB</p>
                </div>

                {/* Form column */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 lg:gap-[30px]">
                    <div className='w-full'>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Full Name *</label>
                      <input 
                        value={form.fullName}
                        onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Full Name" 
                        className="w-full rounded-md leading-[24px] border border-[#01010133] font-normal placeholder:text-[#01010180] focus:outline-none px-3 py-[8px] text-sm leading-[24px]"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Role *</label>
                      <input 
                        value={form.role}
                        onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                        placeholder="e.g., Product Manager, Designer" 
                        className="w-full rounded-md leading-[24px] border border-[#01010133] font-normal placeholder:text-[#01010180] focus:outline-none px-3 py-[8px] text-sm leading-[24px]"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Category *</label>
                      <input 
                        value={form.category}
                        onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., Leadership, Development, Design" 
                        className="w-full rounded-md leading-[24px] font-normal placeholder:text-[#01010180] border border-[#01010133] focus:outline-none px-3 py-[8px] text-sm leading-[24px]"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Short Bio (plain text with paragraphs) */}
                    <div>
                      <label className="block text-sm leading-[24px] text-[#010101] mb-2">Short Bio</label>
                      <TiptapEditor
                        content={form.bio}
                        onChange={(bio) => setForm(prev => ({ ...prev, bio }))}
                        placeholder="Writeup about the team member"
                        mode="paragraphOnly"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-[18px] flex justify-end gap-3">
              {mode === 'edit' && (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-[50px] py-[12px] rounded-[48px] border border-[#0C2141] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <LoadingSpinner />}
                {mode === 'create' ? 'Create Team Member' : 'Update changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Toast notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        show={toast.show}
        onHide={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
