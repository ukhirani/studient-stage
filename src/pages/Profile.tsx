import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  FileText
} from "lucide-react";

interface ContextType {
  user: any;
  profile: any;
}

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical", 
  "Civil",
  "Chemical",
  "Electrical",
  "Information Technology"
];

export default function Profile() {
  const { profile } = useOutletContext<ContextType>();
  const [loading, setLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [skillInput, setSkillInput] = useState("");
  const { toast } = useToast();
  
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
    skills: [] as string[]
  });

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
        skills: []
      });

      if (profile.role === "student") {
        fetchStudentProfile();
      }
    }
  }, [profile]);

  const fetchStudentProfile = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", profile.user_id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setStudentProfile(data);
        setFormData(prev => ({
          ...prev,
          cgpa: data.cgpa?.toString() || "",
          bio: data.bio || "",
          linkedin_url: "",
          github_url: "",
          resume_url: data.resume_url || "",
          skills: data.skills || []
        }));
      }
    } catch (error: any) {
      toast({
        title: "Error loading student profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          contact_phone: formData.contact_phone || null,
          department: formData.department || null,
          year: formData.year ? parseInt(formData.year) : null,
        })
        .eq("user_id", profile.user_id);

      if (profileError) throw profileError;

      // Update student profile if user is a student
      if (profile.role === "student") {
        const studentData = {
          cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null,
          bio: formData.bio || null,
          linkedin_url: formData.linkedin_url || null,
          github_url: formData.github_url || null,
          resume_url: formData.resume_url || null,
          skills: formData.skills.length > 0 ? formData.skills : null,
        };

        if (studentProfile) {
          const { error: studentError } = await supabase
            .from("student_profiles")
            .update(studentData)
            .eq("user_id", profile.user_id);
          
          if (studentError) throw studentError;
        } else {
          const { error: studentError } = await supabase
            .from("student_profiles")
            .insert({
              user_id: profile.user_id,
              ...studentData
            });
          
          if (studentError) throw studentError;
        }
      }

      toast({
        title: "Profile updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          {profile?.role === "student" && (
            <TabsTrigger value="academic">Academic & Skills</TabsTrigger>
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
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                        className="pl-10 bg-muted"
                      />
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
                        onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
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
                      onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}
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
                <CardDescription>
                  Update your academic performance and professional profiles
                </CardDescription>
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
                        onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                        placeholder="8.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
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
                          onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
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
                          onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                          placeholder="https://github.com/yourusername"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume_url">Resume URL</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="resume_url"
                        type="url"
                        value={formData.resume_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, resume_url: e.target.value }))}
                        placeholder="https://drive.google.com/your-resume"
                        className="pl-10"
                      />
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
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
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

        <TabsContent value="settings">
          <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Account Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Your account details and current role
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={profile?.email || ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input 
                      value={profile?.role?.replace('_', ' ').toUpperCase() || ""} 
                      disabled 
                      className="bg-muted" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div>
                  <h3 className="text-lg font-medium text-foreground">Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize your experience
                  </p>
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
                      <p className="text-sm text-muted-foreground">
                        Control who can see your profile information
                      </p>
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
  );
}