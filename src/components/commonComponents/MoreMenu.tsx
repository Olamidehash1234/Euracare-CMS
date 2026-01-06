import { useEffect, useRef } from 'react';

interface MoreMenuProps {
  onManageMembers?: () => void;
  onManagePermission?: () => void;
  onSuspendUser?: () => void;
  onDeleteRole?: () => void;
  onViewActivity?: () => void;
  onClose?: () => void;
  menuClassName?: string; // optional override for menu width / styling
}

export default function MoreMenu({ onManageMembers, onManagePermission: _, onSuspendUser, onDeleteRole: __, onViewActivity, onClose, menuClassName }: MoreMenuProps) {
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
    <div ref={rootRef} className="absolute z-10 right-2 mt-2 z-20" role="dialog" aria-modal="false">
      <div className={`${menuClassName ?? 'max-w-[220px]'} bg-white border border-[#0C2141] rounded-[10px] shadow-lg overflow-hidden p-[4px]`}>
        {/* Render items only when a handler is provided so this menu stays flexible */}
        {onSuspendUser && (
          <button
            onClick={() => handleClick(onSuspendUser)}
            className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-[#0C214133] text-[14px] text-[#010101] flex items-center gap-2"
          >
            Suspend User
          </button>
        )}

        {onManageMembers && (
          <button
            onClick={() => handleClick(onManageMembers)}
            className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-[#0C214133] text-[14px] text-[#010101]"
          >
            Manage Members
          </button>
        )}

        {/* {onManagePermission && (
          <button
            onClick={() => handleClick(onManagePermission)}
            className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-[#0C214133] text-[14px] text-[#010101]"
          >
            Manage Permission
          </button>
        )} */}

        {/* {onDeleteRole && (
          <button
            onClick={() => handleClick(onDeleteRole)}
            className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-red-50 text-[14px] text-red-500 font-medium"
          >
            Delete Role
          </button>
        )} */}

        {onViewActivity && (
          <button
            onClick={() => handleClick(onViewActivity)}
            className="w-full text-left px-[12.5px] py-[12.5px] rounded-[8px] hover:bg-[#0C214133] text-[14px] text-[#010101]"
          >
            View Activity Log
          </button>
        )}
      </div>
    </div>
  );
}
