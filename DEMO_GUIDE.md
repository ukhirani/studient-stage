# Campus Placement Portal - Demo Guide

This guide provides complete information for demonstrating the end-to-end campus placement workflow with realistic dummy data.

## Demo User Credentials

The system has been pre-populated with the following test accounts:

### 1. Admin (Placement Officer)
- **Email:** `admin@college.edu`
- **Password:** `Admin@123`
- **Role:** Placement Officer
- **Name:** Dr. Rajesh Kulkarni
- **Access:** Full system access, company management, user management

### 2. Recruiter
- **Email:** `recruiter@google.com`
- **Password:** `Recruiter@123`
- **Role:** Recruiter
- **Name:** Sarah Mitchell
- **Company:** Google
- **Access:** Post opportunities, view applications, shortlist candidates, schedule interviews

### 3. Faculty Mentor
- **Email:** `mentor@college.edu`
- **Password:** `Mentor@123`
- **Role:** Faculty Mentor
- **Name:** Prof. Meera Deshmukh
- **Access:** View student applications, provide feedback, approve/reject applications

### 4. Students (5 Students)

#### Priya Sharma
- **Email:** `priya.sharma@college.edu`
- **Password:** `Student@123`
- **Department:** Computer Science
- **CGPA:** 8.75
- **Skills:** Python, JavaScript, React, Node.js, MongoDB
- **Applications:** 2 (Google Backend, Amazon Frontend)
- **Status:** Shortlisted at Google

#### Rahul Verma
- **Email:** `rahul.verma@college.edu`
- **Password:** `Student@123`
- **Department:** Computer Science
- **CGPA:** 9.12
- **Skills:** Java, Spring Boot, Docker, Kubernetes, AWS
- **Applications:** 2 (Google Backend, Microsoft ML)
- **Status:** **PLACED at Microsoft** ✅

#### Ananya Patel
- **Email:** `ananya.patel@college.edu`
- **Password:** `Student@123`
- **Department:** Computer Science
- **CGPA:** 8.45
- **Skills:** C++, Machine Learning, TensorFlow, Python
- **Applications:** 2 (Microsoft ML, Google Backend)
- **Status:** Shortlisted at Microsoft

#### Arjun Kumar
- **Email:** `arjun.kumar@college.edu`
- **Password:** `Student@123`
- **Department:** Information Technology
- **CGPA:** 8.90
- **Skills:** JavaScript, TypeScript, Angular, Node.js
- **Applications:** 2 (Amazon Frontend, Google Backend)
- **Status:** Shortlisted at Amazon

#### Sneha Reddy
- **Email:** `sneha.reddy@college.edu`
- **Password:** `Student@123`
- **Department:** Computer Science
- **CGPA:** 9.25
- **Skills:** Python, Django, React, PostgreSQL, Docker
- **Applications:** 3 (Google Backend, Amazon Frontend, Microsoft ML)
- **Status:** **PLACED at Google** ✅

## Pre-loaded Demo Data

### Companies
The system has 3 verified companies:

1. **Google**
   - Industry: Technology
   - Location: Mountain View, CA / Bangalore, India
   - Status: Verified

2. **Amazon**
   - Industry: E-commerce & Cloud
   - Location: Seattle, WA / Hyderabad, India
   - Status: Verified

3. **Microsoft**
   - Industry: Technology
   - Location: Redmond, WA / Bangalore, India
   - Status: Verified

### Job Opportunities
Three active job postings created by the Google recruiter:

1. **Software Development Engineer - Backend** (Google)
   - CTC: ₹12,00,000 per annum
   - Location: Bangalore
   - Min CGPA: 7.50
   - Type: Full-time
   - Skills: Java, Python, Distributed Systems

2. **Frontend Engineer - React** (Amazon)
   - CTC: ₹15,00,000 per annum
   - Location: Hyderabad
   - Min CGPA: 7.00
   - Type: Full-time
   - Skills: JavaScript, React, TypeScript

3. **Machine Learning Engineer** (Microsoft)
   - CTC: ₹14,00,000 per annum
   - Location: Bangalore
   - Min CGPA: 8.00
   - Type: Full-time
   - Skills: Python, TensorFlow, Machine Learning

### Applications
11 applications from 5 students across different opportunities with varying statuses:
- Pending: 1 application
- Under Review: 4 applications
- Shortlisted: 4 applications
- Selected: 2 applications (Rahul @ Microsoft, Sneha @ Google)

### Interview Schedules
7 interviews scheduled (some completed, some upcoming):
- Past interviews: 2 completed
- Upcoming interviews: 5 scheduled over the next week

### Placements
2 successful placements with offer letters and certificates:
- **Rahul Verma** → Microsoft ML Engineer (₹14 LPA)
- **Sneha Reddy** → Google Backend Engineer (₹12 LPA)

## Complete Demo Workflow

### Step 1: Admin Adds Companies

