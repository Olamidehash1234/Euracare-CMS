/**
 * Cloudinary Service
 * Handles image uploads to Cloudinary
 */

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export interface CloudinaryUploadError {
  message: string;
  status?: number;
}

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnycq9llb';
const ALLOWED_FORMATS = ['jpg', 'png', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Validate file type before upload
 */
const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size (max 5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Only ${ALLOWED_FORMATS.join(', ')} formats are allowed` 
    };
  }

  return { valid: true };
};

/**
 * Upload image to Cloudinary using FormData
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'euracare'
): Promise<CloudinaryUploadResponse> => {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'euracare_unsigned');
  formData.append('folder', folder);
  
  // Add transformations for quality optimization
  formData.append('quality', 'auto:good');
  formData.append('fetch_format', 'auto');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();

    return {
      secure_url: data.secure_url,
      public_id: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (error) {
    console.error('[CloudinaryService] Upload error:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  console.log('[CloudinaryService] Deleting image:', publicId);
  // Note: This requires a signed request with API key and secret
  // For now, we'll just log it - implement server-side deletion if needed
};

/**
 * Get optimized Cloudinary URL with transformations
 */
export const getOptimizedUrl = (
  url: string,
  width?: number,
  height?: number
): string => {
  if (!url || !url.includes('cloudinary')) {
    return url;
  }

  // Extract public_id from URL and reconstruct with transformations
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex !== -1) {
      const transformation = [];
      if (width) transformation.push(`w_${width}`);
      if (height) transformation.push(`h_${height}`);
      transformation.push('q_auto', 'f_auto');

      pathParts.splice(uploadIndex + 1, 0, transformation.join(','));
      urlObj.pathname = pathParts.join('/');
      return urlObj.toString();
    }
  } catch (error) {
    console.error('[CloudinaryService] URL optimization error:', error);
  }

  return url;
};
