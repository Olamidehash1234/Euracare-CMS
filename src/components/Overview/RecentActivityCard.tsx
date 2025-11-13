type Activity = { id: number; icon: string; title: string; subtitle?: string; time?: string };

const sample: Activity[] = [
  { id: 1, icon: '/icon/update.png', title: "Updated 'Waiting Times' section with Q4 2025 data.", subtitle: 'Just now' },
  { id: 2, icon: '/icon/login.png', title: 'Successful login from IP: 192.168.1.55', subtitle: '1 hour ago' },
  { id: 3, icon: '/icon/phone.png', title: 'Updated phone number and added a new certification image.', subtitle: '2 hours ago' },
  { id: 4, icon: '/icon/phone.png', title: "Changed role from 'Content Editor' to 'Department Manager'.", subtitle: '2 hours ago' },
  { id: 5, icon: '/icon/warning.png', title: "Uploaded 'New_Facility_Wing.jpg' (3.2MB).", subtitle: 'Yesterday' },
];

export default function RecentActivityCard() {
  return (
    <div className="bg-white rounded-[10px]">
      <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px]  justify-between mb-4">
        <h3 className="font-medium text-lg lg:text-[18px] leading-[140%]">Recent activity</h3>
        <a href="/logs" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all logs <span className="ml-1"><img src="
        /icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {sample.map(a => (
          <div key={a.id} className="py-3 flex gap-4 items-start">
            <div className="flex items-center justify-center">
              <img src={a.icon} alt="" className="w-full h-full" />
            </div>
            <div>
              <div className="text-sm">{a.title}</div>
              {a.subtitle && <div className="text-xs text-gray-500 mt-1">{a.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
