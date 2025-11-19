"use client";

import {useState, useEffect} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useJobStore} from "@/app/store/jobStore";
import {DEFAULT_FIELD_CONFIG} from "@/lib/data/jobList";
import {FieldConfig, FieldValidation} from "@/app/types/jobType";
import FieldConfigPanel from "./FieldConfigPanel";
import {toast} from "sonner";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string; // ID untuk edit draft
}

export default function CreateJobModal({isOpen, onClose, draftId}: CreateJobModalProps) {
  const {addJob, updateJob, getJobById} = useJobStore();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    department: "",
    candidates_needed: "",
    salary_min: "",
    salary_max: "",
  });

  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(DEFAULT_FIELD_CONFIG);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);

  // Load draft data jika sedang edit draft
  useEffect(() => {
    if (draftId && isOpen) {
      const draft = getJobById(draftId);
      if (draft) {
        setFormData({
          title: draft.title,
          type: draft.type,
          description: draft.description || "",
          department: draft.department,
          candidates_needed: draft.candidates_needed.toString(),
          salary_min: draft.salary_range.min ? draft.salary_range.min.toLocaleString("id-ID") : "",
          salary_max: draft.salary_range.max ? draft.salary_range.max.toLocaleString("id-ID") : "",
        });
        setFieldConfigs(draft.application_form.sections[0].fields);
        setCurrentDraftId(draftId);
      }
    }
  }, [draftId, isOpen, getJobById]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    if (!formData.type) {
      newErrors.type = "Job type is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }
    if (!formData.candidates_needed || parseInt(formData.candidates_needed) < 1) {
      newErrors.candidates_needed = "Number of candidates must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAsDraft = () => {
    if (!formData.title.trim()) {
      toast.error("At least job title is required to save as draft");
      return;
    }

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const salaryMin = formData.salary_min ? parseInt(formData.salary_min.replace(/[^0-9]/g, "")) : 0;
    const salaryMax = formData.salary_max ? parseInt(formData.salary_max.replace(/[^0-9]/g, "")) : 0;

    const jobData = {
      slug,
      title: formData.title,
      type: formData.type || "Full Time",
      department: formData.department || "",
      description: formData.description || "",
      status: "draft" as const,
      candidates_needed: formData.candidates_needed ? parseInt(formData.candidates_needed) : 1,
      salary_range: {
        min: salaryMin,
        max: salaryMax,
        currency: "IDR",
        display_text: salaryMin && salaryMax ? `Rp${salaryMin.toLocaleString("id-ID")} - Rp${salaryMax.toLocaleString("id-ID")}` : undefined,
      },
      application_form: {
        sections: [
          {
            title: "Minimum Profile Information Required",
            fields: fieldConfigs,
          },
        ],
      },
    };

    if (currentDraftId) {
      updateJob(currentDraftId, jobData);
      toast.success("Draft updated successfully");
    } else {
      addJob(jobData);
      toast.success("Job saved as draft");
    }

    resetForm();
    onClose();
  };

  const handlePublish = () => {
    if (!validateForm()) {
      return;
    }

    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const salaryMin = formData.salary_min ? parseInt(formData.salary_min.replace(/[^0-9]/g, "")) : 0;
    const salaryMax = formData.salary_max ? parseInt(formData.salary_max.replace(/[^0-9]/g, "")) : 0;

    const jobData = {
      slug,
      title: formData.title,
      type: formData.type,
      department: formData.department,
      description: formData.description,
      status: "active" as const,
      candidates_needed: parseInt(formData.candidates_needed),
      salary_range: {
        min: salaryMin,
        max: salaryMax,
        currency: "IDR",
        display_text: salaryMin && salaryMax ? `Rp${salaryMin.toLocaleString("id-ID")} - Rp${salaryMax.toLocaleString("id-ID")}` : undefined,
      },
      application_form: {
        sections: [
          {
            title: "Minimum Profile Information Required",
            fields: fieldConfigs,
          },
        ],
      },
    };

    if (currentDraftId) {
      updateJob(currentDraftId, jobData);
      toast.success("Job published successfully");
    } else {
      addJob(jobData);
      toast.success("Job vacancy successfully created");
    }

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      type: "",
      description: "",
      department: "",
      candidates_needed: "",
      salary_min: "",
      salary_max: "",
    });
    setFieldConfigs(DEFAULT_FIELD_CONFIG);
    setErrors({});
    setCurrentDraftId(undefined);
  };

  const handleFieldConfigChange = (fieldKey: string, validation: FieldValidation) => {
    setFieldConfigs((prev) => prev.map((field) => (field.key === fieldKey ? {...field, validation} : field)));
  };

  const formatSalaryInput = (value: string): string => {
    const numbers = value.replace(/[^0-9]/g, "");
    if (!numbers) return "";
    return parseInt(numbers).toLocaleString("id-ID");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl min-w-auto md:min-w-2xl max-h-[90vh] overflow-y-auto bg-neutral-10 border-neutral-200 shadow-modal'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-neutral-900'>{currentDraftId ? "Edit Job" : "Create Job Opening"}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div>
            <label className='block text-sm font-medium text-neutral-900 mb-2'>
              Job Listing <span className='text-status-error-text'>*</span>
            </label>
            <Input
              placeholder='Ex: Front-end Engineer'
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-status-error-border" : "border-neutral-200 shadow-input"}
            />
            {errors.title && <p className='text-xs text-status-error-text mt-1'>{errors.title}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-900 mb-2'>
              Job Type <span className='text-status-error-text'>*</span>
            </label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className={`${errors.type ? "border-status-error-border" : "border-neutral-200 shadow-input"} bg-white w-full`}>
                <SelectValue placeholder='Select Job Type' />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem value='Full Time' className='font-bold'>
                  Full Time
                </SelectItem>
                <SelectItem value='Contract' className='font-bold'>
                  Contract
                </SelectItem>
                <SelectItem value='Part Time' className='font-bold'>
                  Part Time
                </SelectItem>
                <SelectItem value='Internship' className='font-bold'>
                  Internship
                </SelectItem>
                <SelectItem value='Freelance' className='font-bold'>
                  Freelance
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className='text-xs text-status-error-text mt-1'>{errors.type}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-900 mb-2'>
              Job Description <span className='text-status-error-text'>*</span>
            </label>
            <textarea
              placeholder='Describe the job responsibilities, requirements, and expectations'
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`w-full min-h-[100px] resize-y rounded-md border bg-white px-3 py-2 text-sm shadow-input focus-visible:outline-none focus-visible:ring-1 ${
                errors.description ? "border-status-error-border" : "border-neutral-200 focus-visible:ring-neutral-300"
              }`}
            />
            {errors.description && <p className='text-xs text-status-error-text mt-1'>{errors.description}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-900 mb-2'>
              Department <span className='text-status-error-text'>*</span>
            </label>
            <Input
              placeholder='Ex: Engineering'
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className={errors.department ? "border-status-error-border" : "border-neutral-200 shadow-input"}
            />
            {errors.department && <p className='text-xs text-status-error-text mt-1'>{errors.department}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-900 mb-2'>
              Number of Candidate Needed <span className='text-status-error-text'>*</span>
            </label>
            <Input
              type='number'
              placeholder='Ex: 3'
              min='1'
              value={formData.candidates_needed}
              onChange={(e) => handleInputChange("candidates_needed", e.target.value)}
              className={errors.candidates_needed ? "border-status-error-border" : "border-neutral-200 shadow-input"}
            />
            {errors.candidates_needed && <p className='text-xs text-status-error-text mt-1'>{errors.candidates_needed}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-neutral-900 mb-2'>Job Salary</label>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>Minimum Estimated Salary</label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'>Rp</span>
                  <Input
                    placeholder='7,000,000'
                    value={formData.salary_min}
                    onChange={(e) => handleInputChange("salary_min", formatSalaryInput(e.target.value))}
                    className='pl-10 border-neutral-200 shadow-input'
                  />
                </div>
              </div>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>Maximum Estimated Salary</label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500'>Rp</span>
                  <Input
                    placeholder='8,000,000'
                    value={formData.salary_max}
                    onChange={(e) => handleInputChange("salary_max", formatSalaryInput(e.target.value))}
                    className='pl-10 border-neutral-200 shadow-input'
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <FieldConfigPanel fields={fieldConfigs} onFieldChange={handleFieldConfigChange} />
          </div>
        </div>

        <div className='flex items-center justify-between pt-4 border-t border-neutral-200'>
          <Button variant='outline' onClick={handleSaveAsDraft} className='border-neutral-200 shadow-button'>
            Save as Draft
          </Button>
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={onClose} className='border-neutral-200 shadow-button'>
              Cancel
            </Button>
            <Button onClick={handlePublish} className='bg-primary-main hover:bg-primary-dark text-white shadow-button'>
              Publish Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
