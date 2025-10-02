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
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, User, Mail, UserPlus, UserCheck, X, GraduationCap } from "lucide-react"
import MyStudents from "./MyStudents"

interface ContextType {
  user: any
  profile: any
}

export default function Students() {
  const { profile } = useOutletContext<ContextType>()

  // If faculty mentor, show MyStudents component
  if (profile?.role === "faculty_mentor") {
    return <MyStudents />
  }

  // Otherwise show placement officer view
  return <PlacementOfficerStudents profile={profile} />
}

function PlacementOfficerStudents({ profile }: { profile: any }) {
  const [students, setStudents] = useState<any[]>([])
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [mentorFilter, setMentorFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [selectedMentorId, setSelectedMentorId] = useState("")
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch all students
      const { data: studentProfiles, error: studentError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("full_name")

      if (studentError) throw studentError

      // Fetch all mentors
      const { data: mentorProfiles, error: mentorError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "faculty_mentor")
        .order("full_name")

      if (mentorError) throw mentorError

      setMentors(mentorProfiles || [])

      // Fetch mentor assignments
      const { data: assignments, error: assignmentError } = await supabase
        .from("mentor_student_assignments")
        .select("*")
        .eq("is_active", true)

      if (assignmentError) throw assignmentError

      // Combine data
      const studentsWithMentors = (studentProfiles || []).map((student) => {
        const assignment = assignments?.find((a) => a.student_id === student.user_id)
        const mentor = assignment ? mentorProfiles?.find((m) => m.user_id === assignment.mentor_id) : null

        return {
          ...student,
          mentor_assignment: assignment,
          mentor: mentor,
        }
      })

      setStudents(studentsWithMentors)
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const assignMentor = async () => {
    if (!selectedStudent || !selectedMentorId) return

    try {
      // Check if assignment already exists
      if (selectedStudent.mentor_assignment) {
        // Update existing assignment
        const { error } = await supabase
          .from("mentor_student_assignments")
          .update({
            mentor_id: selectedMentorId,
            assigned_by: profile.user_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedStudent.mentor_assignment.id)

        if (error) throw error
      } else {
        // Create new assignment
        const { error } = await supabase.from("mentor_student_assignments").insert({
          mentor_id: selectedMentorId,
          student_id: selectedStudent.user_id,
          assigned_by: profile.user_id,
          is_active: true,
        })

        if (error) throw error
      }

      toast({
        title: "Mentor assigned successfully",
        description: `${selectedStudent.full_name} has been assigned to the selected mentor.`,
      })

      setShowAssignDialog(false)
      setSelectedStudent(null)
      setSelectedMentorId("")
      fetchData()
    } catch (error: any) {
      toast({
        title: "Error assigning mentor",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const removeMentorAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from("mentor_student_assignments")
        .update({ is_active: false })
        .eq("id", assignmentId)

      if (error) throw error

      toast({
        title: "Mentor assignment removed",
        description: "The mentor has been unassigned from this student.",
      })

      fetchData()
    } catch (error: any) {
      toast({
        title: "Error removing assignment",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter

    const matchesMentor =
      mentorFilter === "all" ||
      (mentorFilter === "assigned" && student.mentor) ||
      (mentorFilter === "unassigned" && !student.mentor)

    return matchesSearch && matchesDepartment && matchesMentor
  })

  const departments = Array.from(new Set(students.map((s) => s.department).filter(Boolean)))
  const assignedCount = students.filter((s) => s.mentor).length
  const unassignedCount = students.filter((s) => !s.mentor).length

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
        <h1 className="text-3xl font-bold text-foreground">Student Management</h1>
        <p className="text-muted-foreground">Assign faculty mentors to students and manage relationships</p>
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
        <Card
          className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold text-green-600">{assignedCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold text-yellow-600">{unassignedCount}</p>
              </div>
              <UserPlus className="h-8 w-8 text-yellow-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mentors</p>
                <p className="text-2xl font-bold text-blue-600">{mentors.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
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
              <label className="text-sm font-medium">Mentor Status</label>
              <Select value={mentorFilter} onValueChange={setMentorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
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
            style={{ animationDelay: `${0.5 + index * 0.05}s` }}
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
                {student.mentor ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <UserCheck className="h-3 w-3 mr-1" />
                    Assigned
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <UserPlus className="h-3 w-3 mr-1" />
                    Unassigned
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{student.email}</span>
                </div>
                {student.mentor && (
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-1">Current Mentor:</p>
                    <p className="text-sm text-blue-800">{student.mentor.full_name}</p>
                    <p className="text-xs text-blue-600">{student.mentor.department}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border/50">
                <Dialog
                  open={showAssignDialog && selectedStudent?.user_id === student.user_id}
                  onOpenChange={(open) => {
                    setShowAssignDialog(open)
                    if (open) {
                      setSelectedStudent(student)
                      setSelectedMentorId(student.mentor?.user_id || "")
                    } else {
                      setSelectedStudent(null)
                      setSelectedMentorId("")
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      {student.mentor ? "Change" : "Assign"} Mentor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Assign Faculty Mentor</DialogTitle>
                      <DialogDescription>Select a faculty mentor for {student.full_name}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Mentor</Label>
                        <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a mentor" />
                          </SelectTrigger>
                          <SelectContent>
                            {mentors.map((mentor) => (
                              <SelectItem key={mentor.user_id} value={mentor.user_id}>
                                {mentor.full_name} - {mentor.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={assignMentor} className="w-full" disabled={!selectedMentorId}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Assign Mentor
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {student.mentor && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeMentorAssignment(student.mentor_assignment.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
              {searchTerm || departmentFilter !== "all" || mentorFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : "No students are currently registered in the system."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
