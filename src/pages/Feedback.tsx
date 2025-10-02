"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, Star, User, Building2, Calendar, Award, CheckCircle } from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

export default function Feedback() {
  const { profile } = useOutletContext<ContextType>()
  const [students, setStudents] = useState<any[]>([])
  const [feedbackList, setFeedbackList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState("")
  const { toast } = useToast()

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    studentId: "",
    companyName: "",
    professionalSkills: 3,
    technicalSkills: 3,
    communication: 3,
    teamwork: 3,
    punctuality: 3,
    discipline: 3,
    employabilityReadiness: 3,
    comments: "",
    studentReflection: "",
  })

  useEffect(() => {
    fetchStudents()
    fetchFeedback()
  }, [profile])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, department")
        .eq("role", "student")
        .order("full_name")

      if (error) throw error
      setStudents(data || [])
    } catch (error: any) {
      toast({
        title: "Error loading students",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      // In a real app, you'd fetch from a feedback table
      // For now, we'll use mock data
      setFeedbackList([])
    } catch (error: any) {
      toast({
        title: "Error loading feedback",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async () => {
    if (!feedbackForm.studentId) {
      toast({
        title: "Student required",
        description: "Please select a student to provide feedback for.",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, you'd insert into a feedback table
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been recorded and will update the student's profile.",
      })

      // Reset form
      setFeedbackForm({
        studentId: "",
        companyName: "",
        professionalSkills: 3,
        technicalSkills: 3,
        communication: 3,
        teamwork: 3,
        punctuality: 3,
        discipline: 3,
        employabilityReadiness: 3,
        comments: "",
        studentReflection: "",
      })
    } catch (error: any) {
      toast({
        title: "Error submitting feedback",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const SkillRating = ({
    label,
    value,
    onChange,
  }: { label: string; value: number; onChange: (val: number) => void }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 cursor-pointer ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => onChange(star)}
            />
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading feedback...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Feedback Management</h1>
        <p className="text-muted-foreground">Provide structured feedback to improve student employability</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold text-foreground">89</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-accent">12</p>
              </div>
              <Calendar className="h-8 w-8 text-accent animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-warning">4.2</p>
              </div>
              <Star className="h-8 w-8 text-warning animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold text-green-600">34</p>
              </div>
              <Award className="h-8 w-8 text-green-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="provide" className="space-y-6 animate-scale-in" style={{ animationDelay: "0.2s" }}>
        <TabsList className="grid w-full grid-cols-2 transition-all duration-300">
          <TabsTrigger value="provide" className="transition-all duration-200 data-[state=active]:shadow-md">Provide Feedback</TabsTrigger>
          <TabsTrigger value="history" className="transition-all duration-200 data-[state=active]:shadow-md">Feedback History</TabsTrigger>
        </TabsList>

        {/* Provide Feedback Tab */}
        <TabsContent value="provide" className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle>Faculty Feedback Form</CardTitle>
              <CardDescription>Provide comprehensive feedback on student performance and employability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Student *</Label>
                  <Select
                    value={feedbackForm.studentId}
                    onValueChange={(val) => setFeedbackForm({ ...feedbackForm, studentId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.user_id} value={student.user_id}>
                          {student.full_name} - {student.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company/Organization (Optional)</Label>
                  <Input
                    placeholder="Enter company name"
                    value={feedbackForm.companyName}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, companyName: e.target.value })}
                  />
                </div>
              </div>

              {/* Professional Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Professional Skills</h3>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <SkillRating
                    label="Communication Skills"
                    value={feedbackForm.communication}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, communication: val })}
                  />
                  <SkillRating
                    label="Teamwork & Collaboration"
                    value={feedbackForm.teamwork}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, teamwork: val })}
                  />
                  <SkillRating
                    label="Punctuality & Time Management"
                    value={feedbackForm.punctuality}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, punctuality: val })}
                  />
                  <SkillRating
                    label="Discipline & Work Ethics"
                    value={feedbackForm.discipline}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, discipline: val })}
                  />
                </div>
              </div>

              {/* Technical Skills */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Technical Skills</h3>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <SkillRating
                    label="Technical Proficiency"
                    value={feedbackForm.technicalSkills}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, technicalSkills: val })}
                  />
                  <SkillRating
                    label="Professional Skills"
                    value={feedbackForm.professionalSkills}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, professionalSkills: val })}
                  />
                </div>
              </div>

              {/* Overall Assessment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Overall Assessment</h3>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                  <SkillRating
                    label="Employability Readiness"
                    value={feedbackForm.employabilityReadiness}
                    onChange={(val) => setFeedbackForm({ ...feedbackForm, employabilityReadiness: val })}
                  />
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-2">
                <Label>Detailed Comments & Recommendations</Label>
                <Textarea
                  placeholder="Provide detailed feedback, strengths, areas for improvement, and recommendations..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  rows={5}
                />
              </div>

              {/* Student Reflection (Optional) */}
              <div className="space-y-2">
                <Label>Student Reflection (Optional)</Label>
                <Textarea
                  placeholder="Student's own reflection on their learning and experience..."
                  value={feedbackForm.studentReflection}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, studentReflection: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                onClick={submitFeedback}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Feedback History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Feedback History</CardTitle>
              <CardDescription>View all feedback provided to students</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No feedback yet</h3>
                  <p className="text-muted-foreground text-center">
                    Start providing feedback to students to see the history here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbackList.map((feedback: any, index: number) => (
                    <Card key={index} className="bg-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{feedback.studentName}</span>
                            </div>
                            {feedback.companyName && (
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{feedback.companyName}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{feedback.date}</span>
                            </div>
                          </div>
                          <Badge variant="outline">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {feedback.overallRating}/5
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
