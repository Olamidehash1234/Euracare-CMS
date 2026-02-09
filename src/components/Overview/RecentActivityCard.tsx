import NotFound from '../commonComponents/NotFound';

interface Activity {
  id: string;
  icon?: string;
  title: string;
  subtitle?: string;
  time?: string;
}

interface RecentActivityCardProps {
  activities?: Activity[];
  isLoading?: boolean;
}

export default function RecentActivityCard({ activities = [], isLoading = false }: RecentActivityCardProps) {
  const displayActivities = activities.slice(0, 5); // Show top 5 activities

  console.log('📌 [RecentActivityCard] Props received:', { activities, isLoading });
  console.log('📌 [RecentActivityCard] Activities count:', activities.length);
  console.log('📌 [RecentActivityCard] Display activities (first 5):', displayActivities);
  
  if (activities.length > 0) {
    console.log('📌 [RecentActivityCard] Activity item structure:', activities[0]);
    console.log('📌 [RecentActivityCard] Activity keys:', Object.keys(activities[0]));
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-[10px]">
        <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px] justify-between mb-4">
          <h3 className="font-medium text-lg lg:text-[18px] leading-[140%]">Recent activity</h3>
          <a href="/logs" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all logs <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
        </div>
        <div className="p-5 lg:px-[20px] space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[10px]">
      <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px] justify-between mb-4">
        <h3 className="font-medium text-lg lg:text-[18px] leading-[140%]">Recent activity</h3>
        <a href="/logs" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all logs <span className="ml-1"><img src="/icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {displayActivities.length > 0 ? (
          displayActivities.map(a => (
            <div key={a.id} className="py-3 flex gap-4 items-start">
              {a.icon && (
                <div className="flex items-center justify-center flex-shrink-0">
                  <img src={a.icon} alt="" className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{a.title}</div>
                {a.subtitle && <div className="text-xs text-gray-500 mt-1 truncate">{a.subtitle}</div>}
                {a.time && <div className="text-xs text-gray-400 mt-1">{a.time}</div>}
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
