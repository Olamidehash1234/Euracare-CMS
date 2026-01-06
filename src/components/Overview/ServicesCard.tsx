import NotFound from '../commonComponents/NotFound';

type ServiceItem = { id: number; title: string; image?: string };

const sample: ServiceItem[] = [];

export default function ServicesCard() {
    return (
        <div className="bg-white rounded-[10px]">
      <div className="flex items-center border-b p-5 lg:px-[20px] lg:py-[16px]  justify-between mb-4">
        <h3 className="font-semibold text-lg lg:text-[18px] leading-[140%]">Services</h3>
        <a href="/services" className="text-[14px] items-center flex leading-[140%] font-medium text-[#0C2141]">View all <span className="ml-1"><img src="
        /icon/right1.svg" alt="" /></span></a>
      </div>

      <div className="divide-y p-5 lg:px-[20px] lg:pb-[10px] lg:pt-0">
                {sample.length > 0 ? (
                    sample.map(s => (
                        <div key={s.id} className="flex items-center py-[12px] justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100">
                                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-sm">{s.title}</div>
                            </div>

                            <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                                <button className="px-[12px] py-[10px] text-[#0C2141]" title="View">
                                    <img src="/icon/eye.svg" alt="View" />
                                </button>

                                <button className="px-[12px] py-[10px] text-[#0C2141]" title="Edit">
                                    <img src="/icon/edit.svg" alt="Edit" />
                                </button>

                                <button className="px-[12px] py-[10px] text-[#EF4444]" title="Delete">
                                    <img src="/icon/delete.svg" alt="Delete" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <NotFound
                        title="No Services Yet"
                        description="No services available at the moment."
                        imageSrc="/not-found.png"
                        ctaText="Add New Service"
                        onCta={() => window.location.href = '/services'}
                    />
                )}
            </div>
        </div>
    );
}
