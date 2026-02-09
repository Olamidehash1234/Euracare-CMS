interface Props {
    onSelectAll?: () => void;
    onMarkAllRead?: () => void;
    onDelete?: () => void;
    selectedCount?: number;
    isProcessing?: boolean;
}

export default function NotificationToolbar({ onSelectAll, onMarkAllRead, onDelete, selectedCount = 0, isProcessing = false }: Props) {
    return (
        <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
            <button 
              onClick={() => onSelectAll?.()} 
              className="px-[14px] py-[12px] text-[#0C2141] disabled:opacity-50 disabled:cursor-not-allowed" 
              title="Select All"
              disabled={isProcessing}
            >
                <img src="/icon/download.svg" alt="" />
            </button>

            <button 
              onClick={() => onMarkAllRead?.()} 
              className="px-[14px] py-[12px] text-[#0C2141] disabled:opacity-50 disabled:cursor-not-allowed" 
              title="Mark All Read"
              disabled={isProcessing}
            >
                <img src="/icon/info.svg" alt="" />
            </button>

            <button 
              onClick={() => onDelete?.()} 
              className={`px-[14px] py-[12px] disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedCount > 0 && !isProcessing 
                  ? 'text-[#EF4444]' 
                  : 'text-[#CCCCCC] cursor-not-allowed'
              }`}
              title={selectedCount > 0 ? `Delete ${selectedCount} selected` : "Select notifications to delete"}
              disabled={selectedCount === 0 || isProcessing}
            >
                <img src="/icon/delete-black.svg" alt="" />
            </button>
        </div>
    );
}
