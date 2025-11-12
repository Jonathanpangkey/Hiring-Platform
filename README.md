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
   - Capture profile picture via hand gesture (3-finger pose)
   - Submit application
   - Success toast notification displayed
   - Application stored and linked to specific job

4. **Admin Reviews Application**
   - Admin sees the application in Candidate Management Page
   - Can view, sort, and filter all applicants for that job

---


## 2. Key Features Implemented

### Admin (Recruiter)
1. **Job List Page**
   - Display all job vacancies with title, department, status badge, and salary range
   - Search by status or keyword
   - "Create Job" button with modal/page

2. **Create Job Modal**
   - Configurable application fields (Mandatory/Optional/Off)
   - Dynamic form validation based on field configuration
   - Job metadata input (title, description, department, salary, etc.)

3. **Candidate Management Page**
   - Table view with resizable and reorderable columns (drag & drop)
   - Sortable columns with ascending/descending order
   - Per-column filtering with popover interface
   - Pagination with customizable rows per page

### Applicant (Job Seeker)
1. **Job List Page**
   - View all active job postings with cards
   - Job details display (title, salary, company)

2. **Apply Job Page**
   - Dynamic form rendering based on job configuration
   - Adaptive validation (mandatory/optional/hidden fields)
   - Profile picture upload with webcam capture
   - Hand gesture detection (3-finger pose trigger for photo capture)

3. **Profile Picture Capture**
   - Webcam integration with MediaPipe hand detection
   - Automatic capture on 3-finger gesture detection
   - Preview and retake functionality
   - Upload to Supabase Storage

---

## 3. Optional Enhancements Added

1. **Save as Draft Feature**
   - Admins can save incomplete job postings as drafts
   - Draft jobs are not visible to applicants

2. **Job Status Management**
   - Three-dot menu on job cards with dropdown
   - Quick status toggle: Draft → Active → Inactive
   - Visual status badges with color coding

3. **Advanced Table Features**
   - Column-specific filtering with popover modal
   - Pagination info: "Showing X to Y of Z entries"
   - Rows per page selector (10/25/50/100)
   - Profile picture column in candidate table

4. **Applicant Statistics**
   - "Total Applicants: X of Y needed" indicator
   - Helps admins track hiring progress at a glance

5. **Responsive Layout**
   - Mobile-friendly design across all pages
   - Adaptive navigation and card layouts

6. **Welcome Page**
   - Landing page with role selection
   - Direct navigation to Admin or Job Seeker interface

7. **Supabase Integration**
   - Image storage for candidate profile pictures
   - Secure public URL generation for stored images

---

## 4. Design or Logic Assumptions

1. **Field Configuration Logic**
   - `required: true` → Field is mandatory (validation enforced)
   - `required: false` → Field is optional (no validation)
   - Field not in config → Hidden from form

2. **Job Status Workflow**
   - Draft → only visible to admin
   - Active → visible to all applicants
   - Inactive → hidden from applicants but retained in admin view

3. **Candidate Data Structure**
   - `photo_url` stored as direct property on candidate object
   - Other fields stored in `attributes` array for flexibility

5. **Table Column Management**
   - Drag handle appears on hover for reordering
   - Resize handle at column edge with visual feedback

---

## 5. Known Limitations

1. **No Persistent Backend**
   - All data stored in localStorage via Zustand
   - Data resets on browser cache clear
   - No synchronization across devices or browsers

2. **No Authentication/Authorization**
   - No login system implemented
   - Admin/User role determined solely by URL path
   - No user session management

3. **Limited Data Validation**
   - Client-side validation only
   - No backend verification of submitted data

4. **Single Job Application**
   - Applicants can apply to the same job multiple times
   - No duplicate application prevention

5. **Image Storage Only**
   - Supabase used only for image storage
   - All other data remains in localStorage

6. **Camera Permissions**
   - No Camera Gesture Functionality

7. **No Email Notifications**
   - No automated emails for application confirmations
   - No recruiter alerts for new applications

---

## Additional Notes
- All UI components built with shadcn/ui for consistency
- Toast notifications (Sonner) for user feedback on all actions
- Fully typed with TypeScript for better developer experience
- Responsive design tested on desktop, tablet, and mobile viewports
