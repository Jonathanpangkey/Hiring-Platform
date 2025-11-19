import {create} from "zustand";
import {persist} from "zustand/middleware";
import {Job} from "@/app/types/jobType";
import {generateId} from "@/lib/formatting/utils";
import {JobStore} from "@/app/types/jobType";

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: [],

      addJob: (jobData) => {
        const newJob: Job = {
          ...jobData,
          id: generateId("job"),
          created_at: new Date().toISOString(),
        };
        set((state) => ({jobs: [...state.jobs, newJob]}));
      },

      updateJob: (id, jobData) => {
        set((state) => ({
          jobs: state.jobs.map((job) => (job.id === id ? {...job, ...jobData} : job)),
        }));
      },

      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        }));
      },

      getJobById: (id) => {
        return get().jobs.find((job) => job.id === id);
      },

      getActiveJobs: () => {
        return get().jobs.filter((job) => job.status === "active");
      },

      // Method baru untuk mengubah status job
      setJobStatus: (id, status) => {
        set((state) => ({
          jobs: state.jobs.map((job) => (job.id === id ? {...job, status} : job)),
        }));
      },

      // Method untuk mendapatkan draft jobs
      getDraftJobs: () => {
        return get().jobs.filter((job) => job.status === "draft");
      },

      // Method untuk mendapatkan inactive jobs
      getInactiveJobs: () => {
        return get().jobs.filter((job) => job.status === "inactive");
      },

      // Method untuk mendapatkan jobs berdasarkan status
      getJobsByStatus: (status) => {
        return get().jobs.filter((job) => job.status === status);
      },
    }),
    {
      name: "job-storage",
      skipHydration: true,
    }
  )
);
