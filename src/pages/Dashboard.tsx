import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  Award,
  Target,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";

interface ContextType {
  user: any;
  profile: any;
}

const dashboardData = {
  student: {
    stats: [
      { title: "Applications Sent", value: "12", icon: FileText, color: "text-primary" },
      { title: "Interview Scheduled", value: "3", icon: Calendar, color: "text-accent" },
      { title: "Offers Received", value: "1", icon: Award, color: "text-warning" },
      { title: "Profile Completion", value: "85%", icon: Target, color: "text-muted-foreground" },
    ],
    recentActivities: [
      { action: "Applied to", company: "Tech Corp", role: "Software Engineer", time: "2 hours ago", status: "pending" },
      { action: "Interview scheduled with", company: "DataCorp", role: "Data Analyst", time: "1 day ago", status: "interview" },
      { action: "Offer received from", company: "StartupXYZ", role: "Frontend Developer", time: "3 days ago", status: "offer" },
    ],
    upcomingDeadlines: [
      { company: "Google", role: "SWE Intern", deadline: "Dec 15, 2024", daysLeft: 5 },
      { company: "Microsoft", role: "PM Intern", deadline: "Dec 20, 2024", daysLeft: 10 },
    ],
  },
  placement_officer: {
    stats: [
      { title: "Active Students", value: "245", icon: Users, color: "text-primary" },
      { title: "Open Opportunities", value: "18", icon: Briefcase, color: "text-accent" },
      { title: "Placement Rate", value: "78%", icon: TrendingUp, color: "text-warning" },
      { title: "This Month's Hires", value: "34", icon: CheckCircle2, color: "text-accent" },
    ],
    recentActivities: [
      { action: "New opportunity posted", company: "TechFlow Inc", role: "Multiple Positions", time: "1 hour ago", status: "active" },
      { action: "Student placed at", company: "InnovateLabs", role: "Data Scientist", time: "3 hours ago", status: "completed" },
      { action: "Interview feedback received", company: "CodeCraft", role: "Backend Developer", time: "5 hours ago", status: "feedback" },
    ],
    departmentStats: [
      { department: "Computer Science", students: 89, placed: 67, rate: 75 },
      { department: "Electronics", students: 72, placed: 58, rate: 81 },
      { department: "Mechanical", students: 84, placed: 62, rate: 74 },
    ],
  },
  faculty_mentor: {
    stats: [
      { title: "Students Mentoring", value: "24", icon: Users, color: "text-primary" },
      { title: "Applications Reviewed", value: "156", icon: FileText, color: "text-accent" },
      { title: "Feedback Given", value: "89", icon: BookOpen, color: "text-warning" },
      { title: "Success Rate", value: "82%", icon: Target, color: "text-accent" },
    ],
    recentActivities: [
      { action: "Reviewed application for", company: "Meta", student: "John Doe", time: "30 min ago", status: "approved" },
      { action: "Provided feedback to", company: "Amazon", student: "Jane Smith", time: "2 hours ago", status: "feedback" },
      { action: "Mentoring session with", company: "N/A", student: "Alex Johnson", time: "1 day ago", status: "mentoring" },
    ],
    pendingReviews: [
      { student: "Sarah Wilson", company: "Netflix", role: "UI/UX Designer", urgent: true },
      { student: "Mike Chen", company: "Spotify", role: "Data Engineer", urgent: false },
      { student: "Emma Davis", company: "Adobe", role: "Product Manager", urgent: false },
    ],
  },
  recruiter: {
    stats: [
      { title: "Active Opportunities", value: "6", icon: Briefcase, color: "text-primary" },
      { title: "Total Applications", value: "142", icon: FileText, color: "text-accent" },
      { title: "Interviews Scheduled", value: "28", icon: Calendar, color: "text-warning" },
      { title: "Offers Extended", value: "12", icon: Award, color: "text-accent" },
    ],
    recentActivities: [
      { action: "New application received", student: "Alex Kumar", role: "Software Engineer", time: "15 min ago", status: "new" },
      { action: "Interview completed with", student: "Priya Sharma", role: "Product Manager", time: "2 hours ago", status: "completed" },
      { action: "Offer accepted by", student: "Rahul Gupta", role: "Data Scientist", time: "1 day ago", status: "accepted" },
    ],
    pipeline: [
      { stage: "Applications", count: 142, color: "bg-primary" },
      { stage: "Screening", count: 89, color: "bg-accent" },
      { stage: "Interviews", count: 28, color: "bg-warning" },
      { stage: "Offers", count: 12, color: "bg-green-500" },
    ],
  },
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  interview: "bg-blue-100 text-blue-800 border-blue-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  active: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-purple-100 text-purple-800 border-purple-200",
  feedback: "bg-orange-100 text-orange-800 border-orange-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  mentoring: "bg-blue-100 text-blue-800 border-blue-200",
  new: "bg-cyan-100 text-cyan-800 border-cyan-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
};

export default function Dashboard() {
  const { profile } = useOutletContext<ContextType>();
  const userRole = profile?.role || "student";
  const data = dashboardData[userRole as keyof typeof dashboardData];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, {profile?.full_name}!
          </h1>
          <p className="text-muted-foreground capitalize">
            {userRole.replace("_", " ")} Dashboard
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Recent Activities</span>
            </CardTitle>
            <CardDescription>Latest updates and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {activity.action} {activity.company || activity.student}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {"role" in activity ? activity.role : "student" in activity ? `Student: ${activity.student}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge className={statusColors[activity.status as keyof typeof statusColors]}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Role-specific Content */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {userRole === "student" && (
                <>
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <span>Upcoming Deadlines</span>
                </>
              )}
              {userRole === "placement_officer" && (
                <>
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Department Statistics</span>
                </>
              )}
              {userRole === "faculty_mentor" && (
                <>
                  <FileText className="h-5 w-5 text-accent" />
                  <span>Pending Reviews</span>
                </>
              )}
              {userRole === "recruiter" && (
                <>
                  <Building2 className="h-5 w-5 text-primary" />
                  <span>Hiring Pipeline</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Student: Upcoming Deadlines */}
            {userRole === "student" && "upcomingDeadlines" in data && (
              <>
                {data.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{deadline.company}</p>
                      <p className="text-sm text-muted-foreground">{deadline.role}</p>
                      <p className="text-xs text-muted-foreground">{deadline.deadline}</p>
                    </div>
                    <Badge variant={deadline.daysLeft <= 5 ? "destructive" : "secondary"}>
                      {deadline.daysLeft} days left
                    </Badge>
                  </div>
                ))}
              </>
            )}

            {/* Placement Officer: Department Stats */}
            {userRole === "placement_officer" && "departmentStats" in data && (
              <>
                {data.departmentStats.map((dept, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{dept.department}</span>
                      <span className="text-sm text-muted-foreground">
                        {dept.placed}/{dept.students} ({dept.rate}%)
                      </span>
                    </div>
                    <Progress value={dept.rate} className="h-2" />
                  </div>
                ))}
              </>
            )}

            {/* Faculty Mentor: Pending Reviews */}
            {userRole === "faculty_mentor" && "pendingReviews" in data && (
              <>
                {data.pendingReviews.map((review, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium">{review.student}</p>
                      <p className="text-sm text-muted-foreground">{review.company} - {review.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {review.urgent && (
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      )}
                      <Button size="sm" variant="outline">Review</Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Recruiter: Pipeline */}
            {userRole === "recruiter" && "pipeline" in data && (
              <>
                {data.pipeline.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                      <span className="font-medium">{stage.stage}</span>
                    </div>
                    <span className="text-2xl font-bold">{stage.count}</span>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}