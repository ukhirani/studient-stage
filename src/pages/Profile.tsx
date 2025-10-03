"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Save,
  Plus,
  X,
  Github,
  Linkedin,
  FileText,
  Award,
  Briefcase,
  Calendar,
  TrendingUp,
  CheckCircle,
  Upload,
} from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Chemical",
  "Electrical",
  "Information Technology",
]

// Mock career log data
const mockCareerLog = [
  {
    id: "1",
    type: "internship",
    title: "Software Engineer Intern",
    company: "Tech Innovations Inc",
    start_date: "2024-05-15",
    end_date: "2024-08-15",
    status: "completed",
    performance_rating: 5,
    certificate_url: "/certificates/cert-001.pdf",
    verification_id: "CERT-2024-AI-001",
    feedback: "Excellent performance throughout the internship. Demonstrated strong technical skills and teamwork.",
    skills_gained: ["React", "Node.js", "MongoDB", "Agile Development"],
    placement_eligible: true,
  },
  {
    id: "2",
    type: "internship",
    title: "Data Analyst Intern",
    company: "DataCorp Analytics",
    start_date: "2024-09-01",
    end_date: "2024-11-30",
    status: "completed",
    performance_rating: 4,
    certificate_url: "/certificates/cert-002.pdf",
    verification_id: "CERT-2024-DA-002",
    feedback: "Strong analytical skills and attention to detail. Successfully completed all assigned projects.",
    skills_gained: ["Python", "SQL", "Tableau", "Data Visualization"],
    placement_eligible: true,
  },
  {
    id: "3",
    type: "placement",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    offer_date: "2024-12-01",
    joining_date: "2025-01-15",
    status: "offer_accepted",
    package: "12 LPA",
    offer_letter_url: "/offers/offer-001.pdf",
  },
  {
    id: "4",
    type: "training",
    title: "AWS Cloud Practitioner Certification",
    organization: "Amazon Web Services",
    completion_date: "2024-10-20",
    status: "completed",
    certificate_url: "/certificates/aws-cert.pdf",
    verification_id: "AWS-2024-CP-12345",
  },
]

