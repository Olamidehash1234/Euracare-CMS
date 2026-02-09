import type { NotificationRow } from './NotificationList';

interface Props {
  data: NotificationRow;
  checked?: boolean;
  onToggle?: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const roleColor = (role?: string) => {
  switch ((role || '').toLowerCase()) {
    case 'role': return 'bg-sky-100 text-sky-700';
    case 'support': return 'bg-amber-100 text-amber-700';
    case 'admin': return 'bg-pink-100 text-pink-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export default function NotificationItem({ data, checked = false, onToggle, onMarkAsRead, onDelete }: Props) {
  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking the checkbox
    if ((e.target as HTMLElement).closest('input[type="checkbox"]')) return;
    
    // Don't trigger if clicking outside the content area
    if ((e.target as HTMLElement).closest('button')) return;
    
    // Mark as read when clicking the row
    if (!data.read) {
      onMarkAsRead?.(data.id);
    }
  };

  return (
    // unread rows get subtle background and cursor pointer
    <tr 
      onClick={handleRowClick}
      className={`${data.read ? '' : 'bg-[#FBFDFF]'} border-b border-[#F1F3F5] ${!data.read ? 'cursor-pointer hover:bg-[#F0F8FF]' : ''}`}
    >
      {/* checkbox cell */}
      <td className="w-12 py-4 pl-4 pr-2 lg:align-middle">
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>

      {/* main content: title + badge + message */}
      <td className="py-4 pr-4 align-middle">
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-start gap-2">
          <div className="flex items-center gap-3">
            <div className="text-[14px] leading-normal font-medium truncate lg:w-[170px] ">{data.title}</div>
            <div className={`text-[14px] whitespace-nowrap px-[21px] py-1 rounded-[4px] lg:mr-[70px] leading-normal ${roleColor(data.role)}`}>{data.role}</div>
          </div>

          <div className="text-[14px] text-[#202224] lg:w-[400px] lg:truncate mt-1 lg:mt-0">{data.message}</div>
        </div>
      </td>

      {/* time cell (right aligned) */}
      <td className="py-4 pr-6 align-middle text-[14px] text-[#202224] whitespace-nowrap text-right flex items-center justify-end gap-2">
        <span>{data.time}</span>
        {!data.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead?.(data.id);
            }}
            className="text-blue-600 mt-[1px] hover:bg-blue-50 font-medium"
            title="Mark as read"
          >
            <img src="/icon/inbox.png" alt="" className='w-[24px] h-[27px]'/>
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(data.id);
          }}
          className="text-red-600 hover:bg-red-50 rounded text-xs font-medium"
          title="Delete notification"
        >
          <img src="/icon/delete.svg" alt="" />
        </button>
      </td>
    </tr>
  );
}
