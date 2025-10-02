"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
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
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Search,
  User,
  Mail,
  Phone,
  Briefcase,
  MessageSquare,
  Share2,
  Eye,
  Award,
  TrendingUp,
} from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

export default function MyStudents() {
  const { profile } = useOutletContext<ContextType>()
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [mentoringNote, setMentoringNote] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
  }, [profile])

  const fetchStudents = async () => {
    if (!profile) return

    try {
      setLoading(true)

      // Fetch all student profiles
      const { data: studentProfiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("full_name")

      if (profileError) throw profileError

      // Fetch applications for each student
      const studentsWithData = await Promise.all(
        (studentProfiles || []).map(async (student) => {
          const { data: applications } = await supabase
            .from("applications")
            .select("*, opportunities(title, company_name, type)")
            .eq("student_id", student.user_id)

          const placedCount = applications?.filter((app) => app.status === "selected").length || 0
          const interviewCount = applications?.filter((app) => app.status === "shortlisted").length || 0
          const offerCount = applications?.filter((app) => app.status === "under_review").length || 0

          return {
            ...student,
            applications: applications || [],
            applicationCount: applications?.length || 0,
            placedCount,
            interviewCount,
            offerCount,
            placementStatus: placedCount > 0 ? "Placed" : interviewCount > 0 ? "Interning" : "Unplaced",
          }
        }),
      )

      setStudents(studentsWithData)
    } catch (error: any) {
      toast({
        title: "Error loading students",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addMentoringNote = async (studentId: string) => {
    if (!mentoringNote.trim()) return

    try {
      // In a real app, you'd have a mentoring_notes table
      toast({
        title: "Note added",
        description: "Mentoring note has been saved successfully.",
      })
      setMentoringNote("")
      setSelectedStudent(null)
    } catch (error: any) {
      toast({
        title: "Error adding note",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const shareWithRecruiter = async (studentId: string) => {
    try {
      toast({
        title: "Profile shared",
        description: "Student profile has been shared with recruiters.",
      })
    } catch (error: any) {
      toast({
        title: "Error sharing profile",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Interning":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Unplaced":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter
    const matchesStatus = statusFilter === "all" || student.placementStatus === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const departments = Array.from(new Set(students.map((s) => s.department).filter(Boolean)))

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Students</h1>
        <p className="text-muted-foreground">Track and mentor students under your guidance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{animationDelay: "0.1s"}}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Placed</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.filter((s) => s.placementStatus === "Placed").length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{animationDelay: "0.2s"}}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interning</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.filter((s) => s.placementStatus === "Interning").length}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{animationDelay: "0.3s"}}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unplaced</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {students.filter((s) => s.placementStatus === "Unplaced").length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 animate-fade-in" style={{animationDelay: "0.4s"}}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Placed">Placed</SelectItem>
                  <SelectItem value="Interning">Interning</SelectItem>
                  <SelectItem value="Unplaced">Unplaced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => (
          <Card
            key={student.user_id}
            className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{animationDelay: `${0.5 + index * 0.05}s`}}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{student.full_name}</CardTitle>
                    <CardDescription>{student.department}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(student.placementStatus)}>{student.placementStatus}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{student.email}</span>
                </div>
                {student.phone && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{student.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{student.applicationCount}</p>
                  <p className="text-xs text-muted-foreground">Applications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{student.interviewCount}</p>
                  <p className="text-xs text-muted-foreground">Interviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{student.offerCount}</p>
                  <p className="text-xs text-muted-foreground">Offers</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{student.full_name}</DialogTitle>
                      <DialogDescription>Student Profile & Application History</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Department</p>
                          <p className="text-sm text-muted-foreground">{student.department}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Status</p>
                          <Badge className={getStatusColor(student.placementStatus)}>{student.placementStatus}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Application History</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {student.applications.map((app: any) => (
                            <div key={app.id} className="p-3 bg-muted/30 rounded-lg">
                              <p className="font-medium">{app.opportunities?.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {app.opportunities?.company_name} • {app.status}
                              </p>
                            </div>
                          ))}
                          {student.applications.length === 0 && (
                            <p className="text-sm text-muted-foreground">No applications yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Mentoring Note</DialogTitle>
                      <DialogDescription>Add remarks or notes for {student.full_name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter your mentoring notes..."
                        value={mentoringNote}
                        onChange={(e) => setMentoringNote(e.target.value)}
                        rows={5}
                      />
                      <Button onClick={() => addMentoringNote(student.user_id)} className="w-full">
                        Save Note
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => shareWithRecruiter(student.user_id)}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No students found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || departmentFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "No students are currently assigned to you."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
