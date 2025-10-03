"use client"

import { useState, useEffect } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  Briefcase,
  Search,
  Users,
  Download,
  Eye,
  Calendar,
  Filter,
  TrendingUp,
  Building2,
  GraduationCap,
  Award,
} from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

export default function MyOpportunities() {
  const { profile } = useOutletContext<ContextType>()
  const navigate = useNavigate()
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [applicants, setApplicants] = useState<any[]>([])
  const [sortBy, setSortBy] = useState("applied_at")
  const { toast } = useToast()

  useEffect(() => {
    fetchOpportunities()
  }, [profile])

  const fetchOpportunities = async () => {
    if (!profile) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("posted_by", profile.user_id)
        .order("created_at", { ascending: false })

      if (error) throw error

      const opportunitiesWithCounts = await Promise.all(
        (data || []).map(async (opp) => {
          const { count } = await supabase
            .from("applications")
            .select("*", { count: "exact", head: true })
            .eq("opportunity_id", opp.id)

          return { ...opp, applicant_count: count || 0 }
        }),
      )

      setOpportunities(opportunitiesWithCounts)
    } catch (error: any) {
      toast({
        title: "Error loading opportunities",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchApplicants = async (opportunityId: string) => {
    try {
      const { data: applications, error } = await supabase
        .from("applications")
        .select("*, opportunities(title, company_name)")
        .eq("opportunity_id", opportunityId)
        .order(sortBy, { ascending: sortBy === "applied_at" })

      if (error) throw error

      const applicantsWithDetails = await Promise.all(
        (applications || []).map(async (app) => {
          const [profileData, studentData] = await Promise.all([
            supabase.from("profiles").select("*").eq("user_id", app.student_id).single(),
            supabase.from("student_profiles").select("*").eq("user_id", app.student_id).maybeSingle(),
          ])

          return {
            ...app,
            profile: profileData.data,
            student_profile: studentData.data,
          }
        }),
      )

      setApplicants(applicantsWithDetails)
    } catch (error: any) {
      toast({
        title: "Error loading applicants",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const downloadResume = async (resumeUrl: string, studentName: string) => {
    if (!resumeUrl) {
      toast({
        title: "No resume available",
        description: "This student hasn't uploaded a resume yet.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase.storage.from("resumes").download(resumeUrl)

      if (error) throw error

      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = `${studentName.replace(/\s+/g, "_")}_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Resume downloaded",
        description: `Resume for ${studentName} has been downloaded successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Error downloading resume",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const viewResume = async (resumeUrl: string) => {
    if (!resumeUrl) {
      toast({
        title: "No resume available",
        description: "This student hasn't uploaded a resume yet.",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase.storage.from("resumes").createSignedUrl(resumeUrl, 300)

      if (error) throw error

      window.open(data.signedUrl, "_blank")
    } catch (error: any) {
      toast({
        title: "Error viewing resume",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || opp.type === typeFilter
    return matchesSearch && matchesType
  })

  const sortedApplicants = [...applicants].sort((a, b) => {
    if (sortBy === "cgpa") {
      return (b.student_profile?.cgpa || 0) - (a.student_profile?.cgpa || 0)
    }
    if (sortBy === "applied_at") {
      return new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
    }
    return 0
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading opportunities...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Opportunities</h1>
          <p className="text-muted-foreground">Manage your posted opportunities and view applicants</p>
        </div>
        <Button
          onClick={() => navigate("/opportunities/new")}
          className="bg-gradient-primary hover:shadow-glow hover:scale-105 transition-all duration-300"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Post New Opportunity
        </Button>
      </div>

      <Card
        className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 animate-fade-in"
        style={{ animationDelay: "0.1s" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="full_time">Full Time</SelectItem>
                  <SelectItem value="part_time">Part Time</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp, index) => (
          <Card
            key={opp.id}
            className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${0.2 + index * 0.05}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">{opp.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Building2 className="h-4 w-4" />
                    <span>{opp.company_name}</span>
                  </CardDescription>
                </div>
                <Badge className="ml-2">{opp.type.charAt(0).toUpperCase() + opp.type.slice(1).replace("_", " ")}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{opp.applicant_count}</p>
                  <p className="text-xs text-muted-foreground">Applicants</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {opp.deadline ? new Date(opp.deadline).toLocaleDateString() : "No deadline"}
                  </p>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{opp.is_active ? "Active" : "Closed"}</p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-gradient-primary/10 hover:bg-gradient-primary/20 transition-all duration-300"
                    onClick={() => {
                      setSelectedOpportunity(opp)
                      fetchApplicants(opp.id)
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View {opp.applicant_count} Applicant{opp.applicant_count !== 1 ? "s" : ""}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{opp.title} - Applicants</DialogTitle>
                    <DialogDescription>{opp.company_name}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Sort by:</span>
                      </div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied_at">Application Date</SelectItem>
                          <SelectItem value="cgpa">CGPA (High to Low)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {sortedApplicants.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No applications yet for this opportunity
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {sortedApplicants.map((applicant) => (
                          <Card key={applicant.id} className="bg-muted/30 hover:shadow-md transition-all duration-200">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                      <GraduationCap className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">{applicant.profile?.full_name}</h4>
                                      <p className="text-sm text-muted-foreground">{applicant.profile?.email}</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                    <div>
                                      <p className="text-xs text-muted-foreground">CGPA</p>
                                      <p className="font-semibold flex items-center space-x-1">
                                        <Award className="h-4 w-4 text-yellow-600" />
                                        <span>{applicant.student_profile?.cgpa || "N/A"}</span>
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Department</p>
                                      <p className="font-semibold text-sm">
                                        {applicant.student_profile?.department || "N/A"}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Applied</p>
                                      <p className="font-semibold text-sm">
                                        {new Date(applicant.applied_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Status</p>
                                      <Badge variant="outline" className="text-xs">
                                        {applicant.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  {applicant.student_profile?.skills && applicant.student_profile.skills.length > 0 && (
                                    <div className="pt-2">
                                      <p className="text-xs text-muted-foreground mb-1">Skills</p>
                                      <div className="flex flex-wrap gap-1">
                                        {applicant.student_profile.skills.slice(0, 5).map((skill: string) => (
                                          <Badge key={skill} variant="secondary" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                        {applicant.student_profile.skills.length > 5 && (
                                          <Badge variant="secondary" className="text-xs">
                                            +{applicant.student_profile.skills.length - 5} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => viewResume(applicant.student_profile?.resume_url)}
                                    disabled={!applicant.student_profile?.resume_url}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      downloadResume(
                                        applicant.student_profile?.resume_url,
                                        applicant.profile?.full_name,
                                      )
                                    }
                                    disabled={!applicant.student_profile?.resume_url}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No opportunities found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or post a new opportunity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
