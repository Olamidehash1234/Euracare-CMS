import React from 'react';

interface AvatarUploadProps {
  preview: string | null;
  isUploading: boolean;
  disabled?: boolean;
  buttonLabel?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AvatarUpload({
  preview,
  isUploading,
  disabled = false,
  buttonLabel = 'Tap to change image',
  onFileChange,
}: AvatarUploadProps): React.ReactElement {
  return (
    <div className="flex-shrink-0 justify-center flex flex-col items-center">
      <div className="w-24 h-24 z-30 lg:w-[100px] lg:h-[100px] rounded-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full z-40">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {preview ? (
          // eslint-disable-next-line
          <img src={preview} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="text-[#01010180]"><img src="/test-avatar.png" alt="" /></div>
        )}
      </div>

      <label
        htmlFor="avatar"
        className={`mt-[-1px] z-10 inline-block text-[10px] bg-[#0C2141] text-[#F8F8F8] px-3 lg:px-[17px] py-[5px] rounded-full cursor-pointer text-center shadow-sm ${
          isUploading || disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? 'Uploading...' : buttonLabel}
      </label>
      <input
        id="avatar"
        onChange={onFileChange}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isUploading || disabled}
      />
    </div>
  );
}