export default function Profile() {
  const { profile } = useOutletContext<ContextType>()
  const [loading, setLoading] = useState(false)
  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [skillInput, setSkillInput] = useState("")
  const [careerLog, setCareerLog] = useState<any[]>([])
  const [careerLogLoading, setCareerLogLoading] = useState(false)
  const { toast } = useToast()
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    contact_phone: "",
    department: "",
    year: "",
    // Student-specific fields
    cgpa: "",
    bio: "",
    linkedin_url: "",
    github_url: "",
    resume_url: "",
    skills: [] as string[],
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        contact_phone: profile.contact_phone || "",
        department: profile.department || "",
        year: profile.year?.toString() || "",
        cgpa: "",
        bio: "",
        linkedin_url: "",
        github_url: "",
        resume_url: "",
        skills: [],
      })

      if (profile.role === "student") {
        fetchStudentProfile()
        fetchCareerLog()
      }
    }
  }, [profile])

  const fetchStudentProfile = async () => {
    if (!profile) return

    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", profile.user_id)
        .maybeSingle()

      if (error && error.code !== "PGRST116") throw error

      if (data) {
        setStudentProfile(data)
        setFormData((prev) => ({
          ...prev,
          cgpa: data.cgpa?.toString() || "",
          bio: data.bio || "",
          linkedin_url: "",
          github_url: "",
          resume_url: data.resume_url || "",
          skills: data.skills || [],
        }))
      }
    } catch (error: any) {
      toast({
        title: "Error loading student profile",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const fetchCareerLog = async () => {
    if (!profile) return

    try {
      setCareerLogLoading(true)

      const { data, error } = await supabase
        .from("career_log")
        .select("*")
        .eq("student_id", profile.user_id)
        .order("start_date", { ascending: false })

      if (error) throw error

      const careerLogWithData = await Promise.all(
        (data || []).map(async (entry) => {
          const [companyData, certificateData] = await Promise.all([
            entry.company_id
              ? supabase.from("companies").select("name").eq("id", entry.company_id).single()
              : Promise.resolve({ data: null }),
            entry.certificate_id
              ? supabase.from("certificates").select("certificate_url, title").eq("id", entry.certificate_id).single()
              : Promise.resolve({ data: null }),
          ])

          return {
            ...entry,
            company: companyData.data,
            certificate: certificateData.data,
          }
        }),
      )

      setCareerLog(careerLogWithData)
    } catch (error: any) {
      console.error("[v0] Error loading career log:", error)
      toast({
        title: "Error loading career log",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setCareerLogLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setLoading(true)
    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          contact_phone: formData.contact_phone || null,
          department: formData.department || null,
          year: formData.year ? Number.parseInt(formData.year) : null,
        })
        .eq("user_id", profile.user_id)

      if (profileError) throw profileError

      // Update student profile if user is a student
      if (profile.role === "student") {
        const studentData = {
          cgpa: formData.cgpa ? Number.parseFloat(formData.cgpa) : null,
          bio: formData.bio || null,
          linkedin_url: formData.linkedin_url || null,
          github_url: formData.github_url || null,
          resume_url: formData.resume_url || null,
          skills: formData.skills.length > 0 ? formData.skills : null,
        }

        if (studentProfile) {
          const { error: studentError } = await supabase
            .from("student_profiles")
            .update(studentData)
            .eq("user_id", profile.user_id)

          if (studentError) throw studentError
        } else {
          const { error: studentError } = await supabase.from("student_profiles").insert({
            user_id: profile.user_id,
            ...studentData,
          })

          if (studentError) throw studentError
        }
      }

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "ongoing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "internship":
        return <Briefcase className="h-5 w-5" />
      case "placement":
        return <Building2 className="h-5 w-5" />
      case "training":
        return <Award className="h-5 w-5" />
      case "achievement":
        return <Award className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // Calculate career stats
  const completedInternships = careerLog.filter(
    (item) => item.type === "internship" && item.status === "completed",
  ).length
  const placementOffers = careerLog.filter((item) => item.type === "placement").length
  const certifications = careerLog.filter((item) => item.type === "training" && item.status === "completed").length
  const placementEligible = careerLog.some((item) => item.type === "internship" && item.placement_eligible)

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[1] ? null : e.target.files?.[0] || null
    setResumeFile(file || null)
  }

  const uploadResume = async () => {
    if (!profile) return
    if (!resumeFile) {
      toast({ title: "No file selected", description: "Please choose a PDF to upload.", variant: "destructive" })
      return
    }
    try {
      const fileExt = resumeFile.name.split(".").pop()?.toLowerCase()
      if (fileExt !== "pdf") {
        toast({ title: "Invalid file", description: "Only PDF resumes are allowed.", variant: "destructive" })
        return
      }

      const storagePath = `${profile.user_id}/${Date.now()}-${resumeFile.name}`
      const { error: uploadError } = await supabase.storage.from("resumes").upload(storagePath, resumeFile, {
        cacheControl: "3600",
        upsert: true,
        contentType: "application/pdf",
      })
      if (uploadError) throw uploadError

      // update student profile with storage path
      const { error: updError } = await supabase
        .from("student_profiles")
        .update({ resume_url: storagePath })
        .eq("user_id", profile.user_id)
      if (updError) throw updError

      setFormData((prev) => ({ ...prev, resume_url: storagePath }))
      setResumeFile(null)
      toast({ title: "Resume uploaded", description: "Your resume has been saved successfully." })
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          {profile?.role === "student" && (
            <>
              <TabsTrigger value="academic">Academic & Skills</TabsTrigger>
              <TabsTrigger value="career">Career Log</TabsTrigger>
            </>
          )}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Update your basic profile information</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" value={formData.email} disabled className="pl-10 bg-muted" />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {profile?.role === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {profile?.role === "student" && (
          <TabsContent value="academic">
            <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Academic & Professional Info</span>
                </CardTitle>
                <CardDescription>Update your academic performance and professional profiles</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={formData.cgpa}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cgpa: e.target.value }))}
                        placeholder="8.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself, your interests, and career goals..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin_url"
                          type="url"
                          value={formData.linkedin_url}
                          onChange={(e) => setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub Profile</Label>
                      <div className="relative">
                        <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="github_url"
                          type="url"
                          value={formData.github_url}
                          onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
                          placeholder="https://github.com/yourusername"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume_url">Resume</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="resume_url"
                            type="text"
                            value={formData.resume_url}
                            onChange={(e) => setFormData((prev) => ({ ...prev, resume_url: e.target.value }))}
                            placeholder="Stored path or external link"
                            className="pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          If uploading below, we'll automatically update this with the storage path.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Input type="file" accept=".pdf" onChange={handleResumeFileChange} />
                        <Button type="button" variant="outline" onClick={uploadResume}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-3">
                    <Label>Skills</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="Add a skill..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {profile?.role === "student" && (
          <TabsContent value="career">
            <div className="space-y-6">
              {/* Career Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-4 text-center">
                    <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{completedInternships}</div>
                    <div className="text-xs text-muted-foreground">Internships</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-4 text-center">
                    <Building2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-foreground">{placementOffers}</div>
                    <div className="text-xs text-muted-foreground">Placements</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-foreground">{certifications}</div>
                    <div className="text-xs text-muted-foreground">Certifications</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card border-border/50">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                    <div className="text-2xl font-bold text-foreground">{placementEligible ? "Yes" : "No"}</div>
                    <div className="text-xs text-muted-foreground">Placement Eligible</div>
                  </CardContent>
                </Card>
              </div>

              {/* Career Log Timeline */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Career Log</span>
                  </CardTitle>
                  <CardDescription>
                    Your complete employability record - internships, placements, and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {careerLogLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">Loading career log...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {careerLog.map((item, index) => (
                        <div
                          key={item.id}
                          className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="p-2 bg-primary/10 rounded-lg">{getTypeIcon(item.type)}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground">{item.title}</h3>
                                {item.company && <p className="text-sm text-muted-foreground">{item.company.name}</p>}
                              </div>
                            </div>
                            <Badge className={getStatusColor(item.status)} variant="outline">
                              {item.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {item.start_date && (
                              <div className="flex items-center space-x-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {new Date(item.start_date).toLocaleDateString()}
                                  {item.end_date && ` - ${new Date(item.end_date).toLocaleDateString()}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {item.description && (
                            <div className="mt-3 bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          )}

                          {item.placement_eligible && (
                            <div className="mt-3 flex items-center space-x-2 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Eligible for Placement (PPO)</span>
                            </div>
                          )}

                          <div className="mt-3 flex items-center space-x-2">
                            {item.certificate && (
                              <Button size="sm" variant="outline">
                                <Award className="h-4 w-4 mr-1" />
                                View Certificate
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!careerLogLoading && careerLog.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No career log entries yet</h3>
                      <p className="text-muted-foreground">
                        Complete internships and training programs to build your career log
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        <TabsContent value="settings">
          <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Account Information</h3>
                  <p className="text-sm text-muted-foreground">Your account details and current role</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile?.email || ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={profile?.role?.replace("_", " ").toUpperCase() || ""} disabled className="bg-muted" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Preferences</h3>
                  <p className="text-sm text-muted-foreground">Customize your experience</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about applications and opportunities
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Privacy Settings</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
