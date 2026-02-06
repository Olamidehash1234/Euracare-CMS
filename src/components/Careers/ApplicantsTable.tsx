import { useEffect, useState } from 'react';

export interface Applicant {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    degree: string;
    appliedDate: string;
    experience: string;
    employer: string;
    currentSalary: string;
    expectedSalary: string;
    cvUrl?: string;
}

interface ApplicantsTableProps {
    applicants?: Applicant[];
    isLoading?: boolean;
    searchTerm?: string;
    onDownload?: (applicantId: string) => void;
    selectedRole?: string;
    fromDate?: string;
    toDate?: string;
}

export default function ApplicantsTable({ 
    applicants = [], 
    isLoading = false, 
    searchTerm = '', 
    onDownload,
    selectedRole = '',
    fromDate = '',
    toDate = ''
}: ApplicantsTableProps) {
    const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>(applicants);

    useEffect(() => {
        let result = applicants;

        // Filter by search term (name or role)
        if (searchTerm) {
            result = result.filter(app =>
                app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by selected role
        if (selectedRole) {
            result = result.filter(app => app.role === selectedRole);
        }

        // Filter by date range (appliedDate)
        if (fromDate || toDate) {
            result = result.filter(app => {
                const appliedTime = new Date(app.appliedDate).getTime();
                const fromTime = fromDate ? new Date(fromDate).getTime() : 0;
                const toTime = toDate ? new Date(toDate).getTime() : Infinity;
                
                return appliedTime >= fromTime && appliedTime <= toTime;
            });
        }

        setFilteredApplicants(result);
    }, [searchTerm, applicants, selectedRole, fromDate, toDate]);

    if (isLoading) {
        return <div className="text-center py-12">Loading applicants...</div>;
    }

    if (applicants.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No applicants found</p>
            </div>
        );
    }

    if (filteredApplicants.length === 0 && (searchTerm || selectedRole || fromDate || toDate)) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No applications found for the search term or filter entered</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border rounded-[14px] px-[20px]">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="px-6 py-[30px] text-left text-sm font-semibold text-gray-700 bg-white whitespace-nowrap">Applicant Profile</th>
                        <th className="px-6 py-[30px] text-left text-sm font-semibold text-gray-700 bg-white whitespace-nowrap">Role & Applied Date</th>
                        <th className="px-6 py-[30px] text-left text-sm font-semibold text-gray-700 bg-white whitespace-nowrap">Experience & Employer</th>
                        <th className="px-6 py-[30px] text-left text-sm font-semibold text-gray-700 bg-white whitespace-nowrap">Current & Expected Salary</th>
                        <th className="px-6 py-[30px] text-left text-sm font-semibold text-gray-700 bg-white whitespace-nowrap">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplicants.map((applicant) => (
                        <tr key={applicant.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                            {/* Applicant Profile */}
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="">
                                        <img src="/svg.svg" alt="" className='w-[45px] h-[45px] object-cover'/>
                                    </div>
                                    <div className='space-y-[6px]'>
                                        <p className="font-normal text-[#010101] text-[14px]">{applicant.name}</p>
                                        <p className="text-[14px] font-[300] text-[#010101]">{applicant.email}</p>
                                        <div className='flex  items-center gap-[5px]'>
                                            <p className="text-[14px] font-normal text-[#010101]">DOB: {applicant.phone}</p>
                                            <p className='text-[13px] leading-[20px] inline-block px-[6px] py-[2px] bg-[#0046B00D] text-[#0046B0] rounded-full'>{applicant.degree}</p>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Role & Applied Date */}
                            <td className="px-6 py-5 space-y-[5px]">
                                <p className="font-normal text-[#010101] text-sm">{applicant.role}</p>
                                <p className="text-[13px] leading-[20px] text-[#010101]">{applicant.appliedDate}</p>
                            </td>

                            {/* Experience & Employer */}
                            <td className="px-6 py-5 space-y-[5px]">
                                <p className="text-[#010101] text-sm">{applicant.employer}</p>
                                <p className="text-[13px] leading-[20px] font-normal inline-block px-[8px] py-[2px] bg-[#0046B00D] text-[#0046B0] rounded-full">{applicant.experience} years of experience</p>
                            </td>

                            {/* Current & Expected Salary */}
                            <td className="px-6 py-5 space-y-[5px]">
                                <p className="font-normal text-[#010101] text-sm">₦ {parseInt(applicant.currentSalary || '0').toLocaleString()}</p>
                                <p className="text-[13px] leading-[20px] text-[#010101]">₦ {parseInt(applicant.expectedSalary || '0').toLocaleString()}</p>
                            </td>

                            {/* Action */}
                            <td className="px-6 py-5">
                                <button
                                    onClick={() => {
                                        if (applicant.cvUrl) {
                                            window.open(applicant.cvUrl, '_blank');
                                        } else {
                                            // fallback to onDownload if provided
                                            if (onDownload) onDownload(applicant.id);
                                        }
                                    }}
                                    className="text-[#010101] border border-[#E3E3E3] p-[8px] lg:pr-[15px] rounded-[3.3863px] hover:text-[#0046B0] font-normal text-sm flex items-center gap-[4px] whitespace-nowrap"
                                >
                                    <img src="/icon/download-new.svg" alt="" />
                                    Download CV
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
