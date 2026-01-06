import React from 'react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-[15px] shadow-lg w-[90%] max-w-[380px]">
        <h2 className="text-[20px] font-semibold text-[#FF0000] text-center mb-[8px] pt-[20px]">Logout</h2>
        <p className="text-[16px] text-[#101010] text-center pb-[10px]">Are you sure you want to logout?</p>

        <div className="flex justify-center border-t divide-x border-[#e5e7eb] overflow-hidden">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 text-[16px] py-[15px] text-[#101010] font-medium hover:bg-[#e8e8e8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-bl-[15px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 text-[16px] py-[15px] text-[#101010] font-medium hover:text-white hover:bg-[#FF0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-[8px] rounded-br-[15px]"
          >
            {isLoading && <span className="inline-block animate-spin"></span>}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
