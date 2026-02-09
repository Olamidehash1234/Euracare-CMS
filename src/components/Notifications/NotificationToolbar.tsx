interface Props {
    onSelectAll?: () => void;
    onMarkAllRead?: () => void;
    onDelete?: () => void;
    selectedCount?: number;
}

export default function NotificationToolbar({ onSelectAll, onMarkAllRead, onDelete, selectedCount = 0 }: Props) {
    return (
        <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
            <button onClick={() => onSelectAll?.()} className="px-[14px] py-[12px] text-[#0C2141]" title="Select All">
                <img src="/icon/download.svg" alt="" />
            </button>

            <button onClick={() => onMarkAllRead?.()} className="px-[14px] py-[12px] text-[#0C2141]" title="Mark All Read">
                <img src="/icon/info.svg" alt="" />
            </button>

            <button 
              onClick={() => onDelete?.()} 
              className={`px-[14px] py-[12px] ${selectedCount > 0 ? 'text-[#EF4444]' : 'text-[#CCCCCC] cursor-not-allowed'}`}
              title={selectedCount > 0 ? `Delete ${selectedCount} selected` : "Select notifications to delete"}
              disabled={selectedCount === 0}
            >
                <img src="/icon/delete-black.svg" alt="" />
            </button>
        </div>
    );
}
