"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Users, Briefcase} from "lucide-react";
import {useJobStore} from "@/app/store/jobStore";
import {useCandidateStore} from "@/app/store/candidateStore";
import CandidateTable from "@/components/admin/CandidateTable";
import Header from "@/components/admin/Header";
import {Button} from "@/components/ui/button";
import EmptyState from "../shared/EmptyState";

export default function ManageJobs() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [isHydrated, setIsHydrated] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  // Hydrate stores
  useEffect(() => {
    let mounted = true;

    const hydrateStores = async () => {
      try {
        await Promise.all([useJobStore.persist.rehydrate(), useCandidateStore.persist.rehydrate()]);
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (mounted) setIsHydrated(true);
      } catch (error) {
        console.error("❌ Hydration error:", error);
        if (mounted) setIsHydrated(true);
      }
    };

    hydrateStores();
    return () => {
      mounted = false;
    };
  }, []);

  // Get job and candidates
  useEffect(() => {
    if (!isHydrated) return;

    const currentJobs = useJobStore.getState().jobs;
    const currentCandidates = useCandidateStore.getState().candidates;
    const foundJob = currentJobs.find((j) => j.id === jobId);

    setJob(foundJob || null);
    // get candidate based on job id
    setCandidates(foundJob ? currentCandidates.filter((c) => c.job_id === jobId) : []);
  }, [isHydrated, jobId]);

  // Loading state
  if (!isHydrated) {
    return (
      <>
        <Header />
        <div className='min-h-full bg-neutral-50'>
          <div className='bg-white border-b border-neutral-200'>
            <div className='px-6 py-4'>
              <div className='h-8 bg-neutral-200 rounded w-1/3 animate-pulse' />
            </div>
          </div>
          <div className='px-6 py-6'>
            <div className='h-64 bg-neutral-100 rounded animate-pulse' />
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header />
        <div className='min-h-full bg-neutral-50 flex items-center justify-center'>
          <div className='text-center max-w-md'>
            <Briefcase className='w-16 h-16 text-neutral-400 mx-auto mb-4' />
            <p className='text-neutral-500 mb-4'>Job not found</p>
            <Button onClick={() => router.push("/admin/job-list")}>Back to Job List</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header breadcrumbs={[{label: "Job list", href: "/admin/job-list"}, {label: "Manage Candidate"}]} />

      <div className='min-h-full '>
        <div className=' border-neutral-200'>
          <div className='px-6 py-2'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-semibold text-neutral-900'>{job.title}</h2>
              </div>

              <div className='text-right'>
                <div className='flex items-center gap-2 text-neutral-600 mb-1'>
                  <Users className='w-5 h-5' />
                  <span className='text-sm'>Total Applicants</span>
                </div>
                <div className='text-3xl font-bold text-primary-main'>{candidates.length}</div>
                <div className='text-xs text-neutral-500 mt-1'>of {job.candidates_needed} needed</div>
              </div>
            </div>
          </div>
        </div>

        <div className='px-6 py-4'>
          {candidates.length === 0 ? (
            <EmptyState
              imageSrc='/images/empty-candidate.png'
              imageAlt='No candidates found'
              title='No Candidate'
              description='Share your job vacancies so that more candidates will apply.'
            />
          ) : (
            <CandidateTable candidates={candidates} />
          )}
        </div>
      </div>
    </>
  );
}
