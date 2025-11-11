"use client";

import {useState, useEffect, useMemo} from "react";
import {useJobStore} from "@/app/store/jobStore";
import UserJobCard from "@/components/user/UserJobCard";
import JobDetail from "@/components/user/JobDetail";
import UserHeader from "@/components/user/UserHeader";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent} from "@/components/ui/sheet";
import {Menu, Briefcase} from "lucide-react";

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const allJobs = useJobStore((state) => state.jobs);

  const jobs = useMemo(() => allJobs.filter((job) => job.status === "active"), [allJobs]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      await useJobStore.persist.rehydrate();
      setTimeout(() => setMounted(true), 300);
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (mounted && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [mounted, jobs, selectedJobId]);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    setMobileMenuOpen(false);
  };

  if (!mounted) {
    return (
      <div className='h-screen flex flex-col'>
        <div className='bg-white border-b border-neutral-200 h-16 animate-pulse' />
        <div className='flex-1 flex'>
          <div className='hidden lg:block w-[400px] bg-white border-r border-neutral-200 p-6'>
            <div className='h-6 bg-neutral-200 rounded mb-4 animate-pulse' />
            <div className='space-y-3'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-32 bg-neutral-100 rounded animate-pulse' />
              ))}
            </div>
          </div>
          <div className='flex-1 p-4 lg:p-8'>
            <div className='h-8 bg-neutral-200 rounded w-1/2 mb-4 animate-pulse' />
            <div className='h-4 bg-neutral-200 rounded w-full mb-2 animate-pulse' />
            <div className='h-4 bg-neutral-200 rounded w-3/4 animate-pulse' />
          </div>
        </div>
      </div>
    );
  }

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  const JobListContent = () => (
    <div className='h-full flex flex-col'>
      <div className='flex-1 overflow-y-auto px-4 py-12 lg:py-4'>
        {jobs.length === 0 ? (
          <div className='text-center py-12'>
            <Briefcase className='h-12 w-12 text-neutral-300 mx-auto mb-4' />
            <p className='text-neutral-500'>No active jobs available</p>
          </div>
        ) : (
          <div className='space-y-3'>
            {jobs.map((job) => (
              <UserJobCard key={job.id} job={job} isSelected={selectedJobId === job.id} onClick={() => handleJobSelect(job.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='h-screen flex flex-col'>
      <UserHeader />

      <div className='flex-1 flex overflow-hidden relative'>
        <div className='hidden lg:block w-[400px] bg-white border-r border-neutral-200 overflow-y-auto'>
          <JobListContent />
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side='left' className='w-[320px] sm:w-[400px] p-0 bg-white'>
            <JobListContent />
          </SheetContent>
        </Sheet>

        <div className='flex-1 overflow-y-auto relative'>
          <Button
            variant='outline'
            size='icon'
            className='lg:hidden fixed bottom-6 left-6 z-40 h-14 w-14 rounded-full shadow-lg bg-primary-main text-white hover:bg-primary-dark border-0'
            onClick={() => setMobileMenuOpen(true)}>
            <Menu className='h-6 w-6' />
          </Button>

          {selectedJob ? (
            <div className='p-4 lg:p-8'>
              <JobDetail job={selectedJob} />
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full px-4'>
              <Briefcase className='h-16 w-16 text-neutral-300 mb-4' />
              <p className='text-neutral-500 text-center'>{jobs.length === 0 ? "No jobs available" : "Select a job to view details"}</p>
              <Button variant='outline' className='mt-4 lg:hidden' onClick={() => setMobileMenuOpen(true)}>
                <Menu className='h-4 w-4 mr-2' />
                View Job List
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
