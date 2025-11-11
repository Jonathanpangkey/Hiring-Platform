"use client";

import {Job} from "@/app/types/jobType";
import {Briefcase} from "lucide-react";

interface UserJobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

export default function UserJobCard({job, isSelected, onClick}: UserJobCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected ? "border-primary-main bg-primary-50 shadow-sm" : "border-neutral-200 bg-white hover:border-primary-200 hover:bg-neutral-50"
      }`}>
      <h3 className={`font-semibold mb-2 ${isSelected ? "text-primary-700" : "text-neutral-900"}`}>{job.title}</h3>

      <div className='flex items-center gap-2 text-sm text-neutral-600 mb-2'>
        <Briefcase className='w-4 h-4' />
        <span>Rakamin • {job.department}</span>
      </div>

      {/* <div className='flex items-center gap-2 text-sm text-neutral-600 mb-3'>
        <MapPin className='w-4 h-4' />
        <span>Jakarta Selatan</span>
      </div> */}

      {job.salary_range.display_text && (
        <div className={`text-sm font-medium ${isSelected ? "text-primary-700" : "text-neutral-700"}`}>{job.salary_range.display_text}</div>
      )}
    </button>
  );
}
