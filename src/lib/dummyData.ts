// Dummy data store for pure frontend demo
// This replaces all database/API calls with static data

export interface DummyUser {
  id: string
  email: string
  password: string
  role: "admin" | "student" | "placement_officer" | "faculty_mentor" | "recruiter"
  profile: {
    user_id: string
    full_name: string
    email: string
    phone?: string
    company_name?: string
    industry?: string
    is_verified?: boolean
    department?: string
    cgpa?: string
    skills?: string[]
    resume_url?: string
  }
}

export interface DummyCompany {
  id: string
  name: string
  industry: string
  address: string
  website: string
  description: string
  contact_email: string
  contact_phone: string
  logo_url: string
  status: "verified" | "pending" | "rejected"
  created_at: string
}

export interface DummyOpportunity {
  id: string
  title: string
  company_name: string
  description: string
  type: "internship" | "full-time" | "training"
  location: string
  stipend_amount: string
  min_cgpa: string
  deadline: string
  departments: string[]
  required_skills: string[]
  is_active: boolean
  created_at: string
  interview_rounds: number
  recruiter_id: string
}

export interface DummyApplication {
  id: string
  student_id: string
  opportunity_id: string
  status: "pending" | "under_review" | "shortlisted" | "interview_scheduled" | "selected" | "rejected" | "internship_completed" | "placed"
  applied_at: string
  mentor_approved: boolean
  mentor_approved_at?: string
  mentor_comments?: string
  notes?: string
  resume_url?: string
}

export interface DummyInterview {
  id: string
  application_id: string
  round_number: number
  scheduled_at: string
  interview_mode: "online" | "offline" | "phone"
  meeting_link?: string
  location?: string
  interviewer_name?: string
  status: "scheduled" | "completed" | "cancelled"
  feedback?: string
  result?: string
  created_at: string
}

export interface DummyCertificate {
  id: string
  student_id: string
  application_id?: string
  company_id?: string
  certificate_type: "internship" | "placement" | "training"
  title: string
  description: string
  issue_date: string
  certificate_url: string
  verification_id: string
  status: "generated" | "pending" | "approved"
  created_at: string
}

// Dummy Users - Pre-defined accounts for demo
export const dummyUsers: DummyUser[] = [
  {
    id: "admin-1",
    email: "admin@university.edu",
    password: "admin123",
    role: "admin",
    profile: {
      user_id: "admin-1",
      full_name: "Dr. Sarah Johnson",
      email: "admin@university.edu",
      phone: "+1 (555) 001-0001",
    },
  },
  {
    id: "placement-1",
    email: "placement@university.edu",
    password: "placement123",
    role: "placement_officer",
    profile: {
      user_id: "placement-1",
      full_name: "Michael Chen",
      email: "placement@university.edu",
      phone: "+1 (555) 001-0002",
    },
  },
  {
    id: "mentor-1",
    email: "mentor@university.edu",
    password: "mentor123",
    role: "faculty_mentor",
    profile: {
      user_id: "mentor-1",
      full_name: "Prof. Emily Rodriguez",
      email: "mentor@university.edu",
      phone: "+1 (555) 001-0003",
    },
  },
  {
    id: "recruiter-1",
    email: "recruiter@techcorp.com",
    password: "recruiter123",
    role: "recruiter",
    profile: {
      user_id: "recruiter-1",
      full_name: "David Thompson",
      email: "recruiter@techcorp.com",
      phone: "+1 (555) 100-0001",
      company_name: "TechCorp Solutions",
      industry: "Information Technology",
      is_verified: true,
    },
  },
  {
    id: "recruiter-2",
    email: "hr@innovatelab.com",
    password: "recruiter123",
    role: "recruiter",
    profile: {
      user_id: "recruiter-2",
      full_name: "Jennifer Martinez",
      email: "hr@innovatelab.com",
      phone: "+1 (555) 100-0002",
      company_name: "InnovateLabs",
      industry: "Artificial Intelligence",
      is_verified: true,
    },
  },
  {
    id: "student-1",
    email: "rahul.sharma@university.edu",
    password: "student123",
    role: "student",
    profile: {
      user_id: "student-1",
      full_name: "Rahul Sharma",
      email: "rahul.sharma@university.edu",
      phone: "+1 (555) 200-0001",
      department: "Computer Science",
      cgpa: "8.5",
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      resume_url: "/resumes/rahul-sharma.pdf",
    },
  },
  {
    id: "student-2",
    email: "priya.patel@university.edu",
    password: "student123",
    role: "student",
    profile: {
      user_id: "student-2",
      full_name: "Priya Patel",
      email: "priya.patel@university.edu",
      phone: "+1 (555) 200-0002",
      department: "Computer Science",
      cgpa: "9.2",
      skills: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes"],
      resume_url: "/resumes/priya-patel.pdf",
    },
  },
  {
    id: "student-3",
    email: "arjun.kumar@university.edu",
    password: "student123",
    role: "student",
    profile: {
      user_id: "student-3",
      full_name: "Arjun Kumar",
      email: "arjun.kumar@university.edu",
      phone: "+1 (555) 200-0003",
      department: "Information Technology",
      cgpa: "8.8",
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
      resume_url: "/resumes/arjun-kumar.pdf",
    },
  },
  {
    id: "student-4",
    email: "sneha.singh@university.edu",
    password: "student123",
    role: "student",
    profile: {
      user_id: "student-4",
      full_name: "Sneha Singh",
      email: "sneha.singh@university.edu",
      phone: "+1 (555) 200-0004",
      department: "Computer Science",
      cgpa: "9.0",
      skills: ["React", "Angular", "UI/UX Design", "TypeScript", "CSS"],
      resume_url: "/resumes/sneha-singh.pdf",
    },
  },
  {
    id: "student-5",
    email: "vikram.reddy@university.edu",
    password: "student123",
    role: "student",
    profile: {
      user_id: "student-5",
      full_name: "Vikram Reddy",
      email: "vikram.reddy@university.edu",
      phone: "+1 (555) 200-0005",
      department: "Electronics",
      cgpa: "8.3",
      skills: ["C++", "Python", "IoT", "Embedded Systems", "Arduino"],
      resume_url: "/resumes/vikram-reddy.pdf",
    },
  },
]

