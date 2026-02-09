import React, { useMemo, useState } from 'react';
import NotificationItem from './NotificationItem';
import { useNotifications } from '@/context/NotificationContext';

export type NotificationRow = {
  id: string;
  title: string;
  role?: string;
  message?: string;
  time?: string;
  read?: boolean;
};

interface Props {
  search?: string;
  selectAll?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NotificationList({ search = '', selectAll = false, onSelectionChange, onMarkAsRead, onDelete }: Props) {
  const { notifications } = useNotifications();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(
    () => notifications.filter(s => {
      if (!search) return true;
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.message?.toLowerCase().includes(q) || (s.role || '').toLowerCase().includes(q);
    }),
    [search, notifications]
  );

  // when selectAll toggles, update selected map
  React.useEffect(() => {
    if (selectAll) {
      const all: Record<string, boolean> = {};
      filtered.forEach(f => all[f.id] = true);
      setSelected(all);
      onSelectionChange?.(filtered.map(f => f.id));
    } else {
      setSelected({});
      onSelectionChange?.([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll, filtered]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      const selectedIds = Object.entries(updated)
        .filter(([_, isSelected]) => isSelected)
        .map(([id, _]) => id);
      onSelectionChange?.(selectedIds);
      return updated;
    });
  };

  return (
    <div className="max-h-[570px] overflow-y-auto w-full">
      <table className="w-full table-auto">
        <tbody>
          {filtered.map(n => (
            <NotificationItem
              key={n.id}
              data={n}
              checked={!!selected[n.id]}
              onToggle={() => toggle(n.id)}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-sm text-gray-500">No notifications found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
