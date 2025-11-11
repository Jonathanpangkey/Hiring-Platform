"use client";

import {useState, useEffect, useMemo} from "react";
import {useParams, useRouter} from "next/navigation";
import {ArrowLeft, Camera, Check, ChevronsUpDown} from "lucide-react";
import {useJobStore} from "@/app/store/jobStore";
import {useCandidateStore} from "@/app/store/candidateStore";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import provinces from "@/data/province";
import countryNumber from "@/data/country-no";
import {cn} from "@/lib/utils";
import type {FormData, FormField, CountryCode} from "@/app/types/jobType";

export default function ApplyJobForm() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [job, setJob] = useState<any>(null);
  const [openDomicile, setOpenDomicile] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [searchDomicile, setSearchDomicile] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryNumber[0]);
  const [photoPreview, setPhotoPreview] = useState<string>("/images/profil-avatar.png");
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    date_of_birth: "",
    gender: "",
    domicile: "",
    phone_number: "",
    email: "",
    linkedin_link: "",
    photo_profile: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allJobs = useJobStore((state) => state.jobs);
  const addCandidate = useCandidateStore((state) => state.addCandidate);

  useEffect(() => {
    const hydrate = async () => {
      await useJobStore.persist.rehydrate();
      await useCandidateStore.persist.rehydrate();
      setMounted(true);
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (mounted && allJobs.length > 0) {
      const foundJob = allJobs.find((j) => j.id === jobId);
      setJob(foundJob);
    }
  }, [mounted, allJobs, jobId]);

  const filteredProvinces = useMemo(
    () => provinces.filter((province) => province.name.toLowerCase().includes(searchDomicile.toLowerCase())),
    [searchDomicile]
  );

  const fields: FormField[] = useMemo(() => {
    if (!job) return [];
    return (job.application_form.sections[0].fields as FormField[]).filter((field) => field.validation !== "off");
  }, [job]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setFormData((prev) => ({...prev, photo_profile: file}));
      };
      reader.readAsDataURL(file);
    }
  };

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

  const isValidLinkedInUrl = (url: string): boolean => {
    if (!url) return false;
    return url.includes("linkedin.com/in/") || url.includes("linkedin.com");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.validation === "mandatory") {
        const value = formData[field.key as keyof FormData];
        if (!value || (typeof value === "string" && !value.trim())) {
          newErrors[field.key] = `${field.label} is required`;
        }
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.linkedin_link && !isValidLinkedInUrl(formData.linkedin_link)) {
      newErrors.linkedin_link = "Invalid LinkedIn URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    const attributes = fields
      .filter((field) => field.key !== "photo_profile")
      .map((field, index) => ({
        key: field.key,
        label: field.label,
        value: (formData[field.key as keyof FormData] as string) || "",
        order: index + 1,
      }));

    addCandidate({
      job_id: jobId,
      attributes,
      photo_url: photoPreview !== "/images/default-avatar.png" ? photoPreview : "",
    });

    toast.success("Application submitted successfully!");
    setTimeout(() => router.push("/apply/success"), 1500);
  };

  const getFieldByKey = (key: string) => fields.find((field) => field.key === key);

  if (!mounted) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-50'>
        <div className='text-neutral-500'>Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-50'>
        <div className='text-center'>
          <p className='text-neutral-500 mb-4'>Job not found</p>
          <Button onClick={() => router.push("/user/job-list")}>Back to Job List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center py-4 bg-neutral-50'>
      <div
        className='max-w-3xl w-full mx-auto bg-white border shadow-lg rounded-lg overflow-hidden flex flex-col'
        style={{maxHeight: "calc(100vh - 2rem)"}}>
        <div className='flex items-center px-6 py-4 gap-4 border-b border-neutral-200 shrink-0 bg-white'>
          <button onClick={() => router.back()} className='p-2 hover:bg-neutral-50 rounded-lg transition-colors'>
            <ArrowLeft className='w-5 h-5 text-neutral-700' />
          </button>
          <h1 className='text-lg font-semibold text-neutral-900'>Apply {job.title} at Rakamin</h1>
        </div>

        <div className='flex-1 overflow-y-auto px-6 py-6'>
          <form onSubmit={handleSubmit} id='apply-form'>
            <div className='space-y-6'>
              {getFieldByKey("photo_profile") && (
                <div>
                  <div className='flex items-center gap-6'>
                    <div className='w-32 h-32 rounded-full bg-neutral-100 overflow-hidden border-2 border-neutral-200'>
                      <img src={photoPreview} alt='Profile preview' className='w-full h-full object-cover' />
                    </div>

                    <div>
                      <input type='file' capture='user' id='photo-upload' accept='image/*' onChange={handlePhotoUpload} className='hidden' />
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => document.getElementById("photo-upload")?.click()}
                        className='border-secondary-main text-neutral-900 hover:bg-secondary-50 shadow-button'>
                        <Camera className='w-4 h-4 mr-2' />
                        Take a Picture
                      </Button>
                      <p className='text-xs text-neutral-500 mt-2'>Click to upload or take a photo</p>
                    </div>
                  </div>

                  {errors.photo_profile && <p className='text-xs text-status-error-text mt-1'>{errors.photo_profile}</p>}
                </div>
              )}

              {getFieldByKey("full_name") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Full name
                    {getFieldByKey("full_name")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <Input
                    placeholder='Enter your full name'
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    className={errors.full_name ? "border-status-error-border" : "border-neutral-200 shadow-input"}
                  />
                  {errors.full_name && <p className='text-xs text-status-error-text mt-1'>{errors.full_name}</p>}
                </div>
              )}

              {getFieldByKey("date_of_birth") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Date of birth
                    {getFieldByKey("date_of_birth")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <Input
                    type={showDatePicker ? "date" : "text"}
                    onFocus={() => setShowDatePicker(true)}
                    onBlur={(e) => {
                      if (!e.target.value) setShowDatePicker(false);
                    }}
                    placeholder='Select your date'
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    className={errors.date_of_birth ? "border-status-error-border" : "border-neutral-200 shadow-input"}
                  />
                  {errors.date_of_birth && <p className='text-xs text-status-error-text mt-1'>{errors.date_of_birth}</p>}
                </div>
              )}

              {getFieldByKey("gender") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Pronoun (gender)
                    {getFieldByKey("gender")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <div className='flex gap-6'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='gender'
                        value='Female'
                        checked={formData.gender === "Female"}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className='w-4 h-4 text-primary-main'
                      />
                      <span className='text-sm text-neutral-700'>She/her (Female)</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='gender'
                        value='Male'
                        checked={formData.gender === "Male"}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className='w-4 h-4 text-primary-main'
                      />
                      <span className='text-sm text-neutral-700'>He/him (Male)</span>
                    </label>
                  </div>
                  {errors.gender && <p className='text-xs text-status-error-text mt-1'>{errors.gender}</p>}
                </div>
              )}

              {getFieldByKey("domicile") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Domicile
                    {getFieldByKey("domicile")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>

                  <div className='relative'>
                    <Input
                      type='text'
                      placeholder='Choose your domicile'
                      value={searchDomicile || formData.domicile}
                      onChange={(e) => {
                        setSearchDomicile(e.target.value);
                        setOpenDomicile(true);
                      }}
                      onFocus={() => setOpenDomicile(true)}
                      className={cn("pr-10", errors.domicile ? "border-status-error-border" : "border-neutral-200 shadow-input")}
                    />
                    <ChevronsUpDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none' />

                    {openDomicile && (
                      <>
                        <div
                          className='fixed inset-0 z-10'
                          onClick={() => {
                            setOpenDomicile(false);
                            setSearchDomicile("");
                          }}
                        />

                        <div className='absolute z-20 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-64 overflow-y-auto'>
                          {filteredProvinces.length === 0 ? (
                            <div className='px-3 py-6 text-center text-sm text-neutral-500'>No province found.</div>
                          ) : (
                            <div className='py-1'>
                              {filteredProvinces.map((province) => (
                                <button
                                  key={province.id}
                                  type='button'
                                  onClick={() => {
                                    handleInputChange("domicile", province.name);
                                    setOpenDomicile(false);
                                    setSearchDomicile("");
                                  }}
                                  className='w-full flex items-center px-3 py-2 text-sm text-left hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none'>
                                  <Check className={cn("mr-2 h-4 w-4 shrink-0", formData.domicile === province.name ? "opacity-100" : "opacity-0")} />
                                  <span className='truncate'>{province.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {errors.domicile && <p className='text-xs text-status-error-text mt-1'>{errors.domicile}</p>}
                </div>
              )}

              {getFieldByKey("phone_number") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Phone number
                    {getFieldByKey("phone_number")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>

                  <div className='relative'>
                    <div
                      className={cn(
                        "flex items-center overflow-hidden rounded-md border bg-white shadow-input",
                        errors.phone_number ? "border-status-error-border" : "border-neutral-200"
                      )}>
                      <button
                        type='button'
                        onClick={() => setOpenCountry(!openCountry)}
                        className='flex items-center gap-2 px-3 py-2 hover:bg-neutral-50 transition-colors border-r border-neutral-200'>
                        <span className='text-base'>{selectedCountry.flag}</span>
                        <span className='text-sm text-neutral-900 font-medium'>{selectedCountry.code}</span>
                        <ChevronsUpDown className='h-4 w-4 opacity-50' />
                      </button>

                      <input
                        type='text'
                        placeholder='81XXXXXXXXX'
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange("phone_number", e.target.value)}
                        className='flex-1 px-3 py-2 text-sm bg-transparent border-0 outline-none focus:ring-0'
                      />
                    </div>

                    {openCountry && (
                      <>
                        <div className='fixed inset-0 z-10' onClick={() => setOpenCountry(false)} />

                        <div className='absolute z-20 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-64 overflow-y-auto'>
                          <div className='py-1'>
                            {countryNumber.map((country) => (
                              <button
                                key={country.id}
                                type='button'
                                onClick={() => {
                                  setSelectedCountry(country);
                                  setOpenCountry(false);
                                }}
                                className='w-full flex items-center px-3 py-2 text-sm text-left hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none'>
                                <Check className={cn("mr-2 h-4 w-4 shrink-0", selectedCountry.id === country.id ? "opacity-100" : "opacity-0")} />
                                <span className='mr-2 text-base'>{country.flag}</span>
                                <span className='font-medium mr-2'>{country.code}</span>
                                <span className='text-neutral-600'>{country.country}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {errors.phone_number && <p className='text-xs text-status-error-text mt-1'>{errors.phone_number}</p>}
                </div>
              )}

              {getFieldByKey("email") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Email
                    {getFieldByKey("email")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <Input
                    type='email'
                    placeholder='Enter your email address'
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-status-error-border" : "border-neutral-200 shadow-input"}
                  />
                  {errors.email && <p className='text-xs text-status-error-text mt-1'>{errors.email}</p>}
                </div>
              )}

              {getFieldByKey("linkedin_link") && (
                <div>
                  <label className='block text-sm font-medium text-neutral-900 mb-2'>
                    Link LinkedIn
                    {getFieldByKey("linkedin_link")?.validation === "mandatory" && <span className='text-red-500 ml-1'>*</span>}
                  </label>
                  <Input
                    placeholder='https://linkedin.com/in/username'
                    value={formData.linkedin_link}
                    onChange={(e) => handleInputChange("linkedin_link", e.target.value)}
                    className={errors.linkedin_link ? "border-status-error-border" : "border-neutral-200 shadow-input"}
                  />

                  {formData.linkedin_link && isValidLinkedInUrl(formData.linkedin_link) && !errors.linkedin_link && (
                    <div className='flex items-center gap-1.5 mt-2'>
                      <div className='flex items-center justify-center w-4 h-4 rounded-full bg-primary-main'>
                        <Check className='w-3 h-3 text-white' strokeWidth={3} />
                      </div>
                      <span className='text-xs font-medium text-primary-main'>URL address found</span>
                    </div>
                  )}

                  {errors.linkedin_link && <p className='text-xs text-status-error-text mt-1'>{errors.linkedin_link}</p>}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className='px-6 py-4 border-t border-neutral-200 shrink-0 bg-white'>
          <Button
            type='submit'
            form='apply-form'
            onClick={handleSubmit}
            className='w-full bg-primary-main hover:bg-primary-dark text-white font-semibold shadow-button h-12'>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