// Dummy Companies
export const dummyCompanies: DummyCompany[] = [
  {
    id: "company-1",
    name: "TechCorp Solutions",
    industry: "Information Technology",
    address: "123 Tech Street, San Francisco, CA 94105",
    website: "https://techcorp.example.com",
    description: "Leading provider of enterprise software solutions and cloud services.",
    contact_email: "hr@techcorp.com",
    contact_phone: "+1 (555) 100-0001",
    logo_url: "/logos/techcorp.png",
    status: "verified",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "company-2",
    name: "InnovateLabs",
    industry: "Artificial Intelligence",
    address: "456 Innovation Ave, Boston, MA 02101",
    website: "https://innovatelabs.example.com",
    description: "Pioneering AI research and development for next-generation applications.",
    contact_email: "careers@innovatelabs.com",
    contact_phone: "+1 (555) 100-0002",
    logo_url: "/logos/innovatelabs.png",
    status: "verified",
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "company-3",
    name: "DataFlow Analytics",
    industry: "Data Science",
    address: "789 Data Drive, Austin, TX 78701",
    website: "https://dataflow.example.com",
    description: "Advanced data analytics and business intelligence solutions.",
    contact_email: "jobs@dataflow.com",
    contact_phone: "+1 (555) 100-0003",
    logo_url: "/logos/dataflow.png",
    status: "verified",
    created_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "company-4",
    name: "CloudNine Systems",
    industry: "Cloud Computing",
    address: "321 Cloud Blvd, Seattle, WA 98101",
    website: "https://cloudnine.example.com",
    description: "Cloud infrastructure and DevOps automation platform.",
    contact_email: "recruiting@cloudnine.com",
    contact_phone: "+1 (555) 100-0004",
    logo_url: "/logos/cloudnine.png",
    status: "verified",
    created_at: "2024-02-10T10:00:00Z",
  },
]

