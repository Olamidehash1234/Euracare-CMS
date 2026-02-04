import { useState, useRef, useEffect } from 'react';
import TiptapEditor from '../Editor/TiptapEditor';
import CustomDropdown from '../commonComponents/CustomDropdown';

interface AddJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (jobData: JobFormData) => void;
}

export interface JobFormData {
    jobTitle: string;
    department: string;
    location: string;
    jobType: string;
    jobObjective: string;
    dutiesResponsibilities: string;
    qualificationsRequirements: string;
}

export default function AddJobModal({ isOpen, onClose, onSubmit }: AddJobModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<JobFormData>({
        jobTitle: '',
        department: '',
        location: '',
        jobType: 'Full Time',
        jobObjective: '',
        dutiesResponsibilities: '',
        qualificationsRequirements: '',
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditorChange = (field: 'dutiesResponsibilities' | 'qualificationsRequirements', content: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: content,
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        setFormData({
            jobTitle: '',
            department: '',
            location: '',
            jobType: 'Full Time',
            jobObjective: '',
            dutiesResponsibilities: '',
            qualificationsRequirements: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-[20px] scrollbar-hide w-full max-w-[862px] max-h-[90vh] overflow-y-auto">

                <div className='border-b mb-6 sticky top-0 bg-white z-[100] flex items-center justify-between px-[40px] py-[20px]'>
                    <h2 className="text-2xl lg:text-[20px] font-medium text-[#010101] leading-[20px]">Add New Job</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 transition"
                        title="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5 m-[40px] border p-[30px] rounded-[10px]">
                    {/* Row 1: Job Title and Department */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[15px] font-normal text-[#010101] mb-2">Job Title</label>
                            <input
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="e.g Medical Officer"
                                className="w-full px-4 text-[15px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-[1px] focus:ring-[#0C2141CC] focus:border-transparent placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-[15px] font-normal text-[#010101] mb-2">Department</label>
                            <CustomDropdown
                                options={[
                                    { label: 'Clinical Services', value: 'Clinical Services' },
                                    { label: 'Administrative', value: 'Administrative' },
                                    { label: 'Support Services', value: 'Support Services' },
                                ]}
                                value={formData.department}
                                onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                                placeholder="Clinical Services"
                                className="w-full z-[90]"
                            />
                        </div>
                    </div>

                    {/* Row 2: Location and Job Type */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[15px] font-normal text-[#010101] mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g Lagos, Nigeria"
                                className="w-full px-4 text-[15px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-[1px] focus:ring-[#0C2141CC] focus:border-transparent placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-[15px] font-normal text-[#010101] mb-2">Job Type</label>
                            <CustomDropdown
                                options={[
                                    { label: 'Full Time', value: 'Full Time' },
                                    { label: 'Part Time', value: 'Part Time' },
                                    { label: 'Contract', value: 'Contract' },
                                    { label: 'Temporary', value: 'Temporary' },
                                ]}
                                value={formData.jobType}
                                onChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
                                placeholder="Full Time"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Job Objective */}
                    <div>
                        <label className="block text-[15px] font-normal text-[#010101] mb-2">Job Objective</label>
                        <textarea
                            name="jobObjective"
                            value={formData.jobObjective}
                            onChange={handleInputChange}
                            placeholder="Brief summary of the role..."
                            rows={4}
                            className="w-full px-4 text-[15px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-[1px] focus:ring-[#0C2141CC] focus:border-transparent placeholder-gray-400 resize-none"
                        />
                    </div>

                    {/* Two column layout for editors */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Duties & Responsibilities */}
                        <div>
                            <label className="block text-[15px] font-normal text-[#010101] mb-2">Duties & Responsibilities</label>
                            <div className="rounded-lg overflow-hidden">
                                <TiptapEditor
                                    content={formData.dutiesResponsibilities}
                                    onChange={(content) => handleEditorChange('dutiesResponsibilities', content)}
                                    placeholder="Wellness about the Doctor"
                                />
                            </div>
                        </div>

                        {/* Qualifications & Requirements */}
                        <div>
                            <label className="block text-[15px] font-normal text-[#010101] mb-2">Qualifications & Requirements</label>
                            <div className="rounded-lg overflow-hidden">
                                <TiptapEditor
                                    content={formData.qualificationsRequirements}
                                    onChange={(content) => handleEditorChange('qualificationsRequirements', content)}
                                    placeholder="Wellness about the Doctor"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="pt-6 flex justify-center">
                        <button
                            type="submit"
                            className="w-full px-8 py-3 bg-[#0C2141] text-white rounded-full font-semibold hover:bg-[#0a1a2f] transition text-center"
                        >
                            Publish Job Opening
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
