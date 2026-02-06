import { useState, useEffect } from 'react';
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
import jobService from '@/services/jobService';

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
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingInitialData, setEditingInitialData] = useState<Partial<Job> | undefined>(undefined);

  // Filter states for applicants
  const [selectedRole, setSelectedRole] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Jobs and applicants
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState('');

  // Helper to extract backend message from Axios errors
  // const extractErrorMessage = (err: any) => {
  //   try {
  //     const data = err?.response?.data;
  //     if (data) {
  //       if (typeof data === 'string') return data;
  //       if (data.message) return data.message;
  //       if (data.error) return data.error;
  //       if (data.errors) return JSON.stringify(data.errors);
  //       // Sometimes the backend returns Pydantic detail array
  //       if (Array.isArray(data.detail)) return JSON.stringify(data.detail);
  //       return JSON.stringify(data);
  //     }
  //   } catch (e) {
  //     // fallback
  //   }
  //   return err?.message || 'Unknown error';
  // };

  // Convert HTML (editor output) to an object the backend accepts (dict)
  const htmlToDict = (html: string) => {
    try {
      if (!html) return {};
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // If there are list items, return as { list: [...] }
      const items: string[] = [];
      doc.querySelectorAll('li').forEach(li => {
        items.push(li.textContent?.trim() || '');
      });

      if (items.length) return { list: items };

      // If paragraph(s), return as { text: [ ... ] }
      const paras: string[] = [];
      doc.querySelectorAll('p').forEach(p => {
        const t = p.textContent?.trim();
        if (t) paras.push(t);
      });
      if (paras.length) return { text: paras };

      // Fallback - send raw HTML string inside an object so it's a dict, not a pure string
      return { html };
    } catch (e) {
      return { html };
    }
  };

  // Convert backend dict into HTML string for the editor
  const dictToHtml = (value: any) => {
    try {
      if (!value) return '';
      if (typeof value === 'string') return value;
      if (Array.isArray(value)) {
        // assume array of strings -> create list
        const items = value.map((v: any) => `<li>${String(v)}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      // check common keys
      if (value.list && Array.isArray(value.list)) {
        const items = value.list.map((v: any) => `<li>${String(v)}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      if (value.text && Array.isArray(value.text)) {
        return value.text.map((t: string) => `<p>${t}</p>`).join('');
      }

      // If object with any array value, use first array
      for (const k of Object.keys(value)) {
        if (Array.isArray(value[k])) {
          return value[k].map((t: any) => `<li>${String(t)}</li>`).join('');
        }
      }

      // Fallback: stringify into a paragraph
      return `<p>${JSON.stringify(value)}</p>`;
    } catch (e) {
      return '';
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setEditingJobId(null);
    setEditingInitialData(undefined);
    setIsModalOpen(true);
  };

  const fetchJobs = async () => {
    try {
      setIsJobsLoading(true);

      const res = await jobService.listJobs();
      // console.log('List Jobs response:', res);

      // Response shape: { success: true, data: { jobs: [...] } }
      const jobsArray = res?.data?.jobs || [];

      const mapped: Job[] = jobsArray.map((j: any) => ({
        id: j.id || j._id || j.job_id || j.jobId || String(j.id),
        department: j.department || j?.department,
        jobTitle: j.title || j.jobTitle || j.position || '',
        location: j.location || j?.location || '',
        jobType: j.type || j.jobType || j?.type || '',
        jobObjective: j.objective || j.jobObjective || j?.objective || '',
        // convert backend dict into HTML for editor display
        dutiesResponsibilities: dictToHtml(j.duties_and_responsibilities || j.dutiesResponsibilities || j?.duties_and_responsibilities || j?.dutiesResponsibilities || ''),
        qualificationsRequirements: dictToHtml(j.qualifications_and_requirements || j.qualificationsRequirements || j?.qualifications_and_requirements || j?.qualificationsRequirements || ''),
      }));

      setJobs(mapped);
    } catch (err: any) {
      // console.error('Error fetching jobs:', err, err?.response?.data);
      // set a generic error flag (don't display backend message in UI)
      setJobsError('error');
      // show user-friendly toast
      setToastType('error');
      setToastMessage('Unable to load job roles. Please try again.');
      setShowToast(true);
    } finally {
      setIsJobsLoading(false);
    }
  };

  // Fetch jobs on mount
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleModalSubmit = async (jobData: JobFormData) => {
    // map form to API payload
    const payload = {
      title: jobData.jobTitle,
      department: jobData.department,
      location: jobData.location,
      type: jobData.jobType,
      objective: jobData.jobObjective,
      // convert HTML to dict so backend accepts a JSON object
      duties_and_responsibilities: htmlToDict(jobData.dutiesResponsibilities),
      qualifications_and_requirements: htmlToDict(jobData.qualificationsRequirements),
    };

    try {
      setToastType('loading');
      setToastMessage(isEditMode ? 'Updating job...' : 'Creating job...');
      setShowToast(true);

      if (isEditMode && editingJobId) {
        await jobService.updateJob(editingJobId, payload);
        // console.log('Update job response:', res);

        // Update job in state
        setJobs(prev => prev.map(j => (j.id === editingJobId ? {
          ...j,
          department: payload.department,
          jobTitle: payload.title,
          location: payload.location,
          jobType: payload.type,
          jobObjective: payload.objective,
          dutiesResponsibilities: dictToHtml(payload.duties_and_responsibilities),
          qualificationsRequirements: dictToHtml(payload.qualifications_and_requirements),
        } : j)));

        setToastType('success');
        setToastMessage('Job updated successfully');
        setShowToast(true);
      } else {
        const res = await jobService.createJob(payload as any);
        // console.log('Create job response:', res);

        // Extract created job from response
        const created = res?.data?.job || res?.data || res;
        const newJob: Job = {
          id: created?.id || created?._id || Date.now().toString(),
          department: created?.department || payload.department,
          jobTitle: created?.title || payload.title,
          location: created?.location || payload.location,
          jobType: created?.type || payload.type,
          jobObjective: created?.objective || payload.objective,
          dutiesResponsibilities: dictToHtml(created?.duties_and_responsibilities || payload.duties_and_responsibilities),
          qualificationsRequirements: dictToHtml(created?.qualifications_and_requirements || payload.qualifications_and_requirements),
        };
        setJobs(prev => [...prev, newJob]);

        setToastType('success');
        setToastMessage('Job created successfully');
        setShowToast(true);
      }
    } catch (err: any) {
      // console.error('Error creating/updating job:', err, err?.response?.data);
      // const serverMsg = extractErrorMessage(err);
      // console.log('Backend error detail:', serverMsg);
      setToastType('error');
      setToastMessage(isEditMode ? 'Failed to update job. Please try again.' : 'Failed to create job. Please try again.');
      setShowToast(true);
    }
  };

  const handleEditJob = async (job: { id: string }) => {
    try {
      setToastType('loading');
      setToastMessage('Fetching job details...');
      setShowToast(true);
      setIsEditMode(true);
      setEditingJobId(job.id);

      const res = await jobService.getJobById(job.id);
      // console.log('Get job response:', res);
      const data = res?.data?.job || res?.data || res;

      const mapped: Partial<Job> = {
        id: data?.id || data?._id || job.id,
        department: data?.department || data?.department,
        jobTitle: data?.title || data?.jobTitle || '',
        location: data?.location || '',
        jobType: data?.type || data?.jobType || '',
        jobObjective: data?.objective || data?.jobObjective || '',
        dutiesResponsibilities: dictToHtml(data?.duties_and_responsibilities || data?.dutiesResponsibilities || ''),
        qualificationsRequirements: dictToHtml(data?.qualifications_and_requirements || data?.qualificationsRequirements || ''),
      };

      setEditingInitialData(mapped);
      setIsModalOpen(true);

      // setToastType('success');
      // setToastMessage('Job details loaded');
      setShowToast(true);
    } catch (err: any) {
      // console.error('Error fetching job by id:', err, err?.response?.data);
      // const serverMsg = extractErrorMessage(err);
      // console.log('Backend error detail:', serverMsg);
      setToastType('error');
      setToastMessage('Failed to load job details. Please try again.');
      setShowToast(true);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      setToastType('loading');
      setToastMessage('Deleting job...');
      setShowToast(true);

      await jobService.deleteJob(jobId);
      // console.log('Delete job response:', res);

      setJobs(prev => prev.filter(j => j.id !== jobId));

      setToastType('success');
      setToastMessage('Job deleted successfully');
      setShowToast(true);
    } catch (err: any) {
      // console.error('Error deleting job:', err, err?.response?.data);
      // const serverMsg = extractErrorMessage(err);
      // console.log('Backend error detail:', serverMsg);
      setToastType('error');
      setToastMessage('Failed to delete job. Please try again.');
      setShowToast(true);
    }
  };

  // Fetch applicants when applicants tab is active
  const fetchApplicants = async () => {
    try {
      setIsApplicantsLoading(true);

      const res = await jobService.listJobApplications();
      // console.log('List job applications response:', res);
      // Response shape: { success: true, data: { job_applications: [...], meta: {...} } }
      const appsArray = res?.data?.job_applications || [];

      const mapped = appsArray.map((a: any) => ({
        id: a.id || a._id || a.application_id || String(a.id),
        name: `${a.first_name || ''} ${a.last_name || ''}`.trim() || a.name || a.applicant_name || '',
        email: a.email || a.applicant_email || '',
        phone: a.phone || a.phone_number || a.dob || '',
        degree: a.degree || a.applicant_degree || '',
        role: a.role || a.job_title || '',
        appliedDate: a.created_at || a.applied_at || '',
        experience: a.yoe || a.experience || a.years_of_experience || '',
        employer: a.current_employer || a.employer || '',
        currentSalary: a.current_salary || '',
        expectedSalary: a.expected_salary || '',
        cvUrl: a.cv_url || a.cv || undefined,
      }));

      setApplicants(mapped);
    } catch (err: any) {
      console.error('Error fetching applicants:', err, err?.response?.data);
      setApplicantsError('error');
      // show user-friendly toast
      setToastType('error');
      setToastMessage('Unable to load applicants. Please try again.');
      setShowToast(true);
    } finally {
      setIsApplicantsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applicants') {
      fetchApplicants();
    }
  }, [activeTab]);

  const handleDownloadCv = async (applicantId: string) => {
    try {
      setToastType('loading');
      setToastMessage('Downloading CV...');
      setShowToast(true);

      const res = await jobService.downloadCv(applicantId);
      // console.log('Download CV response:', res);
      const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const disposition = res.headers['content-disposition'] || '';
      const fileNameMatch = disposition.match(/filename="?([^;"]+)"?/);
      const fileName = fileNameMatch ? fileNameMatch[1] : `cv-${applicantId}.pdf`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setToastType('success');
      setToastMessage('CV downloaded');
      setShowToast(true);
    } catch (err: any) {
      // console.error('Error downloading CV:', err, err?.response?.data);
      // const serverMsg = extractErrorMessage(err);
      // console.log('Backend error detail:', serverMsg);
      setToastType('error');
      setToastMessage('Failed to download CV. Please try again.');
      setShowToast(true);
    }
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
        isEdit={isEditMode}
        initialData={editingInitialData}
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
            {isJobsLoading ? (
              <LoadingSpinner heightClass="py-[200px]" />
            ) : jobsError ? (
              <NotFound
                title="Error Loading Jobs"
                description={'Unable to load job roles. Please try again.'}
                imageSrc="/not-found.png"
                ctaText="Try Again"
                onCta={() => { setJobsError(''); fetchJobs(); }}
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
                    options={Array.from(new Set(applicants.map(app => app.role)))
                      .map(role => ({ label: role, value: role }))}
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
                  className="text-[#FF453A] flex items-center gap-[4px] font-medium text-sm hover:text-red-700 whitespace-nowrap"
                >
                  <img src="/icon/retry.svg" alt="" />
                  Reset Filter
                </button>
              </div>
            </div>

            {/* Content based on loading/error/data state */}
            {isApplicantsLoading ? (
              <LoadingSpinner heightClass="py-[200px]" />
            ) : applicantsError ? (
              <NotFound
                title="Error Loading Applicants"
                description={'Unable to load applicants. Please try again.'}
                imageSrc="/not-found.png"
                ctaText="Try Again"
                onCta={() => { setApplicantsError(''); fetchApplicants(); }}
              />
            ) : applicants.length > 0 ? (
              <ApplicantsTable
                applicants={applicants}
                searchTerm={searchTerm}
                isLoading={isApplicantsLoading}
                onDownload={handleDownloadCv}
                selectedRole={selectedRole}
                fromDate={fromDate}
                toDate={toDate}
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
