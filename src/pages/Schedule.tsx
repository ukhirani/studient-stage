"use client"

import { useState, useEffect } from "react"
import { useOutletContext, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Calendar, Clock, Video, MapPin, User, Building2, CheckCircle, XCircle, AlertCircle, Plus } from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

export default function Schedule() {
  const { profile } = useOutletContext<ContextType>()
  const [searchParams] = useSearchParams()
  const applicationIdFromUrl = searchParams.get("application_id")

  const [interviews, setInterviews] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  const [newInterview, setNewInterview] = useState({
    application_id: applicationIdFromUrl || "",
    date: "",
    time: "",
    duration: "60",
    mode: "video",
    location: "",
    meeting_link: "",
    notes: "",
  })

  useEffect(() => {
    fetchInterviews()
    if (profile?.role === "recruiter" || profile?.role === "placement_officer") {
      fetchShortlistedApplications()
    }

    if (applicationIdFromUrl) {
      setShowCreateDialog(true)
    }
  }, [profile, applicationIdFromUrl])

  const fetchInterviews = async () => {
    if (!profile) return

    try {
      setLoading(true)

      let query = supabase.from("interviews").select(`
        *,
        applications (
          id,
          student_id,
          opportunity_id,
          opportunities (
            title,
            company_name,
            type
          ),
          profiles (
            full_name,
            email
          )
        )
      `)

      // Filter based on role
      if (profile.role === "student") {
        // Get student's interviews through their applications
        const { data: studentApps } = await supabase.from("applications").select("id").eq("student_id", profile.user_id)

        const appIds = studentApps?.map((app) => app.id) || []
        query = query.in("application_id", appIds)
      }

      const { data, error } = await query.order("date", { ascending: true }).order("time", { ascending: true })

      if (error) throw error

      setInterviews(data || [])
    } catch (error: any) {
      toast({
        title: "Error loading interviews",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchShortlistedApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          student_id,
          opportunity_id,
          opportunities (
            title,
            company_name
          ),
          profiles (
            full_name,
            email
          )
        `)
        .eq("status", "shortlisted")
        .order("applied_at", { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error: any) {
      console.error("Error fetching applications:", error)
    }
  }

  const handleCreateInterview = async () => {
    try {
      if (!newInterview.application_id || !newInterview.date || !newInterview.time) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (newInterview.mode === "video" && !newInterview.meeting_link) {
        toast({
          title: "Missing meeting link",
          description: "Please provide a meeting link for video interviews",
          variant: "destructive",
        })
        return
      }

      if (newInterview.mode === "in-person" && !newInterview.location) {
        toast({
          title: "Missing location",
          description: "Please provide a location for in-person interviews",
          variant: "destructive",
        })
        return
      }

      // Create interview
      const { data: interview, error: interviewError } = await supabase
        .from("interviews")
        .insert({
          application_id: newInterview.application_id,
          date: newInterview.date,
          time: newInterview.time,
          duration: Number.parseInt(newInterview.duration),
          mode: newInterview.mode,
          location: newInterview.mode === "in-person" ? newInterview.location : null,
          meeting_link: newInterview.mode === "video" ? newInterview.meeting_link : null,
          notes: newInterview.notes || null,
          status: "proposed",
          created_by: profile.user_id,
        })
        .select()
        .single()

      if (interviewError) throw interviewError

      // Update application status to interview_scheduled
      const { error: appError } = await supabase
        .from("applications")
        .update({
          status: "interview_scheduled",
          interview_scheduled_at: new Date().toISOString(),
        })
        .eq("id", newInterview.application_id)

      if (appError) throw appError

      toast({
        title: "Interview scheduled",
        description: "The student will be notified about the interview slot.",
      })

      setShowCreateDialog(false)
      setNewInterview({
        application_id: "",
        date: "",
        time: "",
        duration: "60",
        mode: "video",
        location: "",
        meeting_link: "",
        notes: "",
      })

      fetchInterviews()
      fetchShortlistedApplications()
    } catch (error: any) {
      toast({
        title: "Error scheduling interview",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleConfirmInterview = async (interviewId: string) => {
    try {
      const { error } = await supabase
        .from("interviews")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
        .eq("id", interviewId)

      if (error) throw error

      toast({
        title: "Interview confirmed",
        description: "You have confirmed your attendance for this interview.",
      })

      fetchInterviews()
    } catch (error: any) {
      toast({
        title: "Error confirming interview",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleCancelInterview = async (interviewId: string) => {
    try {
      const { error } = await supabase
        .from("interviews")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("id", interviewId)

      if (error) throw error

      toast({
        title: "Interview cancelled",
        description: "The interview has been cancelled and all parties notified.",
        variant: "destructive",
      })

      fetchInterviews()
    } catch (error: any) {
      toast({
        title: "Error cancelling interview",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "proposed":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "proposed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isRecruiterOrAdmin = profile?.role === "recruiter" || profile?.role === "placement_officer"

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interview Schedule</h1>
          <p className="text-muted-foreground">
            {isRecruiterOrAdmin ? "Manage interview slots and schedules" : "View and confirm your upcoming interviews"}
          </p>
        </div>
        {isRecruiterOrAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule New Interview</DialogTitle>
                <DialogDescription>Propose interview slots for a shortlisted candidate</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Candidate *</Label>
                  <Select
                    value={newInterview.application_id}
                    onValueChange={(value) => setNewInterview({ ...newInterview, application_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a shortlisted candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.profiles?.full_name} - {app.opportunities?.title} at {app.opportunities?.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={newInterview.date}
                      onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Input
                      type="time"
                      value={newInterview.time}
                      onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration (minutes) *</Label>
                    <Select
                      value={newInterview.duration}
                      onValueChange={(value) => setNewInterview({ ...newInterview, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Mode *</Label>
                    <Select
                      value={newInterview.mode}
                      onValueChange={(value) => setNewInterview({ ...newInterview, mode: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newInterview.mode === "video" && (
                  <div className="space-y-2">
                    <Label>Meeting Link *</Label>
                    <Input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={newInterview.meeting_link}
                      onChange={(e) => setNewInterview({ ...newInterview, meeting_link: e.target.value })}
                    />
                  </div>
                )}

                {newInterview.mode === "in-person" && (
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      placeholder="Campus Placement Cell, Room 301"
                      value={newInterview.location}
                      onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    placeholder="Additional instructions or information for the candidate..."
                    value={newInterview.notes}
                    onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <Button onClick={handleCreateInterview} className="w-full">
                  Propose Interview Slot
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">
              {interviews.filter((i) => i.status === "proposed").length}
            </div>
            <div className="text-xs text-muted-foreground">Proposed</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {interviews.filter((i) => i.status === "confirmed").length}
            </div>
            <div className="text-xs text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {interviews.filter((i) => i.status === "completed").length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{interviews.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {interviews.map((interview) => {
          const application = interview.applications
          const student = application?.profiles
          const opportunity = application?.opportunities

          return (
            <Card
              key={interview.id}
              className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xl text-foreground">{opportunity?.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-4 w-4" />
                        <span>{opportunity?.company_name}</span>
                      </div>
                      {isRecruiterOrAdmin && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{student?.full_name}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {interview.time} ({interview.duration} min)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(interview.status)}>
                    {getStatusIcon(interview.status)}
                    <span className="ml-1 capitalize">{interview.status}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Interview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      {interview.mode === "video" ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : (
                        <MapPin className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-medium capitalize">{interview.mode}</span>
                    </div>
                    {interview.mode === "video" && interview.meeting_link && (
                      <a
                        href={interview.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline block"
                      >
                        {interview.meeting_link}
                      </a>
                    )}
                    {interview.mode === "in-person" && interview.location && (
                      <p className="text-sm text-muted-foreground">{interview.location}</p>
                    )}
                  </div>

                  {!isRecruiterOrAdmin && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Contact</p>
                      <p className="text-sm text-muted-foreground">{student?.email}</p>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
                    <p className="text-sm text-muted-foreground">{interview.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border/50">
                  {!isRecruiterOrAdmin && interview.status === "proposed" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleConfirmInterview(interview.id)}
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm Attendance
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleCancelInterview(interview.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Cannot Attend
                      </Button>
                    </>
                  )}
                  {isRecruiterOrAdmin && interview.status !== "cancelled" && interview.status !== "completed" && (
                    <Button size="sm" variant="destructive" onClick={() => handleCancelInterview(interview.id)}>
                      Cancel Interview
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {interviews.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No interviews scheduled</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {isRecruiterOrAdmin
                ? "Schedule interviews for shortlisted candidates to get started."
                : "You don't have any upcoming interviews at the moment."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
