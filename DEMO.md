# Campus Connect Hub - Demo Mode Documentation

This application is configured to run in **pure frontend demo mode** with no database or backend requirements.

## Demo Accounts

Use these pre-configured accounts to explore different user roles:

### Admin / Placement Officer
- **Email:** `admin@university.edu`
- **Password:** `admin123`
- **Access:** Company management, user management, recruiter verification, analytics

### Recruiter
- **Email:** `recruiter@techcorp.com`
- **Password:** `recruiter123`
- **Access:** Post job opportunities, view applications, schedule interviews

### Faculty Mentor
- **Email:** `mentor@university.edu`
- **Password:** `mentor123`
- **Access:** Review student applications, approve/reject submissions, provide feedback

### Student Accounts
1. **Rahul Sharma**
   - **Email:** `rahul.sharma@university.edu`
   - **Password:** `student123`
   - Skills: JavaScript, React, Node.js, Python, SQL

2. **Priya Patel**
   - **Email:** `priya.patel@university.edu`
   - **Password:** `student123`
   - Skills: Java, Spring Boot, AWS, Docker, Kubernetes

3. **Arjun Kumar**
   - **Email:** `arjun.kumar@university.edu`
   - **Password:** `student123`
   - Skills: Python, Machine Learning, TensorFlow, Data Analysis

## Complete Workflow Demo

### 1. Admin Adds Company
- Login as admin (`admin@university.edu`)
- Navigate to "Company Management"
- Click "Add Company" and fill in details
- Company is immediately added to the system

### 2. Recruiter Posts Job Opportunity
- Login as recruiter (`recruiter@techcorp.com`)
- Navigate to "Post Opportunity"
- Fill in job details (role, location, requirements, etc.)
- Job is posted and visible to students

### 3. Students Apply
- Login as student (e.g., `rahul.sharma@university.edu`)
- Navigate to "Opportunities"
- Browse available opportunities
- Click "Apply" on desired positions
- Application status: "Pending Mentor Review"

### 4. Mentor Reviews Applications
- Login as mentor (`mentor@university.edu`)
- Navigate to "Applications"
- Review student applications
- Approve or reject with feedback
- Approved applications move to "Under Review" for recruiters

### 5. Recruiter Shortlists Candidates
- Login as recruiter
- Navigate to "Applications"
- View mentor-approved applications
- Shortlist promising candidates
- Status changes to "Shortlisted"

### 6. Schedule Interviews
- Recruiter or admin navigates to "Schedule"
- Click "Schedule Interview"
- Select application and enter details:
  - Date and time
  - Mode (online/offline/phone)
  - Meeting link or location
- Interview is scheduled and visible to student

### 7. Complete Internship & Generate Certificate
- Admin/placement officer marks internship as completed
- Navigate to "Certificates"
- Click "Generate Certificate"
- Certificate is created with:
  - Student name
  - Company name
  - Role/position
  - Dates and performance details
  - Unique verification ID

### 8. Student Views Progress
- Student logs in to their dashboard
- See application status updates:
  - Applied → Under Review → Shortlisted → Interview Scheduled → Selected
- View scheduled interviews in "Schedule"
- Access certificates in "Certificates"

## Pre-loaded Demo Data

The application includes realistic dummy data:

- **4 Companies:** TechCorp Solutions, InnovateLabs, DataFlow Analytics, CloudNine Systems
- **4 Job Opportunities:** Various internship and full-time positions
- **9 Applications:** From different students in various stages
- **4 Scheduled Interviews:** Including past and upcoming
- **1 Certificate:** Sample completion certificate

## Key Features Demonstrated

### For Students
✅ Browse job opportunities  
✅ Apply to positions  
✅ Track application status  
✅ View interview schedules  
✅ Access certificates  

### For Mentors
✅ Review applications  
✅ Approve/reject with feedback  
✅ Track student progress  
✅ Share recommendations with recruiters  

### For Recruiters
✅ Post job opportunities  
✅ View applications  
✅ Shortlist candidates  
✅ Schedule interviews  
✅ Manage hiring pipeline  

### For Admins
✅ Manage companies  
✅ Verify recruiters  
✅ Generate certificates  
✅ View analytics  
✅ Oversee entire process  

## Technical Notes

- **No Database Required:** All data stored in memory using a singleton pattern
- **No API Calls:** All operations are synchronous frontend updates
- **Session Persistence:** Login state persists using localStorage
- **Realistic Data:** All dummy data uses real-looking names, companies, and details
- **Complete Workflow:** Every step from job posting to certificate generation is functional

## Running the Application

```bash
npm install
npm run dev
```

Then navigate to `http://localhost:8080` and use any of the demo accounts above.

## Resetting Demo Data

Refresh the page to reset all data to initial state. Changes made during a session are temporary and stored in memory only.
