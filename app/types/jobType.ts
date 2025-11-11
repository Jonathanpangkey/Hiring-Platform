export type JobStatus = "active" | "inactive" | "draft";
export type FieldValidation = "mandatory" | "optional" | "off";

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  display_text?: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  validation: FieldValidation;
  order: number;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  type: string;
  department: string;
  status: JobStatus;
  candidates_needed: number;
  salary_range: SalaryRange;
  description?: string;
  created_at: string;
  application_form: {
    sections: {
      title: string;
      fields: FieldConfig[];
    }[];
  };
}

export interface Candidate {
  id: string;
  job_id: string;
  photo_url: string;
  attributes: {
    key: string;
    label: string;
    value: string;
    order: number;
  }[];
  applied_date: string;
}

export interface FormField {
  key: string;
  label: string;
  validation: "mandatory" | "optional" | "off";
}

export interface FormData {
  full_name: string;
  date_of_birth: string;
  gender: string;
  domicile: string;
  phone_number: string;
  email: string;
  linkedin_link: string;
  photo_profile: File | null;
}

export interface CountryCode {
  id: number;
  code: string;
  country: string;
  flag: string;
}

export interface Province {
  id: number;
  name: string;
}

export interface JobStore {
  jobs: Job[];
  addJob: (job: Omit<Job, "id" | "created_at">) => void;
  updateJob: (id: string, job: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  getJobById: (id: string) => Job | undefined;
  getActiveJobs: () => Job[];
  setJobStatus: (id: string, status: "active" | "inactive" | "draft") => void;
  getDraftJobs: () => Job[];
  getInactiveJobs: () => Job[];
  getJobsByStatus: (status: "active" | "inactive" | "draft") => Job[];
}

export interface CandidateStore {
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, "id" | "applied_date">) => void;
  getCandidatesByJobId: (jobId: string) => Candidate[];
  updateCandidate: (id: string, candidate: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
}
