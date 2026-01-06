import { Link } from 'react-router-dom';
import NotFound from '../commonComponents/NotFound';

type Doc = { id: number; name: string; avatar?: string };

const sample: Doc[] = [];

export default function DoctorsCard() {
  return (
    <div className="bg-white rounded-[10px]">
      <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px]  justify-between mb-4">
        <h3 className="font-medium text-[#010101] text-lg lg:text-[18px] leading-[140%]">Doctors</h3>
        <a href="/doctors" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="
        /icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
        {sample.length > 0 ? (
          sample.map(d => (
            <div key={d.id} className="flex items-center py-[12px] justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  <img src={d.avatar} alt={d.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-sm">{d.name}</div>
              </div>

              <Link to={`/doctors/${d.id}`} className="px-3 py-2 border border-[#E3E6EE] rounded-md text-sm inline-flex items-center gap-2">
                <img src="/icon/eye.svg" alt="view" /> <span>View Profile</span>
              </Link>
            </div>
          ))
        ) : (
          <NotFound
            title="No Doctors Yet"
            description="No doctors available at the moment."
            imageSrc="/not-found.png"
            ctaText="Add New Doctor"
            onCta={() => window.location.href = '/doctors'}
          />
        )}
      </div>
    </div>
  );
}
