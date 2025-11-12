import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// apply job form validation utils
import {FormField, FormData} from "@/app/types/jobType";

export const isValidLinkedInUrl = (url: string): boolean => {
  if (!url) return false;
  return url.includes("linkedin.com/in/") || url.includes("linkedin.com");
};

export const validateForm = (fields: FormField[], formData: FormData, photoFile: File | null, photoPreview: string): Record<string, string> => {
  const newErrors: Record<string, string> = {};

  fields.forEach((field) => {
    if (field.validation === "mandatory") {
      if (field.key === "photo_profile") {
        if (!photoFile && photoPreview === "/images/profil-avatar.png") {
          newErrors[field.key] = `${field.label} is required`;
        }
      } else {
        const value = formData[field.key as keyof FormData];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.key] = `${field.label} is required`;
        }
      }
    }
  });

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Invalid email format";
  }

  if (formData.linkedin_link && !isValidLinkedInUrl(formData.linkedin_link)) {
    newErrors.linkedin_link = "Invalid LinkedIn URL";
  }

  return newErrors;
};
