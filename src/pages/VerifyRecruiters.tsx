import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Building, Mail, Phone, Clock } from "lucide-react";

interface RecruiterProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  industry: string;
  is_verified: boolean;
  created_at: string;
}

export default function VerifyRecruiters() {
  const [recruiters, setRecruiters] = useState<RecruiterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "recruiter")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecruiters(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching recruiters",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (userId: string, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: isVerified ? "Recruiter approved" : "Recruiter rejected",
        description: `Recruiter has been ${isVerified ? "verified and can now post opportunities" : "marked as unverified"}.`,
      });

      fetchRecruiters();
    } catch (error: any) {
      toast({
        title: "Error updating verification",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">Loading recruiters...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Verify Recruiters</h1>
        <p className="text-muted-foreground">Review and approve recruiter registrations</p>
      </div>

      <div className="grid gap-4">
        {recruiters.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No recruiters found.</p>
            </CardContent>
          </Card>
        ) : (
          recruiters.map((recruiter) => (
            <Card key={recruiter.id} className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{recruiter.full_name}</CardTitle>
                      <CardDescription>{recruiter.company_name}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={recruiter.is_verified ? "default" : "secondary"}>
                    {recruiter.is_verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{recruiter.email}</span>
                  </div>
                  {recruiter.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{recruiter.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{recruiter.industry}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Registered: {new Date(recruiter.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-2">
                  {!recruiter.is_verified ? (
                    <>
                      <Button
                        onClick={() => updateVerificationStatus(recruiter.user_id, true)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => updateVerificationStatus(recruiter.user_id, false)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => updateVerificationStatus(recruiter.user_id, false)}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Revoke Verification
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}