// Dummy Opportunities
export const dummyOpportunities: DummyOpportunity[] = [
  {
    id: "opp-1",
    title: "Software Development Intern",
    company_name: "TechCorp Solutions",
    description: "Join our engineering team to work on cutting-edge web applications. You'll collaborate with senior developers, participate in code reviews, and contribute to real-world projects used by millions of users.",
    type: "internship",
    location: "San Francisco, CA (Hybrid)",
    stipend_amount: "$2500/month",
    min_cgpa: "7.5",
    deadline: "2024-12-31",
    departments: ["Computer Science", "Information Technology"],
    required_skills: ["JavaScript", "React", "Node.js", "Git"],
    is_active: true,
    created_at: "2024-11-01T10:00:00Z",
    interview_rounds: 3,
    recruiter_id: "recruiter-1",
  },
  {
    id: "opp-2",
    title: "Machine Learning Research Intern",
    company_name: "InnovateLabs",
    description: "Work alongside our AI research team on state-of-the-art machine learning projects. Gain hands-on experience with neural networks, computer vision, and NLP applications.",
    type: "internship",
    location: "Boston, MA (On-site)",
    stipend_amount: "$3000/month",
    min_cgpa: "8.0",
    deadline: "2024-12-25",
    departments: ["Computer Science", "Information Technology", "Electronics"],
    required_skills: ["Python", "TensorFlow", "PyTorch", "Machine Learning"],
    is_active: true,
    created_at: "2024-11-05T10:00:00Z",
    interview_rounds: 2,
    recruiter_id: "recruiter-2",
  },
  {
    id: "opp-3",
    title: "Full Stack Developer",
    company_name: "DataFlow Analytics",
    description: "Full-time position for experienced developers. Build scalable data visualization dashboards and backend APIs. Work with modern tech stack including React, Node.js, and PostgreSQL.",
    type: "full-time",
    location: "Austin, TX (Remote)",
    stipend_amount: "$85,000/year",
    min_cgpa: "7.0",
    deadline: "2025-01-15",
    departments: ["Computer Science", "Information Technology"],
    required_skills: ["React", "Node.js", "SQL", "REST APIs"],
    is_active: true,
    created_at: "2024-11-10T10:00:00Z",
    interview_rounds: 4,
    recruiter_id: "recruiter-1",
  },
  {
    id: "opp-4",
    title: "DevOps Engineering Intern",
    company_name: "CloudNine Systems",
    description: "Learn cloud infrastructure management, CI/CD pipelines, and containerization. Work with AWS, Docker, and Kubernetes in a production environment.",
    type: "internship",
    location: "Seattle, WA (Hybrid)",
    stipend_amount: "$2800/month",
    min_cgpa: "7.5",
    deadline: "2024-12-28",
    departments: ["Computer Science", "Information Technology"],
    required_skills: ["AWS", "Docker", "Linux", "Python"],
    is_active: true,
    created_at: "2024-11-12T10:00:00Z",
    interview_rounds: 3,
    recruiter_id: "recruiter-2",
  },
]

// Dummy Applications
export const dummyApplications: DummyApplication[] = [
  // Applications for opp-1 (Software Development Intern at TechCorp)
  {
    id: "app-1",
    student_id: "student-1",
    opportunity_id: "opp-1",
    status: "shortlisted",
    applied_at: "2024-11-15T09:30:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-16T14:00:00Z",
    mentor_comments: "Excellent candidate with strong JavaScript skills. Recommended for interview.",
    notes: "Previous internship experience at startup",
    resume_url: "/resumes/rahul-sharma.pdf",
  },
  {
    id: "app-2",
    student_id: "student-2",
    opportunity_id: "opp-1",
    status: "under_review",
    applied_at: "2024-11-16T10:00:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-17T11:00:00Z",
    mentor_comments: "Strong technical background. Good fit for backend development.",
    resume_url: "/resumes/priya-patel.pdf",
  },
  {
    id: "app-3",
    student_id: "student-4",
    opportunity_id: "opp-1",
    status: "interview_scheduled",
    applied_at: "2024-11-14T15:20:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-15T16:30:00Z",
    mentor_comments: "Outstanding frontend skills and UI/UX design experience.",
    resume_url: "/resumes/sneha-singh.pdf",
  },

  // Applications for opp-2 (ML Research Intern at InnovateLabs)
  {
    id: "app-4",
    student_id: "student-2",
    opportunity_id: "opp-2",
    status: "selected",
    applied_at: "2024-11-10T11:00:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-11T10:00:00Z",
    mentor_comments: "Top performer in ML coursework. Highly recommended.",
    notes: "Completed ML research project",
    resume_url: "/resumes/priya-patel.pdf",
  },
  {
    id: "app-5",
    student_id: "student-3",
    opportunity_id: "opp-2",
    status: "interview_scheduled",
    applied_at: "2024-11-11T14:30:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-12T09:00:00Z",
    mentor_comments: "Strong ML fundamentals and good academic record.",
    resume_url: "/resumes/arjun-kumar.pdf",
  },

  // Applications for opp-3 (Full Stack Developer at DataFlow)
  {
    id: "app-6",
    student_id: "student-1",
    opportunity_id: "opp-3",
    status: "under_review",
    applied_at: "2024-11-18T10:00:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-19T11:00:00Z",
    mentor_comments: "Ready for full-time role. Strong problem-solving skills.",
    resume_url: "/resumes/rahul-sharma.pdf",
  },
  {
    id: "app-7",
    student_id: "student-4",
    opportunity_id: "opp-3",
    status: "shortlisted",
    applied_at: "2024-11-17T16:00:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-18T10:00:00Z",
    mentor_comments: "Excellent portfolio of web projects.",
    resume_url: "/resumes/sneha-singh.pdf",
  },

  // Applications for opp-4 (DevOps Intern at CloudNine)
  {
    id: "app-8",
    student_id: "student-5",
    opportunity_id: "opp-4",
    status: "pending",
    applied_at: "2024-11-20T09:00:00Z",
    mentor_approved: false,
    resume_url: "/resumes/vikram-reddy.pdf",
  },
  {
    id: "app-9",
    student_id: "student-3",
    opportunity_id: "opp-4",
    status: "under_review",
    applied_at: "2024-11-19T13:00:00Z",
    mentor_approved: true,
    mentor_approved_at: "2024-11-20T10:00:00Z",
    mentor_comments: "Good understanding of cloud technologies.",
    resume_url: "/resumes/arjun-kumar.pdf",
  },
]

