import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  Building, 
  Briefcase, 
  FileText, 
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Briefcase,
      title: "Opportunity Discovery",
      description: "Browse and apply to placement and internship opportunities from top companies",
    },
    {
      icon: FileText,
      title: "Application Tracking",
      description: "Track your application status and receive updates throughout the hiring process",
    },
    {
      icon: Users,
      title: "Mentor Guidance",
      description: "Get guidance from faculty mentors to improve your applications and interviews",
    },
    {
      icon: Award,
      title: "Success Analytics",
      description: "View placement statistics and success rates across departments",
    },
  ];

  const roles = [
    {
      icon: GraduationCap,
      title: "Students",
      description: "Discover opportunities, track applications, and get mentorship",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Placement Officers",
      description: "Coordinate placements, manage opportunities, and track student progress",
      color: "text-green-600",
    },
    {
      icon: UserCheck,
      title: "Faculty Mentors",
      description: "Guide students, review applications, and provide feedback",
      color: "text-purple-600",
    },
    {
      icon: Building,
      title: "Recruiters",
      description: "Post opportunities, manage applications, and hire top talent",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Campus Connect Hub
            </span>
          </div>
          <Link to="/auth">
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Your Gateway to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Campus Success
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline campus placements and internships with our comprehensive platform connecting 
            students, mentors, placement officers, and recruiters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Join Campus Connect
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive tools for a successful placement journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
              <CardHeader className="text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Built for Everyone</h2>
          <p className="text-muted-foreground text-lg">
            Tailored experiences for all stakeholders in the placement ecosystem
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: `${0.4 + index * 0.1}s`}}>
              <CardHeader className="text-center">
                <role.icon className={`h-12 w-12 mx-auto mb-4 ${role.color}`} />
                <CardTitle className="text-xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {role.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl font-bold text-primary">500+</div>
            <div className="text-muted-foreground">Students Placed</div>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-accent">150+</div>
            <div className="text-muted-foreground">Partner Companies</div>
          </div>
          <div className="space-y-4">
            <div className="text-4xl font-bold text-warning">85%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gradient-to-r from-primary/10 via-transparent to-accent/10">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of students and professionals who trust Campus Connect Hub 
            for their placement needs.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">Campus Connect Hub</span>
          </div>
          <p className="text-muted-foreground">
            Empowering campus placements with modern technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
