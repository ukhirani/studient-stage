import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  GraduationCap,
  Search,
  Filter,
  Plus,
  Clock,
  Users,
  Briefcase,
} from "lucide-react";

interface ContextType {
  user: any;
  profile: any;
}

export default function Opportunities() {
  const { profile } = useOutletContext<ContextType>();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
        const { data, error } = await supabase
          .from("opportunities")
          .select(`
            *,
            profiles!fk_opportunities_posted_by(full_name, email)
          `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading opportunities",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunityId: string) => {
    if (profile?.role !== "student") {
      toast({
        title: "Access denied",
        description: "Only students can apply to opportunities",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("applications")
        .insert({
          student_id: profile.user_id,
          opportunity_id: opportunityId,
          status: "pending",
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already applied",
            description: "You have already applied to this opportunity",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Application submitted!",
          description: "Your application has been submitted successfully",
        });
        fetchOpportunities(); // Refresh to update application status
      }
    } catch (error: any) {
      toast({
        title: "Application failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || opp.type === filterType;
    const matchesDepartment = filterDepartment === "all" || 
      (opp.departments && opp.departments.includes(filterDepartment));

    return matchesSearch && matchesType && matchesDepartment;
  });

  const hasApplied = (opportunityId: string) => {
    return opportunities
      .find(opp => opp.id === opportunityId)
      ?.applications?.some((app: any) => app.student_id === profile?.user_id);
  };

  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Expired", variant: "destructive" as const };
    if (diffDays <= 3) return { label: `${diffDays} days left`, variant: "destructive" as const };
    if (diffDays <= 7) return { label: `${diffDays} days left`, variant: "secondary" as const };
    return { label: `${diffDays} days left`, variant: "outline" as const };
  };

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
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
          <p className="text-muted-foreground">
            Discover and apply to placement and internship opportunities
          </p>
        </div>
        {(profile?.role === "placement_officer" || profile?.role === "recruiter") && (
          <Button 
            onClick={() => window.location.href = "/opportunities/new"}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Opportunity
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
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
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Chemical">Chemical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredOpportunities.length} of {opportunities.length} opportunities
        </p>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opportunity) => {
          const deadlineStatus = getDeadlineStatus(opportunity.deadline);
          const isApplied = hasApplied(opportunity.id);

          return (
            <Card key={opportunity.id} className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-foreground">{opportunity.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{opportunity.company_name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={deadlineStatus.variant}>{deadlineStatus.label}</Badge>
                    <Badge className="capitalize">{opportunity.type}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                {opportunity.description && (
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {opportunity.description}
                  </p>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {opportunity.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{opportunity.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Due: {new Date(opportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {opportunity.stipend_amount && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        ₹{opportunity.stipend_amount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {opportunity.min_cgpa && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Min CGPA: {opportunity.min_cgpa}</span>
                    </div>
                  )}
                </div>

                {/* Departments */}
                {opportunity.departments && opportunity.departments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {opportunity.departments.map((dept: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {opportunity.required_skills && opportunity.required_skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.required_skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applications Count */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{opportunity.applications?.length || 0} applications</span>
                  </div>

                  {profile?.role === "student" && (
                    <Button
                      onClick={() => handleApply(opportunity.id)}
                      disabled={isApplied || deadlineStatus.label === "Expired"}
                      variant={isApplied ? "outline" : "default"}
                      className={!isApplied ? "bg-gradient-primary hover:shadow-glow transition-all duration-300" : ""}
                    >
                      {isApplied ? "Applied" : "Apply Now"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOpportunities.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No opportunities found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || filterType !== "all" || filterDepartment !== "all"
                ? "Try adjusting your filters to see more results."
                : "No active opportunities are currently available."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}