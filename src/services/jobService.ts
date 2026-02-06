import apiClient from './apiClient';

export interface CreateJobPayload {
  title: string;
  department: string;
  location: string;
  type: string;
  objective: string;
  // backend expects dict/object here
  duties_and_responsibilities: Record<string, any> | string;
  qualifications_and_requirements: Record<string, any> | string;
}

export interface JobResponse {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  objective: string;
  duties_and_responsibilities: Record<string, any> | string;
  qualifications_and_requirements: Record<string, any> | string;
}

const listJobs = async () => {
  const res = await apiClient.get('/jobs');
  return res.data;
};

const createJob = async (payload: CreateJobPayload) => {
  const res = await apiClient.post('/jobs/', payload);
  return res.data;
};

const getJobById = async (id: string) => {
  const res = await apiClient.get(`/jobs/${id}/`);
  return res.data;
};

const updateJob = async (id: string, payload: Partial<CreateJobPayload>) => {
  const res = await apiClient.put(`/jobs/${id}`, payload);
  return res.data;
};

const deleteJob = async (id: string) => {
  const res = await apiClient.delete(`/jobs/${id}`);
  return res.data;
};

const listJobApplications = async () => {
  const res = await apiClient.get('/jobs/applications');
  return res.data;
};

const downloadCv = async (applicationId: string) => {
  // The API docs show a download endpoint - try sending as query param
  const res = await apiClient.get(`/jobs/applications/download-cv`, {
    params: {
      application_id: applicationId,
    },
    responseType: 'blob',
  });
  return res;
};

export default {
  listJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
  listJobApplications,
  downloadCv,
};