// Dummy Interviews
export const dummyInterviews: DummyInterview[] = [
  {
    id: "interview-1",
    application_id: "app-3",
    round_number: 1,
    scheduled_at: "2024-12-05T10:00:00Z",
    interview_mode: "online",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    interviewer_name: "Sarah Chen - Technical Lead",
    status: "scheduled",
    created_at: "2024-11-18T14:00:00Z",
  },
  {
    id: "interview-2",
    application_id: "app-4",
    round_number: 1,
    scheduled_at: "2024-11-22T14:00:00Z",
    interview_mode: "online",
    meeting_link: "https://zoom.us/j/123456789",
    interviewer_name: "Dr. James Wilson - Research Director",
    status: "completed",
    feedback: "Excellent understanding of ML concepts. Strong candidate.",
    result: "passed",
    created_at: "2024-11-12T10:00:00Z",
  },
  {
    id: "interview-3",
    application_id: "app-4",
    round_number: 2,
    scheduled_at: "2024-11-28T11:00:00Z",
    interview_mode: "offline",
    location: "InnovateLabs Office, Boston, MA",
    interviewer_name: "Panel Interview - Engineering Team",
    status: "completed",
    feedback: "Outstanding performance. Offered position.",
    result: "passed",
    created_at: "2024-11-23T09:00:00Z",
  },
  {
    id: "interview-4",
    application_id: "app-5",
    round_number: 1,
    scheduled_at: "2024-12-03T15:30:00Z",
    interview_mode: "online",
    meeting_link: "https://teams.microsoft.com/meet/xyz123",
    interviewer_name: "Dr. Lisa Kumar - Senior Researcher",
    status: "scheduled",
    created_at: "2024-11-25T11:00:00Z",
  },
]

// Dummy Certificates
export const dummyCertificates: DummyCertificate[] = [
  {
    id: "cert-1",
    student_id: "student-2",
    application_id: "app-4",
    company_id: "company-2",
    certificate_type: "internship",
    title: "Machine Learning Research Internship",
    description: "Successfully completed 3-month research internship in Machine Learning and AI",
    issue_date: "2024-11-30",
    certificate_url: "/certificates/cert-app-4.pdf",
    verification_id: "CERT-2024-INNOVATE-001",
    status: "generated",
    created_at: "2024-11-30T10:00:00Z",
  },
]

// Storage for runtime state (simulates database updates)
export class DummyDataStore {
  private static instance: DummyDataStore
  
  users: DummyUser[] = [...dummyUsers]
  companies: DummyCompany[] = [...dummyCompanies]
  opportunities: DummyOpportunity[] = [...dummyOpportunities]
  applications: DummyApplication[] = [...dummyApplications]
  interviews: DummyInterview[] = [...dummyInterviews]
  certificates: DummyCertificate[] = [...dummyCertificates]
  