1. Login as **Admin** (`admin@college.edu`)
2. Navigate to **Company Management**
3. View pre-loaded companies: Google, Amazon, Microsoft
4. Each company has:
   - Complete details (address, website, contact)
   - Verified status
   - Industry classification

**Demo Point:** Show how admin has added and verified these companies

### Step 2: Recruiter Creates Job Opportunities

1. Login as **Recruiter** (`recruiter@google.com`)
2. Navigate to **My Opportunities**
3. View 3 active job postings
4. Click on any opportunity to see:
   - Detailed job description
   - Requirements and skills
   - Interview rounds defined
   - Application statistics

**Demo Point:** Show realistic job descriptions with proper CTCs, locations, and requirements

### Step 3: Students Apply for Jobs

1. Login as any **Student** (e.g., `priya.sharma@college.edu`)
2. Navigate to **Opportunities**
3. View available job listings
4. Navigate to **My Applications**
5. See submitted applications with:
   - Cover letters explaining why they're suitable
   - Application timestamps
   - Current status

**Demo Point:** Each student has 2-3 applications with realistic cover letters and diverse backgrounds

### Step 4: Mentor Reviews and Tracks Applications

1. Login as **Mentor** (`mentor@college.edu`)
2. Navigate to **My Students**
3. View all 5 assigned students
4. See their applications with statuses
5. Navigate to **Feedback**
6. View mentor feedback provided to students
7. Check mentor comments on applications:
   - Priya: "Strong problem-solving abilities. Recommended for shortlisting."
   - Rahul: "Exceptional technical skills with real-world experience."
   - Sneha: "Outstanding academic record. Most strongly recommended."

**Demo Point:** Show how mentor tracks student progress and provides detailed feedback

### Step 5: Mentor Shares Details with Recruiter

1. As **Mentor**, applications with mentor approval show:
   - Mentor comments visible to recruiters
   - Mentor approval timestamp
   - Recommendation strength

2. Switch to **Recruiter** view
3. Navigate to **Applications**
4. Filter by **Mentor Approved** status
5. See applications with mentor recommendations
6. View detailed mentor feedback for each candidate

**Demo Point:** Demonstrate seamless information flow from mentor to recruiter

### Step 6: Recruiter Shortlists Candidates

1. Login as **Recruiter** (`recruiter@google.com`)
2. Navigate to **Applications**
3. View applications organized by status
4. See shortlisted candidates:
   - Priya Sharma (Google Backend)
   - Rahul Verma (Google Backend)
   - Ananya Patel (Microsoft ML)
   - Arjun Kumar (Amazon Frontend)
   - Sneha Reddy (Google Backend + Amazon Frontend)

**Demo Point:** Show how recruiter can see mentor-approved applications and make shortlisting decisions

### Step 7: Interview Scheduling

1. As **Recruiter**, navigate to **Schedule**
2. View upcoming interviews:
   - **Priya Sharma** - Google Backend (Round 1) - Online Assessment
   - **Rahul Verma** - Google Backend (Round 2) - Technical Interview
   - **Ananya Patel** - Microsoft ML (Round 1) - Screening
   - **Arjun Kumar** - Amazon Frontend (Round 1) - Online Test
   - **Sneha Reddy** - Amazon Frontend (Round 1) - Technical Round

3. Each interview shows:
   - Date and time
   - Duration
   - Mode (Online with meeting links)
   - Round details
   - Notes for candidates

**Demo Point:** Show realistic interview schedules with meeting links and round information

### Step 8: Certificate Generation

1. Login as **Admin** or **Recruiter**
2. Navigate to **Certificates**
3. View generated certificates:

   **Rahul Verma - Microsoft ML Engineer**
   - Certificate Type: Placement Offer
   - Issue Date: Recent
   - CTC: ₹14,00,000 per annum
   - Joining Date: July 1, 2024

   **Sneha Reddy - Google Backend Engineer**
   - Certificate Type: Placement Offer
   - Issue Date: Recent
   - CTC: ₹12,00,000 + Stock Options
   - Joining Date: July 15, 2024

**Demo Point:** Show auto-generated certificates with complete offer details

### Step 9: Student Dashboard Updates

1. Login as **Sneha Reddy** (`sneha.reddy@college.edu`)
2. Dashboard shows:
   - **3 Applications** submitted
   - **2 Shortlisted** (Google, Amazon)
   - **1 Selected** (Google) ✅
   - **Career Log** with complete journey

3. Navigate to **Applications**:
   - See status progression: Applied → Mentor Approved → Shortlisted → Selected
   - View mentor feedback
   - See interview schedule
   - Certificate available for download

4. Navigate to **Certificates**:
   - View and download offer letter certificate

5. Navigate to **Schedule**:
   - View past interview (completed)
   - View upcoming Amazon interview

**Demo Point:** Show complete student journey from application to placement

### Alternative Flow: Rahul Verma (Microsoft Placement)

1. Login as **Rahul Verma** (`rahul.verma@college.edu`)
2. View successful placement at Microsoft
3. Career log shows:
   - Application submitted
   - Mentor approval received
   - Shortlisted for interviews
   - Completed 3 rounds of interviews
   - Offer extended
   - Offer accepted ✅

