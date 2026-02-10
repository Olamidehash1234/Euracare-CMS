import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService, getErrorMessage } from '@/services';
import Toast from '@/components/GlobalComponents/Toast';
import LoadingSpinner from '@/components/commonComponents/LoadingSpinner';
import AvatarUpload from '@/components/commonComponents/AvatarUpload';
import BasicInformation from '@/components/Doctors/BasicInformation';
import ProfessionalInformation from '@/components/Doctors/ProfessionalInformation';
import { useDoctorForm } from '@/hooks/useDoctorForm';
import { useProfessionalInfo } from '@/hooks/useProfessionalInfo';
import { useImageUpload } from '@/hooks/useImageUpload';

export type NewDoctorPayload = {
  fullName: string;
  email: string;
  phone: string;
  languages: string;
  regNumber?: string;
  yearsExperience?: string;
  bio?: string;
  avatar?: string;
  programs?: string[];
  researchInterests?: string[];
  qualifications?: string[];
  trainings?: string[];
  associations?: string[];
  certifications?: string[];
  doctorId?: string; // Add for edit mode
};

interface DoctorFormProps {
  mode?: 'create' | 'edit';
  initialData?: NewDoctorPayload;
  onSave?: (payload: NewDoctorPayload) => void;
  onClose?: () => void;
  isLoadingData?: boolean;
}

