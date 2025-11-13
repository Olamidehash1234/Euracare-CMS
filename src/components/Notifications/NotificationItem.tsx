import type { NotificationRow } from './NotificationList';

interface Props {
  data: NotificationRow;
  checked?: boolean;
  onToggle?: () => void;
}

const roleColor = (role?: string) => {
  // simple deterministic colors for different role tags
  switch ((role || '').toLowerCase()) {
    case 'role': return 'bg-sky-100 text-sky-700';
    case 'support': return 'bg-amber-100 text-amber-700';
    case 'admin': return 'bg-pink-100 text-pink-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

export default function NotificationItem({ data, checked = false, onToggle }: Props) {
  return (
    // unread rows get subtle background
    <tr className={`${data.read ? '' : 'bg-[#FBFDFF]'}  border-b border-[#F1F3F5]`}>
      {/* checkbox cell */}
      <td className="w-12 py-4 pl-4 pr-2 lg:align-middle lg:w-[80px]">
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </td>

      {/* main content: title + badge + message */}
      <td className="py-4 pr-4 align-middle">
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-start gap-2">
          <div className="flex items-center gap-3">
            <div className="text-[14px] leading-normal font-medium truncate lg:w-[170px] ">{data.title}</div>
            <div className={`text-[14px] px-[21px] py-1 rounded-[4px] lg:mr-[70px] leading-normal ${roleColor(data.role)}`}>{data.role}</div>
          </div>

          <div className="text-[14px] text-[#202224] lg:w-[700px] lg:truncate mt-1 lg:mt-0">{data.message}</div>
        </div>
      </td>

      {/* time cell (right aligned) */}
      <td className="py-4 pr-6 align-middle text-[14px] text-[#202224] whitespace-nowrap text-right">
        {data.time}
      </td>
    </tr>
  );
}
