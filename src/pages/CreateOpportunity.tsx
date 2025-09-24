import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Building2, Calendar, DollarSign, Users } from "lucide-react";

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

const opportunityTypes = [
  "internship",
  "full-time",
  "part-time",
  "contract"
];

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const { profile } = useOutletContext<ContextType>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    description: "",
    type: "",
    location: "",
    stipend_amount: "",
    min_cgpa: "",
    deadline: "",
    departments: [] as string[],
    required_skills: [] as string[]
  });
  
  const [skillInput, setSkillInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("opportunities")
        .insert({
          title: formData.title,
          company_name: formData.company_name,
          description: formData.description || null,
          type: formData.type,
          location: formData.location || null,
          stipend_amount: formData.stipend_amount ? parseInt(formData.stipend_amount) : null,
          min_cgpa: formData.min_cgpa ? parseFloat(formData.min_cgpa) : null,
          deadline: formData.deadline,
          departments: formData.departments.length > 0 ? formData.departments : null,
          required_skills: formData.required_skills.length > 0 ? formData.required_skills : null,
          posted_by: profile.user_id,
        });

      if (error) throw error;

      toast({
        title: "Opportunity posted!",
        description: "Your opportunity has been posted successfully.",
      });
      
      navigate("/opportunities");
    } catch (error: any) {
      toast({
        title: "Error posting opportunity",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (dept: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      departments: checked 
        ? [...prev.departments, dept]
        : prev.departments.filter(d => d !== dept)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.required_skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/opportunities")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Post New Opportunity</h1>
          <p className="text-muted-foreground">Create a new placement or internship opportunity</p>
        </div>
      </div>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Opportunity Details</span>
          </CardTitle>
          <CardDescription>
            Fill in the details for the new opportunity
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Software Developer Intern"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="e.g. TechCorp Inc."
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={4}
              />
            </div>

            {/* Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Opportunity Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Mumbai, India / Remote"
                />
              </div>
            </div>

            {/* Financial and Academic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stipend_amount">Stipend/Salary (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="stipend_amount"
                    type="number"
                    value={formData.stipend_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, stipend_amount: e.target.value }))}
                    placeholder="25000"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="min_cgpa">Minimum CGPA</Label>
                <Input
                  id="min_cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData.min_cgpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_cgpa: e.target.value }))}
                  placeholder="7.5"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Departments */}
            <div className="space-y-3">
              <Label className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Eligible Departments</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {departments.map(dept => (
                  <label key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.departments.includes(dept)}
                      onCheckedChange={(checked) => handleDepartmentChange(dept, checked as boolean)}
                    />
                    <span className="text-sm">{dept}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label>Required Skills</Label>
              <div className="flex space-x-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} variant="outline">
                  Add
                </Button>
              </div>
              {formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/opportunities")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Posting..." : "Post Opportunity"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}