export default function DoctorForm({
  mode = 'create',
  initialData,
  onSave,
  onClose,
  isLoadingData = false,
}: DoctorFormProps): React.ReactElement {
  const navigate = useNavigate();
  const { form, handleChange, setForm } = useDoctorForm(initialData);
  const profInfo = useProfessionalInfo(initialData);
  const imageUpload = useImageUpload(initialData?.avatar);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('loading');
  const [showToast, setShowToast] = useState(false);





  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // setUploadedImageFile(file);
    
    const imageUrl = await imageUpload.uploadImage(file);
    if (imageUrl) {
      setToastMessage('Image uploaded successfully!');
      setToastType('success');
      setShowToast(true);
    } else if (imageUpload.uploadError) {
      setToastMessage(imageUpload.uploadError);
      setToastType('error');
      setShowToast(true);
    }
  };

  const buildPayload = () => {
    return {
      full_name: form.fullName,
      email: form.email,
      phone: form.phone,
      language: form.language,
      reg_number: form.regNumber || undefined,
      years_of_experince: form.yearsExperience || undefined,
      bio: form.bio || undefined,
      profile_picture_url: imageUpload.avatarPreview || undefined,
      programs_and_specialty: profInfo.programs.length > 0 ? profInfo.programs : undefined,
      professional_association: profInfo.associations.length > 0 ? profInfo.associations : undefined,
      research_interest: profInfo.researchInterests.length > 0 ? profInfo.researchInterests : undefined,
      qualification: profInfo.qualifications.length > 0 ? profInfo.qualifications : undefined,
      training_and_education: profInfo.trainings.length > 0 ? profInfo.trainings : undefined,
      certification: profInfo.certifications.length > 0 ? profInfo.certifications : undefined,
    };
  };

  const validateForm = (): boolean => {
    if (!form.fullName || !form.email || !form.phone || !form.language) {
      setToastMessage('Please fill in all required fields');
      setToastType('error');
      setShowToast(true);
      return false;
    }
    return true;
  };

  const resetForm = (): void => {
    // Reset basic form
    setForm({
      fullName: '',
      email: '',
      phone: '',
      language: '',
      regNumber: '',
      yearsExperience: '',
      bio: '',
    });

    // Reset professional info
    profInfo.resetProfessionalInfo();

    // Reset avatar
    imageUpload.resetUpload();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setShowToast(true);
    setToastType('loading');
    const isEditMode = mode === 'edit' && initialData?.doctorId;
    setToastMessage(isEditMode ? 'Updating doctor profile...' : 'Creating doctor profile...');

    try {
      const payload = buildPayload();

      const isEditMode = mode === 'edit' && initialData?.doctorId;
      if (isEditMode && initialData?.doctorId) {
        // Update doctor
        await doctorService.updateDoctor(initialData.doctorId, payload as any);
        setToastType('success');
        setToastMessage('Doctor profile updated successfully!  ');
      } else {
        // Create doctor
        await doctorService.createDoctor(payload as any);
        setToastType('success');
        setToastMessage('Doctor profile created successfully! 🎉');
        resetForm();
      }

      // Keep toast visible during timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If onSave callback is provided (from Overview/parent component), call it
      // Convert API payload to form-shaped NewDoctorPayload for the callback
      if (onSave) {
        const callbackPayload: NewDoctorPayload = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          languages: form.language,
          regNumber: form.regNumber || undefined,
          yearsExperience: form.yearsExperience || undefined,
          bio: form.bio || undefined,
          avatar: imageUpload.avatarPreview || undefined,
          programs: profInfo.programs.length > 0 ? profInfo.programs : undefined,
          researchInterests: profInfo.researchInterests.length > 0 ? profInfo.researchInterests : undefined,
          qualifications: profInfo.qualifications.length > 0 ? profInfo.qualifications : undefined,
          trainings: profInfo.trainings.length > 0 ? profInfo.trainings : undefined,
          associations: profInfo.associations.length > 0 ? profInfo.associations : undefined,
          certifications: profInfo.certifications.length > 0 ? profInfo.certifications : undefined,
          doctorId: initialData?.doctorId,
        };

        onSave(callbackPayload);
      } else {
        navigate('/doctors', { replace: true });
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setToastType('error');
      setToastMessage(errorMessage);
      // Toast stays visible for errors, user can dismiss manually
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => {
          // Only hide toast if not loading
          if (toastType !== 'loading') {
            setShowToast(false);
          }
        }}
      />

      {isLoadingData && <LoadingSpinner />}

      <div className="" style={{ opacity: isLoadingData ? 0.5 : 1, pointerEvents: isLoadingData ? 'none' : 'auto' }}>
        <button
          onClick={onClose}
          className="inline-flex items-center text-[#0C2141] text-sm lg:text-[16px] font-medium mb-4 lg:mb-[30px] lg:leading-[140%] gap-[4px] bg-none border-none cursor-pointer hover:text-[#0a1a2f] transition"
        >
          <img src="/icon/right.svg" alt="" /> Back to Doctor's Page
        </button>

        <div className="bg-white rounded-xl border border-[#B9B9B9] overflow-hidden">
          <div className="px-6 lg:px-[30px] py-5 lg:py-[20px] border-b border-[#0000001A]">
            <h1 className="text-lg lg:text-[20px] text-[#010101] font-medium">
              {mode === 'create' ? 'Create' : 'Edit'} Doctor's Profile
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:px-[25px] sm:py-[20px]">
            {/* Avatar Section */}
            <div className="flex gap-6 items-start mb-6">
              <AvatarUpload
                preview={imageUpload.avatarPreview}
                isUploading={imageUpload.isUploadingImage}
                onFileChange={handleAvatarChange}
              />
              <div className="flex-1" />
            </div>

            {/* Basic Information */}
            <BasicInformation
              fullName={form.fullName}
              email={form.email}
              phone={form.phone}
              language={form.language}
              regNumber={form.regNumber}
              yearsExperience={form.yearsExperience}
              bio={form.bio}
              onChange={handleChange}
            />

            {/* Professional Information */}
            <ProfessionalInformation
              programInput={profInfo.programInput}
              onProgramInputChange={profInfo.setProgramInput}
              programs={profInfo.programs}
              onAddProgram={profInfo.addProgram}
              onRemoveProgram={profInfo.removeProgram}
              researchInput={profInfo.researchInput}
              onResearchInputChange={profInfo.setResearchInput}
              researchInterests={profInfo.researchInterests}
              onAddResearch={profInfo.addResearch}
              onRemoveResearch={profInfo.removeResearch}
              qualificationInput={profInfo.qualificationInput}
              onQualificationInputChange={profInfo.setQualificationInput}
              qualifications={profInfo.qualifications}
              onAddQualification={profInfo.addQualification}
              onRemoveQualification={profInfo.removeQualification}
              trainingInput={profInfo.trainingInput}
              onTrainingInputChange={profInfo.setTrainingInput}
              trainings={profInfo.trainings}
              onAddTraining={profInfo.addTraining}
              onRemoveTraining={profInfo.removeTraining}
              associationInput={profInfo.associationInput}
              onAssociationInputChange={profInfo.setAssociationInput}
              associations={profInfo.associations}
              onAddAssociation={profInfo.addAssociation}
              onRemoveAssociation={profInfo.removeAssociation}
              certificationInput={profInfo.certificationInput}
              onCertificationInputChange={profInfo.setCertificationInput}
              certifications={profInfo.certifications}
              onAddCertification={profInfo.addCertification}
              onRemoveCertification={profInfo.removeCertification}
            />

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end gap-3">
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
                disabled={isSubmitting || imageUpload.isUploadingImage}
                className="px-[40px] py-[12px] rounded-[48px] bg-[#0C2141] text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : mode === 'create' ? 'Create profile' : 'Update changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
