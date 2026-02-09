import ActivityLogsNotFound from '../commonComponents/ActivityLogsNotFound';

export type ActivityRow = {
  id?: string | number;
  timestamp?: string;
  actor?: string;
  role?: string;
  action?: string;
  details?: string;
  ip?: string;
};

interface Props {
  activities?: ActivityRow[];
}

export default function ActivityTable({ activities = [] }: Props) {
  return (
    <div className="overflow-x-auto w-full border-[0.3px] border-[#B9B9B9] rounded-[14px]">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-[14px] text-[#0C2141]">
              <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[160px]">Timestamp</th>
              <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[220px]">User/Actor</th>
              <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[140px]">Role</th>
              <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 w-[170px]">Action</th>
              <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4 min-w-[300px]">Details</th>
              {/* <th className="pt-[22px] pb-[25px] text-[14px] font-medium leading-[20px] px-4">IP Address</th> */}
            </tr>
          </thead>

          {activities.length > 0 ? (
            <tbody>
              {activities.map((a) => (
                <tr key={a.id ?? `${a.timestamp}-${a.actor}`} className="table-auto border-t border-[#01010133]">
                  <td className="py-[19px] px-4 text-[14px] align-middle">{a.timestamp ?? '-'}</td>
                  <td className="py-[19px] px-4 text-[14px] align-middle">{a.actor ?? '-'}</td>
                  <td className="py-[19px] px-4 text-[14px] align-middle">{a.role ?? '-'}</td>
                  <td className="py-[19px] px-4 text-[14px] align-middle">{a.action ?? '-'}</td>
                  <td className="py-[19px] px-4 text-[14px] align-middle min-w-[300px]">{a.details ?? '-'}</td>
                  {/* <td className="py-[19px] px-4 text-[14px] align-middle">{a.ip ?? '-'}</td> */}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} className="py-6 px-4 align-middle">
                  <div className="flex items-center justify-center">
                    <ActivityLogsNotFound
                      title="No Activity Logged Yet"
                      description="There are no recorded activities at this time. Logs will appear here once system events occur."
                      imageSrc="/not-found.png"
                      ctaText="Export Logs"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