**Demo Point:** Show another successful placement with different company

## Key Features Demonstrated

### ✅ Complete Workflow Coverage
- Admin company management
- Recruiter job posting
- Student applications
- Mentor review and approval
- Recruiter shortlisting
- Interview scheduling
- Offer generation
- Certificate issuance

### ✅ Realistic Data
- No "Lorem Ipsum" or placeholder text
- Real company names (Google, Amazon, Microsoft)
- Realistic CTCs (₹12-15 LPA)
- Proper job descriptions
- Student profiles with relevant skills
- Detailed cover letters
- Professional mentor feedback

### ✅ Role-based Access
- Admin: Full system control
- Recruiter: Opportunity and hiring management
- Mentor: Student guidance and approval
- Student: Application and progress tracking

### ✅ Status Tracking
- Application status progression
- Timeline visualization
- Mentor approval workflow
- Interview scheduling
- Offer acceptance

### ✅ Data Continuity
- Applications link to opportunities
- Interviews link to applications
- Certificates link to placements
- Career logs track complete journey
- Mentor assignments track relationships

## Dashboard Statistics

### Admin Dashboard
- Total Students: 245
- Eligible for Placement: 156
- Applications Submitted: 245
- Pending Reviews: 23
- Interview Scheduled: 34
- Offers Extended: 28
- Placements: 19

### Recruiter Dashboard
- Active Opportunities: 3
- Total Applications: 11
- Shortlisted: 4
- Selected: 2

### Mentor Dashboard
- Students Mentoring: 5 (assigned)
- Applications Reviewed: 11
- Feedback Given: 5
- Success Rate: 40% (2 out of 5 placed)

### Student Dashboard (Sneha)
- Applications: 3
- Shortlisted: 2
- Selected: 1
- Interviews: 2 (1 completed, 1 upcoming)

## Testing Checklist

Use this checklist during demo:

- [ ] Login as Admin and view companies
- [ ] Login as Recruiter and view job postings
- [ ] Login as Student (Priya) and view applications
- [ ] Login as Mentor and view student progress
- [ ] As Mentor, check feedback and recommendations
- [ ] As Recruiter, view mentor-approved applications
- [ ] As Recruiter, check shortlisted candidates
- [ ] As Recruiter/Admin, view interview schedules
- [ ] As Admin, view generated certificates
- [ ] Login as Sneha and see complete placement journey
- [ ] Login as Rahul and see Microsoft placement
- [ ] Verify all status transitions work correctly
- [ ] Check that all data looks professional and realistic

## Notes for Demo

1. **Start Fresh**: The data is pre-loaded, so you can jump straight into any role

2. **Key Profiles to Demo**:
   - **Sneha Reddy**: Best example of complete workflow (3 apps → placed at Google)
   - **Rahul Verma**: Another placement success (Microsoft)
   - **Priya Sharma**: Application in progress (good for showing ongoing process)

3. **Timeline is Realistic**:
   - Applications submitted 9-15 days ago
   - Mentor reviews completed 6-12 days ago
   - Shortlisting done 3-7 days ago
   - Interviews scheduled over next week
   - Offers extended 1-3 days ago

4. **Data Quality**:
   - All names are realistic Indian names
   - Skills match job requirements
   - CGPAs are realistic (8.45 - 9.25)
   - Cover letters explain why candidate is suitable
   - Mentor feedback is constructive and professional

5. **Demo Flow Recommendation**:
   - Start with Admin view (show companies)
   - Move to Recruiter (show job posts)
   - Show Student view (multiple students with applications)
   - Highlight Mentor role (reviews and feedback)
   - Return to Recruiter (shortlisting with mentor input)
   - Show interview schedules
   - End with successful placements (Sneha & Rahul)

## Troubleshooting

If you don't see the demo data:

1. Ensure migrations have been applied:
   - Check that `20251003235900_extend_application_status_enum.sql` is applied
   - Check that `20251004000000_seed_realistic_demo_data.sql` is applied

2. If using Supabase:
   - Verify migrations are pushed to your Supabase project
   - Check Database → Tables to see if data exists

3. If authentication fails:
   - Demo users need to be created in Supabase Auth
   - Migration only creates profile data, not auth users
   - You may need to manually create auth users with these emails

## Summary

This demo showcases a fully functional campus placement portal with:
- ✅ **3 Companies** (Google, Amazon, Microsoft)
- ✅ **3 Job Opportunities** (Backend, Frontend, ML roles)
- ✅ **5 Students** with diverse backgrounds
- ✅ **11 Applications** showing complete workflow
- ✅ **7 Interviews** scheduled/completed
- ✅ **2 Placements** with certificates (Rahul @ Microsoft, Sneha @ Google)
- ✅ **4 User Roles** demonstrating end-to-end process
- ✅ **Realistic Data** - no placeholders, professional content throughout

Perfect for project demonstrations, client presentations, and system walkthroughs!
