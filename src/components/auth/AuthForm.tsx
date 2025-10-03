"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDummyAuth } from "@/contexts/DummyAuthContext"
import { useToast } from "@/hooks/use-toast"
import { GraduationCap, Users, UserCheck, Building, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const roleIcons = {
  student: GraduationCap,
  placement_officer: Users,
  faculty_mentor: UserCheck,
  recruiter: Building,
  admin: Users,
}

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as "student" | "placement_officer" | "faculty_mentor" | "recruiter" | "admin",
    companyName: "",
    industry: "",
  })

  const { toast } = useToast()
  const navigate = useNavigate()
  const { signIn, signUp } = useDummyAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        companyName: formData.companyName,
        industry: formData.industry,
      })

      if (error) throw error

      toast({
        title: "Demo Mode",
        description: "Sign up is disabled in demo mode. Please use one of the predefined accounts to sign in.",
      })
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(formData.email, formData.password)

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })

      navigate("/dashboard")
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl bg-gradient-card border-border/50 animate-scale-in hover:shadow-2xl transition-all duration-300">
        <CardHeader className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary animate-pulse" />
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Campus Connect Hub
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Your gateway to campus placements and internships
          </CardDescription>
        </CardHeader>

        <CardContent className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 transition-all duration-300">
              <TabsTrigger value="signin" className="transition-all duration-200 data-[state=active]:shadow-md">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="transition-all duration-200 data-[state=active]:shadow-md">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 animate-fade-in">
              <Alert className="mb-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Demo Accounts:</strong><br/>
                  Admin: admin@university.edu / admin123<br/>
                  Recruiter: recruiter@techcorp.com / recruiter123<br/>
                  Mentor: mentor@university.edu / mentor123<br/>
                  Student: rahul.sharma@university.edu / student123
                </AlertDescription>
              </Alert>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 animate-fade-in">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleIcons).map(([role, Icon]) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span className="capitalize">{role.replace("_", " ")}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === "recruiter" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        type="text"
                        placeholder="Tech Corp Inc."
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        type="text"
                        placeholder="Information Technology"
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
