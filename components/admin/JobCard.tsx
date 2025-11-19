"use client";

import {Job} from "@/app/types/jobType";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/lib/formatting/utils";
import {useRouter} from "next/navigation";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import {MoreVertical, CheckCircle, XCircle, Trash2} from "lucide-react";
import {useJobStore} from "@/app/store/jobStore";
import {toast} from "sonner";
import {useState} from "react";

interface JobCardProps {
  job: Job;
  onEdit?: (jobId: string) => void;
}

export default function JobCard({job, onEdit}: JobCardProps) {
  const router = useRouter();
  const {setJobStatus, deleteJob} = useJobStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-status-success-bg text-status-success-text rounded-md border-status-success-border";
      case "inactive":
        return "bg-neutral-100 text-neutral-700 rounded-md border-neutral-300";
      case "draft":
        return "bg-status-draft-bg rounded-md text-status-draft-text border-status-draft-border";
      default:
        return "bg-neutral-100 rounded-md text-neutral-700 border-neutral-300";
    }
  };

  const handleManageClick = () => {
    console.log("🔍 Navigate to manage jobs for:", job.id);
    router.push(`/admin/${job.id}/manage-jobs`);
  };

  const handleSetActive = () => {
    setJobStatus(job.id, "active");
    toast.success("Job status changed to Active");
  };

  const handleSetInactive = () => {
    setJobStatus(job.id, "inactive");
    toast.success("Job status changed to Inactive");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`);

    if (confirmDelete) {
      setIsDeleting(true);
      try {
        deleteJob(job.id);
        toast.success("Job deleted successfully");
      } catch (error) {
        toast.error("Failed to delete job");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className='rounded-lg border border-neutral-200 p-6 hover:shadow-card-hover transition-all duration-200 shadow-card'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-3'>
          <span className={`text-sm font-medium px-2 py-1 border ${getStatusColor(job.status)}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          <span className='text-sm rounded-md text-neutral-600 border border-neutral-200 px-2 py-1'>started on {formatDate(job.created_at)}</span>
        </div>

        {/* Dropdown Menu for Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='bg-white w-48'>
            <DropdownMenuSeparator />

            {job.status === "active" && (
              <DropdownMenuItem onClick={handleSetInactive} className='cursor-pointer'>
                <XCircle className='h-4 w-4 mr-2' />
                Set as Inactive
              </DropdownMenuItem>
            )}

            {(job.status === "inactive" || job.status === "draft") && (
              <DropdownMenuItem onClick={handleSetActive} className='cursor-pointer'>
                <CheckCircle className='h-4 w-4 mr-2' />
                Set as Active
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleDelete}
              className='cursor-pointer text-status-error-text focus:text-status-error-text'
              disabled={isDeleting}>
              <Trash2 className='h-4 w-4 mr-2' />
              {isDeleting ? "Deleting..." : "Delete Job"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex items-start justify-between mb-2'>
        <h3 className='text-xl font-semibold text-neutral-900'>{job.title}</h3>
      </div>

      <div className='flex justify-between items-center'>
        {job.salary_range.display_text && <p className='text-base text-neutral-700'>{job.salary_range.display_text}</p>}
        <Button
          className='bg-primary-main hover:bg-primary-dark text-white shadow-button ml-4'
          onClick={handleManageClick}
          disabled={job.status === "draft"}>
          Manage Job
        </Button>
      </div>

      {job.status === "draft" && (
        <p className='text-xs text-neutral-500 mt-2'>Complete the job details and set it to Active to start managing applications</p>
      )}
    </div>
  );
}
