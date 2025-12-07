#### Project Overview
A hiring management web application designed for two user roles: Admin (Recruiter) and Applicant (Job Seeker). The platform features dynamic form generation based on configurable job requirements, allowing admins to customize which fields are mandatory, optional, or hidden for each job posting.

#### Tech Stack Used
- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **State Management:** Zustand (with localStorage persistence)
- **Storage:** Supabase Storage (for candidate profile images)
- **UI Libraries:** Sonner (toast notifications), Lucide React (icons)
- **Form Handling:** React Hook Form with Zod validation

#### How to Run Locally
```bash
# Clone the repository
git clone https://github.com/jonathanpangkey/hiring-platform
cd hiring-platform

# Install dependencies
npm install

# Set up environment variables
# Create .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev

# Open http://localhost:3000
```

---
## 1. Complete User Journey

### Admin Flow:
1. **Create Job Posting**
   - Admin clicks "+ Create Job" button on job list page
   - Fills in job details (title, description, department, salary, etc.)
   - Configures required profile fields (Mandatory/Optional/Off)
   - Two options:
     - **Save as Active** (default) → Job immediately visible to applicants
     - **Save as Draft** → Job saved but hidden from applicants

2. **Manage Job Status**
   - Each job card displays current status badge (Draft/Active/Inactive)
   - Click three-dot menu (⋮) on job card
   - Select status from dropdown:
     - **Draft** → Job hidden from applicants, editable by admin
     - **Active** → Job visible and accepting applications
     - **Inactive** → Job hidden but preserves existing applications

3. **View Applicants**
   - Click "Manage Job" button on specific job card
   - Opens Candidate Management Page for that job
   - View all applicants who applied to that specific job
   - Table shows: Name, Email, Phone, Gender, LinkedIn, Domicile, Applied Date, Profile Picture
   - Use filtering, sorting, and pagination to manage candidates

### Applicant Flow:
1. **Browse Jobs**
   - Visit job list page (shows only Active jobs)
   - View job cards with title, salary, company info

2. **Apply to Job**
   - Click on job card to view details
   - Click "Apply Now" button
   - Form dynamically renders based on admin's field configuration:
     - Mandatory fields → Must be filled (validation enforced)
     - Optional fields → Can be skipped
     - Hidden fields → Not shown in form

3. **Submit Application**
   - Fill in required information
   - Submit application
   - Success toast notification displayed
   - Application stored and linked to specific job

4. **Admin Reviews Application**
   - Admin sees the application in Candidate Management Page
   - Can view, sort, and filter all applicants for that job

