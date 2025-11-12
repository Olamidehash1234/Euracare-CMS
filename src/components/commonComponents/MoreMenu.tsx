import { useEffect, useRef } from 'react';

interface MoreMenuProps {
  onManageMembers?: () => void;
  onManagePermission?: () => void;
  onClose?: () => void;
}

export default function MoreMenu({ onManageMembers, onManagePermission, onClose }: MoreMenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleClick = (cb?: () => void) => {
    cb?.();
    onClose?.();
  };

  useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      const target = e.target as Node;
      if (!el.contains(target)) onClose?.();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div ref={rootRef} className="absolute right-2 mt-2 z-20" role="dialog" aria-modal="false">
      <div className="max-w-[220px] bg-white border border-gray-200 rounded-[10px] shadow-lg overflow-hidden p-[4px]">
        <button
          onClick={() => handleClick(onManageMembers)}
          className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-[#0C214133] text-[14px] text-[#010101]"
        >
          Manage Members
        </button>
        <button
          onClick={() => handleClick(onManagePermission)}
          className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-[#0C214133] text-[14px] text-[#010101]"
        >
          Manage Permission
        </button>
      </div>
    </div>
  );
}
