"use client";

import {useState, useMemo, useEffect} from "react";
import {Search, Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useJobStore} from "@/app/store/jobStore";
import CreateJobModal from "./CreateJobPanel";
import JobCard from "./JobCard";
import EmptyState from "@/components/shared/EmptyState";
import Header from "./Header";

export default function JobList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isHydrated, setIsHydrated] = useState(false);

  const jobs = useJobStore((state) => state.jobs);

  // Hydrate store on mount
  useEffect(() => {
    const hydrateStore = async () => {
      try {
        await useJobStore.persist.rehydrate();
        setIsHydrated(true);
      } catch (error) {
        console.error("Hydration error:", error);
        setIsHydrated(true);
      }
    };

    hydrateStore();
  }, []);

  const filteredJobs = useMemo(() => {
    // Don't filter untill hydrate
    if (!isHydrated) return [];

    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter, isHydrated]);

  if (!isHydrated) {
    return (
      <>
        <Header breadcrumbs={[{label: "Job list", href: "/admin/job-list"}]} />
        <div className='min-h-full '>
          <div className='max-w-8xl mx-auto px-6 py-6'>
            <div className='flex flex-row gap-4 mb-6 items-start'>
              <div className='relative flex-1'>
                <div className='h-10 bg-neutral-200 rounded animate-pulse' />
              </div>
              <div className='w-72 h-32 bg-neutral-200 rounded animate-pulse' />
            </div>
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='h-40 bg-neutral-100 rounded animate-pulse' />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header breadcrumbs={[{label: "Job list", href: "/admin/job-list"}]} />

      <div className='min-h-full '>
        <div className='max-w-8xl mx-auto px-6 py-6'>
          <div className='flex flex-col sm:flex-row gap-4 mb-6 items-start'>
            <div className='relative flex-1 w-full'>
              <Input
                type='text'
                placeholder='Search by job title'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pr-10 w-full border-neutral-200 shadow-input'
              />
              <Search className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400' />
            </div>

            <div className='relative w-full sm:w-auto'>
              <div className='relative bg-[url("/images/tooltip-bg.jpg")] bg-cover bg-center text-white p-4 rounded-lg shadow-modal max-w-xs sm:max-w-none z-20 animate-in fade-in slide-in-from-top-2 duration-300'>
                <div className='absolute inset-0 bg-black opacity-70 rounded-lg'></div>

                <div className='relative z-10'>
                  <div className='text-sm'>
                    <p className='font-medium mb-2'>Recruit the best candidates</p>
                    <p className='text-neutral-300'>Create jobs, and key skills and more</p>
                  </div>
                  <div className='absolute top-1/2 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-neutral-900'></div>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size='sm'
                    className='mt-4 w-full bg-primary-main hover:bg-primary-dark text-white gap-2 shadow-button'>
                    <Plus className='w-4 h-4' />
                    Create a new job
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            {filteredJobs.length === 0 ? (
              searchQuery || statusFilter !== "all" ? (
                <div className='text-center py-12'>
                  <p className='text-neutral-500 mb-4'>No jobs found matching your search criteria</p>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className='border-neutral-200 shadow-button'>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <EmptyState
                  title='No job openings available'
                  description='Create a job opening now and start the candidate process.'
                  actionLabel='Create a new job'
                  onAction={() => setIsModalOpen(true)}
                />
              )
            ) : (
              <div className='relative flex flex-col gap-4 sm:max-w-[calc(100%-290px)] w-full'>
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                {filteredJobs.length > 0 && (
                  <div className='mt-6 text-sm text-neutral-500 text-center'>
                    Showing {filteredJobs.length} of {jobs.length} job
                    {jobs.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
}
