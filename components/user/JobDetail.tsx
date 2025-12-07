"use client";

import {Job} from "@/app/types/jobType";
import {Button} from "@/components/ui/button";
import {Users, Briefcase, ArrowRight} from "lucide-react";
import {useRouter} from "next/navigation";

interface JobDetailProps {
  job: Job;
}

export default function JobDetail({job}: JobDetailProps) {
  const router = useRouter();

  return (
    <div className=' mx-auto p-6'>
      <div className='mb-8 flex justify-between'>
        <div>
          <Button className='bg-primary-main text-white border-status-success-border mb-4'>{job.type}</Button>
          <h1 className='text-3xl font-bold text-neutral-900 mb-4'>{job.title}</h1>
          <div className='flex items-center gap-6 text-neutral-600 mb-6'>
            <div className='flex items-center gap-2'>
              <Briefcase className='w-5 h-5' />
              <span>Company</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => router.push(`/apply/${job.id}`)}
          className='w-fit bg-secondary-main hover:bg-secondary-dark text-neutral-900 font-semibold shadow-button h-8 text-base'>
          Apply
          <ArrowRight className='w-5 h-5 ml-2' />
        </Button>
      </div>

      <div className='space-y-8'>
        <div>
          <h2 className='text-xl font-semibold text-neutral-900 mb-4'>About this position</h2>
          <div className='space-y-3 text-neutral-700'>
            <p>
              We are looking for a talented <strong>{job.title}</strong> to join our {job.department} team. This is a {job.type.toLowerCase()}{" "}
              position where you'll work on exciting projects.
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3 p-4 bg-neutral-100 rounded-lg'>
          <Users className='w-5 h-5 text-neutral-600' />
          <span className='text-neutral-700'>
            We are hiring <strong>{job.candidates_needed}</strong> candidate
            {job.candidates_needed > 1 ? "s" : ""} for this position
          </span>
        </div>

        <div>
          <h2 className='text-xl font-semibold text-neutral-900 mb-4'>Job Description</h2>
          <div className='prose max-w-none text-neutral-700 whitespace-pre-line'>
            {job.description ? job.description : "No job description available."}
          </div>
        </div>
      </div>
    </div>
  );
}
