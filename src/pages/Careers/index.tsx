import { useState } from 'react';
import Toast from '@/components/GlobalComponents/Toast';
import Header from '../../components/commonComponents/Header';
import SearchBar from '@/components/commonComponents/SearchBar';
import LoadingSpinner from '@/components/commonComponents/LoadingSpinner';
import NotFound from '@/components/commonComponents/NotFound';
import CustomDropdown from '@/components/commonComponents/CustomDropdown';
import AddJobModal from '@/components/Careers/AddJobModal';
import type { JobFormData } from '@/components/Careers/AddJobModal';
import JobGrid from '@/components/Careers/JobGrid';
import ApplicantsTable from '@/components/Careers/ApplicantsTable';
import type { Applicant } from '@/components/Careers/ApplicantsTable';

interface Job {
  id: string;
  department: string;
  jobTitle: string;
  location: string;
  jobType: string;
  jobObjective: string;
  dutiesResponsibilities: string;
  qualificationsRequirements: string;
}

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState<'jobRoles' | 'applicants'>('jobRoles');
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'loading'>('success');
  const [isLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states for applicants
  const [selectedRole, setSelectedRole] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Mock data - replace with API calls
  const [jobs, setJobs] = useState<Job[]>([
    // {
    //   id: '1',
    //   department: 'Clinical Services',
    //   jobTitle: 'Medical Officer',
    //   location: 'Lagos, Nigeria',
    //   jobType: 'Full Time',
    //   jobObjective: 'We are seeking a skilled Medical Officer to join our healthcare team.',
    //   dutiesResponsibilities: '<ul><li>Conduct patient consultations and diagnoses</li><li>Manage patient medical records</li><li>Collaborate with other healthcare professionals</li></ul>',
    //   qualificationsRequirements: '<ul><li>Medical degree (MBBS)</li><li>Valid medical license</li><li>3+ years of experience</li></ul>'
    // },
    // {
    //   id: '2',
    //   department: 'Clinical Services',
    //   jobTitle: 'Nurse',
    //   location: 'Lagos, Nigeria',
    //   jobType: 'Full Time',
    //   jobObjective: 'Join our nursing team to provide excellent patient care.',
    //   dutiesResponsibilities: '<ul><li>Monitor patient vital signs</li><li>Administer medications</li><li>Assist in medical procedures</li></ul>',
    //   qualificationsRequirements: '<ul><li>Nursing degree</li><li>Valid nursing license</li><li>2+ years of experience</li></ul>'
    // },
    // {
    //   id: '3',
    //   department: 'Diagnostics & Imaging',
    //   jobTitle: 'Medical Laboratory Scientist',
    //   location: 'Lagos, Nigeria',
    //   jobType: 'Full Time',
    //   jobObjective: 'We need a skilled laboratory scientist for our diagnostics department.',
    //   dutiesResponsibilities: '<ul><li>Conduct laboratory tests and analysis</li><li>Prepare specimens</li><li>Maintain laboratory equipment</li></ul>',
    //   qualificationsRequirements: '<ul><li>Laboratory Science degree</li><li>Valid certification</li><li>2+ years of experience</li></ul>'
    // },
  ]);
  
  const [applicants] = useState<Applicant[]>([
    {
      id: '1',
      name: 'Dr. Team Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      degree: 'MBBS',
      role: 'Medical Officer',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
    {
      id: '2',
      name: 'Dr. Team Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      degree: 'MBBS',
      role: 'Nurses',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
    {
      id: '3',
      name: 'Dr. Olamide Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      role: 'Radiographer',
      degree: 'MBBS',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
    {
      id: '4',
      name: 'Dr. Team Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      degree: 'MBBS',
      role: 'Quality Improvement Officer',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
    {
      id: '5',
      name: 'Dr. Team Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      degree: 'MBBS',
      role: 'Nurse Anaesthetist',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
    {
      id: '6',
      name: 'Dr. Team Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      degree: 'MBBS',
      role: 'Pharmacist',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
    {
      id: '7',
      name: 'Dr. Team Hagidokami',
      email: 'drhagidokami@email.com',
      phone: 'DOC 2025/0910',
      degree: 'MBBS',
      role: 'Medical Laboratory Scientist',
      appliedDate: '03 Nov 2025 - 12:30',
      experience: '5 years Experience',
      employer: 'General Hospital',
      currentSalary: 'Current ₦200,000',
      expectedSalary: 'Expected ₦600,000',
      cvUrl: '#'
    },
  ]);

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = (jobData: JobFormData) => {
    const newJob: Job = {
      id: Date.now().toString(),
      ...jobData,
    };
    setJobs([...jobs, newJob]);
    setToastMessage('Job opening published successfully!');
    setToastType('success');
    setShowToast(true);
  };

  const handleEditJob = (job: { id: string; department: string; jobTitle: string; location: string; jobType: string }) => {
    console.log('Edit job:', job);
    // Implement edit functionality
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(j => j.id !== jobId));
    setToastMessage('Job deleted successfully!');
    setToastType('success');
    setShowToast(true);
  };

  return (
    <section>
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onHide={() => setShowToast(false)}
      />
      
      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <Header title="Careers" />
      
      {/* bottom section */}
      <div className="p-[16px] lg:p-[40px]">
        {/* Tabs Section */}
        <div className="flex items-center border-b border-gray-200 mb-[22px]">
          <button
            onClick={() => setActiveTab('jobRoles')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'jobRoles'
                ? 'text-[#0C2141] border-b-2 border-[#0C2141]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Job Roles ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applicants')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'applicants'
                ? 'text-[#0C2141] border-b-2 border-[#0C2141]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Applicants
          </button>
        </div>

        {/* Job Roles Tab Content */}
        {activeTab === 'jobRoles' && (
          <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
            {/* Search and Add Button */}
            <div className="flex items-center flex-col lg:flex-row gap-[20px] justify-between mb-[22px]">
              <button
                onClick={handleAdd}
                className="flex items-center order-1 lg:order-2 ml-auto lg:ml-0 lg:w-auto gap-2 px-6 py-[9px] lg:py-[13px] lg:px-[20px] rounded-full bg-[#0C2141] text-white text-sm font-medium hover:bg-[#0a1a2f] transition"
              >
                <span className="text-lg">+</span> Add New Job
              </button>

              <div className="flex items-center w-full lg:w-1/2 order-2 lg:order-1">
                <SearchBar
                  placeholder="Search for a Job Title"
                  value={searchTerm}
                  onSearch={setSearchTerm}
                />
              </div>
            </div>

            {/* Content based on loading/error/data state */}
            {isLoading ? (
              <LoadingSpinner heightClass="py-[200px]" />
            ) : error ? (
              <NotFound
                title="Error Loading Jobs"
                description={error}
                imageSrc="/not-found.png"
                ctaText="Try Again"
                onCta={() => setError('')}
              />
            ) : jobs.length > 0 ? (
              <JobGrid
                jobs={jobs}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ) : (
              <NotFound
                title="No Job Roles Yet"
                description={`It looks like you haven't added any job roles yet. Once Added, they'll appear here for you to manage.`}
                imageSrc="/not-found.png"
                ctaText="Add New Job"
                onCta={handleAdd}
              />
            )}
          </div>
        )}

        {/* Applicants Tab Content */}
        {activeTab === 'applicants' && (
          <div className="bg-white rounded-[14px] p-6 lg:px-[20px] lg:py-[23px] shadow-sm border border-gray-200">
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-[22px] flex-col lg:flex-row gap-[20px]">
              <div className="flex items-center w-full lg:w-auto">
                <SearchBar
                  placeholder="Search Applicant Name"
                  value={searchTerm}
                  onSearch={setSearchTerm}
                  className='w-full lg:w-[350px]'
                />
              </div>
              <div className="flex items-center gap-3 lg:gap-[16px] flex-wrap">
                {/* Role Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Role:</span>
                  <CustomDropdown
                    options={[
                      { label: 'Medical Officer', value: 'Medical Officer' },
                      { label: 'Nurses', value: 'Nurses' },
                      { label: 'Radiographer', value: 'Radiographer' },
                      { label: 'Quality Improvement Officer', value: 'Quality Improvement Officer' },
                      { label: 'Nurse Anaesthetist', value: 'Nurse Anaesthetist' },
                      { label: 'Pharmacist', value: 'Pharmacist' },
                      { label: 'Medical Laboratory Scientist', value: 'Medical Laboratory Scientist' },
                    ]}
                    value={selectedRole}
                    onChange={setSelectedRole}
                    placeholder="Select Role"
                    className="w-[180px]"
                  />
                </div>

                {/* From Date */}
                <div className="flex items-center border border-gray-300 gap-2 rounded-lg px-3 py-2 lg:py-[10px]">
                  <span className="text-sm text-gray-600">From:</span>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="focus:outline-none focus:ring-none text-sm"
                  />
                </div>

                {/* To Date */}
                <div className="flex items-center border border-gray-300 gap-2 rounded-lg px-3 py-2 lg:py-[10px]">
                  <span className="text-sm text-gray-600">To:</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="focus:outline-none focus:ring-none text-sm"
                  />
                </div>

                {/* Reset Filter Button */}
                <button 
                  onClick={() => {
                    setSelectedRole('');
                    setFromDate('');
                    setToDate('');
                    setSearchTerm('');
                  }}
                  className="text-red-600 font-medium text-sm hover:text-red-700 whitespace-nowrap"
                >
                  Reset Filter
                </button>
              </div>
            </div>

            {/* Content based on loading/error/data state */}
            {isLoading ? (
              <LoadingSpinner heightClass="py-[200px]" />
            ) : error ? (
              <NotFound
                title="Error Loading Applicants"
                description={error}
                imageSrc="/not-found.png"
                ctaText="Try Again"
                onCta={() => setError('')}
              />
            ) : applicants.length > 0 ? (
              <ApplicantsTable
                applicants={applicants}
                searchTerm={searchTerm}
              />
            ) : (
              <NotFound
                title="No Applicants Yet"
                description={`No applications received yet. Job applicants will appear here.`}
                imageSrc="/not-found.png"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
