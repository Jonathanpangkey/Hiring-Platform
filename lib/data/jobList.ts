import {Job, FieldConfig} from "@/app/types/jobType";

export const DEFAULT_FIELD_CONFIG: FieldConfig[] = [
  {key: "full_name", label: "Full Name", validation: "mandatory", order: 1},
  {key: "photo_profile", label: "Photo Profile", validation: "mandatory", order: 2},
  {key: "email", label: "Email", validation: "mandatory", order: 3},
  {key: "phone_number", label: "Phone Number", validation: "mandatory", order: 4},
  {key: "gender", label: "Gender", validation: "optional", order: 5},
  {key: "date_of_birth", label: "Date of Birth", validation: "optional", order: 6},
  {key: "domicile", label: "Domicile", validation: "optional", order: 7},
  {key: "linkedin_link", label: "LinkedIn Profile", validation: "optional", order: 8},
];
