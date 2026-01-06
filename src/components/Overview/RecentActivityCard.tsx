import NotFound from '../commonComponents/NotFound';

type Activity = { id: number; icon: string; title: string; subtitle?: string; time?: string };

const sample: Activity[] = [];

export default function RecentActivityCard() {
  return (
    <div className="bg-white rounded-[10px]">
      <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px]  justify-between mb-4">
        <h3 className="font-medium text-lg lg:text-[18px] leading-[140%]">Recent activity</h3>
        <a href="/logs" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all logs <span className="ml-1"><img src="
        /icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {sample.length > 0 ? (
          sample.map(a => (
            <div key={a.id} className="py-3 flex gap-4 items-start">
              <div className="flex items-center justify-center">
                <img src={a.icon} alt="" className="w-full h-full" />
              </div>
              <div>
                <div className="text-sm">{a.title}</div>
                {a.subtitle && <div className="text-xs text-gray-500 mt-1">{a.subtitle}</div>}
              </div>
            </div>
          ))
        ) : (
          <NotFound
            title="No Activity Yet"
            description="No recent activity available."
            imageSrc="/not-found.png"
            ctaText="View All Logs"
            onCta={() => window.location.href = '/logs'}
          />
        )}
      </div>
    </div>
  );
}
