import { useState } from 'react';
import { doctorService, getErrorMessage } from '@/services';

export const useImageUpload = (initialAvatar?: string) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatar || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Show local preview immediately
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);

      // Upload to Cloudinary via doctor service
      const imageUrl = await doctorService.uploadDoctorAvatar(file);
      // console.log('[ImageUpload] Image uploaded successfully:', imageUrl);

      // Update preview with Cloudinary URL
      setAvatarPreview(imageUrl);
      setUploadSuccess(true);

      return imageUrl;
    } catch (err) {
      // console.error('[ImageUpload] Error uploading image:', err);
      const errorMessage = getErrorMessage(err);
      setUploadError(errorMessage);
      setAvatarPreview(null);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetUpload = (): void => {
    setAvatarPreview(initialAvatar || null);
    setIsUploadingImage(false);
    setUploadError(null);
    setUploadSuccess(false);
  };

  return {
    avatarPreview,
    isUploadingImage,
    uploadError,
    uploadSuccess,
    uploadImage,
    resetUpload,
  };
};
