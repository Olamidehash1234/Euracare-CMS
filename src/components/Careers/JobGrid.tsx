interface JobCard {
    id: string;
    department: string;
    jobTitle: string;
    location: string;
    jobType: string;
}

interface JobGridProps {
    jobs?: JobCard[];
    onEdit?: (job: JobCard) => void;
    onDelete?: (jobId: string) => void;
}

export default function JobGrid({ jobs = [], onEdit, onDelete }: JobGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="border border-gray-300 rounded-[20px] p-5 hover:shadow-md transition cursor-pointer bg-white flex flex-col justify-between"
                >
                    {/* top div */}
                    <div className="flex items-center justify-between mb-[14px]">
                        <div className="flex items-center">
                            <span className="inline-block px-3 py-1 bg-[#0046B00D] text-[#0046B0] rounded-full text-[14px] font-normal leading-[27px]">
                                {job.department}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-[0px] border border-[#D5D5D5] bg-[#FAFBFD] w-max rounded-[12px] divide-x">
                            <button onClick={() => onEdit?.(job)} className="px-[8px] py-[8px] text-[#0C2141]" title="Edit">
                                <img src="/icon/edit.svg" alt="Edit" className="w-[18px] h-[18px]"/>
                            </button>
                            <button onClick={() => onDelete?.(job.id)} className="px-[8px] py-[8px] text-[#EF4444]" title="Delete">
                                <img src="/icon/delete.svg" alt="Delete" className="w-[18px] h-[18px]"/>
                            </button>
                        </div>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-[16px] font-medium leading-[28px] text-[#0C2141] mb-4 uppercase truncate">
                        {job.jobTitle}
                    </h3>

                    {/* Location and Type Info */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                        <div className="flex items-center gap-1 font-normal text-[14px] leading-[27px] lg:text-sm text-[#0C2141]">
                            <img src="/icon/location.svg" alt="" />
                            <span>{job.location}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[14px] lg:text-sm text-[#0C2141]">
                            <span className="text-[#D9D9D9] font-bold flex-shrink-0">•</span>
                            <span className="font-[300] leading-[20px]">{job.jobType}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
