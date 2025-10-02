import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Search, 
  Calendar, 
  Building2, 
  User, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from "lucide-react";

interface ContextType {
  user: any;
  profile: any;
}

export default function Applications() {
  const { profile } = useOutletContext<ContextType>();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [profile]);

  const fetchApplications = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      
      let query;
      if (profile.role === "student") {
        query = supabase
          .from("applications")
          .select("*")
          .eq("student_id", profile.user_id);
      } else {
        query = supabase
          .from("applications")
          .select("*");
        
        if (profile.role === "faculty_mentor") {
          query = query.eq("mentor_id", profile.user_id);
        }
      }

      const { data, error } = await query.order("applied_at", { ascending: false });

      if (error) throw error;
      
      // Fetch related data separately to avoid relationship issues
      const applicationsWithData = await Promise.all((data || []).map(async (app) => {
        const [opportunityData, profileData] = await Promise.all([
          supabase.from("opportunities").select("title, company_name, type, location, deadline").eq("id", app.opportunity_id).single(),
          profile.role !== "student" ? supabase.from("profiles").select("full_name, email, department").eq("user_id", app.student_id).single() : Promise.resolve({ data: null })
        ]);
        
        return {
          ...app,
          opportunities: opportunityData.data,
          profiles: profileData.data
        };
      }));
      
      setApplications(applicationsWithData);
    } catch (error: any) {
      toast({
        title: "Error loading applications",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      
      if (newStatus === "interview_scheduled") {
        updates.interview_scheduled_at = new Date().toISOString();
      } else if (newStatus === "offer_extended") {
        updates.offer_extended_at = new Date().toISOString();
      } else if (newStatus === "completed") {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("applications")
        .update(updates)
        .eq("id", applicationId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Application status updated to ${newStatus.replace('_', ' ')}`,
      });
      
      fetchApplications();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "interview_scheduled": return <Calendar className="h-4 w-4" />;
      case "offer_extended": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <XCircle className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending": return "secondary" as const;
      case "interview_scheduled": return "outline" as const;
      case "offer_extended": return "default" as const;
      case "rejected": return "destructive" as const;
      case "completed": return "default" as const;
      default: return "secondary" as const;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.opportunities?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.opportunities?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const applicationsByStatus = {
    pending: applications.filter(app => app.status === "pending").length,
    interview_scheduled: applications.filter(app => app.status === "interview_scheduled").length,
    offer_extended: applications.filter(app => app.status === "offer_extended").length,
    rejected: applications.filter(app => app.status === "rejected").length,
    completed: applications.filter(app => app.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground">
          {profile?.role === "student" 
            ? "Track your application status and progress"
            : "Manage student applications and provide guidance"
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(applicationsByStatus).map(([status, count], index) => (
          <Card key={status} className="bg-gradient-card border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon(status)}
              </div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {status.replace('_', ' ')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 hover:shadow-md transition-all duration-300 animate-fade-in" style={{animationDelay: "0.5s"}}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="offer_extended">Offer Extended</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application, index) => (
          <Card key={application.id} className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{animationDelay: `${0.6 + index * 0.05}s`}}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-foreground">
                    {application.opportunities?.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{application.opportunities?.company_name}</span>
                    </div>
                    {profile?.role !== "student" && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{application.profiles?.full_name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={getStatusVariant(application.status)} className="capitalize">
                    {getStatusIcon(application.status)}
                    <span className="ml-1">{application.status.replace('_', ' ')}</span>
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {application.opportunities?.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Timeline */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span>Applied</span>
                </div>
                {application.interview_scheduled_at && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Interview Scheduled</span>
                  </div>
                )}
                {application.offer_extended_at && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Offer Extended</span>
                  </div>
                )}
                {application.completed_at && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>Completed</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {application.notes && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Notes:</strong> {application.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center space-x-2">
                  {application.opportunities?.location && (
                    <span className="text-sm text-muted-foreground">
                      📍 {application.opportunities.location}
                    </span>
                  )}
                </div>

                {(profile?.role === "placement_officer" || profile?.role === "faculty_mentor") && (
                  <div className="flex space-x-2">
                    {application.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateApplicationStatus(application.id, "interview_scheduled")}
                        >
                          Schedule Interview
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateApplicationStatus(application.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "interview_scheduled" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, "offer_extended")}
                          className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        >
                          Extend Offer
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateApplicationStatus(application.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "offer_extended" && (
                      <Button
                        size="sm"
                        onClick={() => updateApplicationStatus(application.id, "completed")}
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No applications found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters to see more results."
                : profile?.role === "student" 
                  ? "You haven't applied to any opportunities yet."
                  : "No applications to review at this time."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}