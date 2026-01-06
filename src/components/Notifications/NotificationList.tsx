import React, { useMemo, useState } from 'react';
import NotificationItem from './NotificationItem';

export type NotificationRow = {
  id: number;
  title: string;
  role?: string;
  message?: string;
  time?: string;
  read?: boolean;
};

const sampleData: NotificationRow[] = [];

interface Props {
  search?: string;
  selectAll?: boolean;
}

export default function NotificationList({ search = '', selectAll = false }: Props) {
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const filtered = useMemo(
    () => sampleData.filter(s => {
      if (!search) return true;
      const q = search.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.message?.toLowerCase().includes(q) || (s.role || '').toLowerCase().includes(q);
    }),
    [search]
  );

  // when selectAll toggles, update selected map
  React.useEffect(() => {
    if (selectAll) {
      const all: Record<number, boolean> = {};
      filtered.forEach(f => all[f.id] = true);
      setSelected(all);
    } else {
      setSelected({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll, filtered]);

  const toggle = (id: number) => setSelected(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="max-h-[560px] overflow-auto">
      <table className="w-full table-auto">
        <tbody>
          {filtered.map(n => (
            <NotificationItem
              key={n.id}
              data={n}
              checked={!!selected[n.id]}
              onToggle={() => toggle(n.id)}
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
