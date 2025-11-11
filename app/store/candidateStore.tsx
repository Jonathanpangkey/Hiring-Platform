import {create} from "zustand";
import {persist} from "zustand/middleware";
import {generateId} from "@/app/lib/utils/utils";
import {Candidate} from "../types/jobType";
import {CandidateStore} from "../types/jobType";

export const useCandidateStore = create<CandidateStore>()(
  persist(
    (set, get) => ({
      candidates: [],

      addCandidate: (candidateData) => {
        const newCandidate: Candidate = {
          ...candidateData,
          id: generateId("cand"),
          applied_date: new Date().toISOString(),
        };
        set((state) => ({
          candidates: [...state.candidates, newCandidate],
        }));
      },

      getCandidatesByJobId: (jobId: string) => {
        return get().candidates.filter((c) => c.job_id === jobId);
      },

      updateCandidate: (id, candidateData) => {
        set((state) => ({
          candidates: state.candidates.map((candidate) => (candidate.id === id ? {...candidate, ...candidateData} : candidate)),
        }));
      },

      deleteCandidate: (id) => {
        set((state) => ({
          candidates: state.candidates.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: "candidate-storage",
      skipHydration: true,
    }
  )
);
