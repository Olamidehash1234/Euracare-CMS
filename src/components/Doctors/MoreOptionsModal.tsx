import React from 'react';

interface MoreOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  style?: React.CSSProperties;
}

const MoreOptionsModal: React.FC<MoreOptionsModalProps> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  style 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0" 
        onClick={onClose}
      />
      <div 
        className="absolute z-50 bg-white  border border-[#B9B9B9] overflow-hidden rounded-lg shadow-lg min-w-[200px]"
        style={style}
      >
        <button
          onClick={onEdit}
          className="w-full px-4 py-[14px] text-center text-sm hover:bg-gray-50 flex justify-center items-center gap-2"
        >
          {/* <img src="/icon/edit.svg" alt="" className="w-4 h-4" /> */}
          Update Profile
        </button>

        <div className='h-[1px] bg-[#B9B9B9]'></div>
        <button
          onClick={onDelete}
          className="w-full px-4 py-[14px] overflow-hidden text-center justify-center text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
        >
          {/* <img src="/icon/delete.svg" alt="" className="w-4 h-4" /> */}
          Delete Profile
        </button>
      </div>
    </>
  );
};

export default MoreOptionsModal;