  currentUser: DummyUser | null = null

  private constructor() {}

  static getInstance(): DummyDataStore {
    if (!DummyDataStore.instance) {
      DummyDataStore.instance = new DummyDataStore()
    }
    return DummyDataStore.instance
  }

  // Auth methods
  login(email: string, password: string): DummyUser | null {
    const user = this.users.find(u => u.email === email && u.password === password)
    if (user) {
      this.currentUser = user
      return user
    }
    return null
  }

  logout() {
    this.currentUser = null
  }

  getCurrentUser(): DummyUser | null {
    return this.currentUser
  }

  // Company methods
  addCompany(company: Omit<DummyCompany, "id" | "created_at">): DummyCompany {
    const newCompany: DummyCompany = {
      ...company,
      id: `company-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    this.companies.push(newCompany)
    return newCompany
  }

  updateCompany(id: string, updates: Partial<DummyCompany>): DummyCompany | null {
    const index = this.companies.findIndex(c => c.id === id)
    if (index !== -1) {
      this.companies[index] = { ...this.companies[index], ...updates }
      return this.companies[index]
    }
    return null
  }

  deleteCompany(id: string): boolean {
    const index = this.companies.findIndex(c => c.id === id)
    if (index !== -1) {
      this.companies.splice(index, 1)
      return true
    }
    return false
  }

  // Opportunity methods
  addOpportunity(opportunity: Omit<DummyOpportunity, "id" | "created_at">): DummyOpportunity {
    const newOpp: DummyOpportunity = {
      ...opportunity,
      id: `opp-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    this.opportunities.push(newOpp)
    return newOpp
  }

  updateOpportunity(id: string, updates: Partial<DummyOpportunity>): DummyOpportunity | null {
    const index = this.opportunities.findIndex(o => o.id === id)
    if (index !== -1) {
      this.opportunities[index] = { ...this.opportunities[index], ...updates }
      return this.opportunities[index]
    }
    return null
  }

  // Application methods
  addApplication(application: Omit<DummyApplication, "id" | "applied_at">): DummyApplication {
    const newApp: DummyApplication = {
      ...application,
      id: `app-${Date.now()}`,
      applied_at: new Date().toISOString(),
    }
    this.applications.push(newApp)
    return newApp
  }

  updateApplication(id: string, updates: Partial<DummyApplication>): DummyApplication | null {
    const index = this.applications.findIndex(a => a.id === id)
    if (index !== -1) {
      this.applications[index] = { ...this.applications[index], ...updates }
      return this.applications[index]
    }
    return null
  }

  // Interview methods
  addInterview(interview: Omit<DummyInterview, "id" | "created_at">): DummyInterview {
    const newInterview: DummyInterview = {
      ...interview,
      id: `interview-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    this.interviews.push(newInterview)
    return newInterview
  }

  updateInterview(id: string, updates: Partial<DummyInterview>): DummyInterview | null {
    const index = this.interviews.findIndex(i => i.id === id)
    if (index !== -1) {
      this.interviews[index] = { ...this.interviews[index], ...updates }
      return this.interviews[index]
    }
    return null
  }

  // Certificate methods
  addCertificate(certificate: Omit<DummyCertificate, "id" | "created_at">): DummyCertificate {
    const newCert: DummyCertificate = {
      ...certificate,
      id: `cert-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    this.certificates.push(newCert)
    return newCert
  }

  // Helper methods
  getApplicationsForOpportunity(opportunityId: string): DummyApplication[] {
    return this.applications.filter(a => a.opportunity_id === opportunityId)
  }

  getApplicationsForStudent(studentId: string): DummyApplication[] {
    return this.applications.filter(a => a.student_id === studentId)
  }

  getInterviewsForApplication(applicationId: string): DummyInterview[] {
    return this.interviews.filter(i => i.application_id === applicationId)
  }

  getCertificatesForStudent(studentId: string): DummyCertificate[] {
    return this.certificates.filter(c => c.student_id === studentId)
  }

  getUserProfile(userId: string): any {
    const user = this.users.find(u => u.id === userId)
    return user ? user.profile : null
  }
}

// Export singleton instance
export const dummyDataStore = DummyDataStore.getInstance()
