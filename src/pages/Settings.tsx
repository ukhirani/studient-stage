"use client"

import { useState } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Bell,
  FileText,
  Briefcase,
  DollarSign,
  Calendar,
  HelpCircle,
  MessageSquare,
  LogOut,
  Upload,
} from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

export default function Settings() {
  const { user, profile } = useOutletContext<ContextType>()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Account Information State
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(profile?.phone || "")

  // Preferences State
  const [skillsVisible, setSkillsVisible] = useState(true)
  const [preferredDomains, setPreferredDomains] = useState<string[]>(["Software Development", "Data Science"])
  const [preferredLocations, setPreferredLocations] = useState<string[]>(["Remote", "Hybrid"])
  const [stipendExpectation, setStipendExpectation] = useState("30000")

  // Notifications State
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [calendarSync, setCalendarSync] = useState(false)

  // Privacy State
  const [profileVisibility, setProfileVisibility] = useState("recruiters_only")
  const [dataSharing, setDataSharing] = useState(true)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  const handleSaveAccount = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone,
        })
        .eq("user_id", user.id)

      if (error) throw error

      toast({
        title: "Account updated",
        description: "Your account information has been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error updating account",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleChangePassword = () => {
    toast({
      title: "Password change",
      description: "A password reset link has been sent to your email.",
    })
  }

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your placement preferences have been updated.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy and security settings have been saved.",
    })
  }

  const handleLogoutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: "global" })
      toast({
        title: "Logged out from all devices",
        description: "You have been signed out from all sessions.",
      })
      navigate("/auth")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleContactSupport = () => {
    toast({
      title: "Contact Placement Cell",
      description: "Opening support chat...",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, privacy, and preferences</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto transition-all duration-300">
          <TabsTrigger value="account" className="transition-all duration-200 data-[state=active]:shadow-md">Account</TabsTrigger>
          <TabsTrigger value="preferences" className="transition-all duration-200 data-[state=active]:shadow-md">Preferences</TabsTrigger>
          <TabsTrigger value="notifications" className="transition-all duration-200 data-[state=active]:shadow-md">Notifications</TabsTrigger>
          <TabsTrigger value="privacy" className="transition-all duration-200 data-[state=active]:shadow-md">Privacy</TabsTrigger>
          <TabsTrigger value="support" className="transition-all duration-200 data-[state=active]:shadow-md">Support</TabsTrigger>
        </TabsList>

        {/* Account Information Tab */}
        <TabsContent value="account" className="space-y-6 animate-scale-in">
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary animate-pulse" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Avatar className="h-20 w-20 ring-4 ring-primary/20 transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`} />
                  <AvatarFallback>
                    {fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="hover:scale-105 transition-all duration-200">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Picture
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} disabled className="pl-10" />
                  </div>
                  <p className="text-xs text-muted-foreground">Contact support to change your email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 1234567890"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={handleChangePassword}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch id="2fa" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveAccount}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic & Placement Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <span>Academic & Placement Preferences</span>
              </CardTitle>
              <CardDescription>Set your job preferences and career goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resume Upload */}
              <div className="space-y-2">
                <Label>Default Resume / Cover Letter</Label>
                <div className="flex items-center space-x-2">
                  <Input type="file" accept=".pdf,.doc,.docx" className="flex-1" />
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">This resume will be used for quick applications</p>
              </div>

              <Separator />

              {/* Skills Visibility */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="skills-visibility">Skills & Badge Visibility</Label>
                  <p className="text-sm text-muted-foreground">Make your skills visible to recruiters</p>
                </div>
                <Switch id="skills-visibility" checked={skillsVisible} onCheckedChange={setSkillsVisible} />
              </div>

              <Separator />

              {/* Preferred Domains */}
              <div className="space-y-2">
                <Label>Preferred Job/Internship Domains</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domains" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="software">Software Development</SelectItem>
                    <SelectItem value="data">Data Science</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile Development</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="design">UI/UX Design</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferredDomains.map((domain, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Locations */}
              <div className="space-y-2">
                <Label>Preferred Locations</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="onsite" />
                    <label htmlFor="onsite" className="text-sm">
                      On-site
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remote" defaultChecked />
                    <label htmlFor="remote" className="text-sm">
                      Remote
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hybrid" defaultChecked />
                    <label htmlFor="hybrid" className="text-sm">
                      Hybrid
                    </label>
                  </div>
                </div>
                <Input placeholder="Preferred cities (e.g., Bangalore, Mumbai)" className="mt-2" />
              </div>

              {/* Stipend Expectations */}
              <div className="space-y-2">
                <Label htmlFor="stipend">Stipend Expectations (₹/month)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="stipend"
                    type="number"
                    value={stipendExpectation}
                    onChange={(e) => setStipendExpectation(e.target.value)}
                    placeholder="30000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications & Alerts Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>Notifications & Alerts</span>
              </CardTitle>
              <CardDescription>Manage how you receive updates and reminders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new opportunities and interview reminders
                  </p>
                </div>
                <Switch id="email-notif" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              {/* SMS/WhatsApp Alerts */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sms-alerts">SMS / WhatsApp Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get instant alerts for urgent updates</p>
                </div>
                <Switch id="sms-alerts" checked={smsAlerts} onCheckedChange={setSmsAlerts} />
              </div>

              <Separator />

              {/* In-App Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="inapp-notif">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show notifications within the application</p>
                </div>
                <Switch id="inapp-notif" checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
              </div>

              <Separator />

              {/* Calendar Sync */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="calendar-sync">Calendar Sync</Label>
                    <p className="text-sm text-muted-foreground">Sync interview schedules with your calendar</p>
                  </div>
                  <Switch id="calendar-sync" checked={calendarSync} onCheckedChange={setCalendarSync} />
                </div>

                {calendarSync && (
                  <div className="flex space-x-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Connect Google Calendar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Connect Outlook
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotifications}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Security Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>Control who can see your profile and manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Visibility */}
              <div className="space-y-2">
                <Label htmlFor="visibility">Who can view my profile?</Label>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger id="visibility">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recruiters_only">Recruiters Only</SelectItem>
                    <SelectItem value="faculty_recruiters">Faculty + Recruiters</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Control who can access your profile information</p>
              </div>

              <Separator />

              {/* Data Sharing Consent */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="data-sharing"
                  checked={dataSharing}
                  onCheckedChange={(checked) => setDataSharing(checked as boolean)}
                />
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className="cursor-pointer">
                    Data Sharing Consent
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    I agree to share my details with recruiters through this portal for placement opportunities.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Session Management */}
              <div className="space-y-4">
                <div>
                  <Label>Session Management</Label>
                  <p className="text-sm text-muted-foreground mt-1">Manage your active sessions across devices</p>
                </div>
                <Button variant="destructive" onClick={handleLogoutAllDevices} className="w-full md:w-auto">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out of All Devices
                </Button>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePrivacy}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Save Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support & Help Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Support & Help</span>
              </CardTitle>
              <CardDescription>Get help and report issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Placement Cell */}
              <div className="space-y-4">
                <div>
                  <Label>Contact Placement Cell</Label>
                  <p className="text-sm text-muted-foreground mt-1">Need assistance? Reach out to our placement team</p>
                </div>
                <Button
                  onClick={handleContactSupport}
                  className="w-full md:w-auto bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Support Chat
                </Button>
              </div>

              <Separator />

              {/* FAQs */}
              <div className="space-y-4">
                <div>
                  <Label>Frequently Asked Questions</Label>
                  <p className="text-sm text-muted-foreground mt-1">Find answers to common questions</p>
                </div>
                <Button variant="outline" className="w-full md:w-auto bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  View FAQs & Help Docs
                </Button>
              </div>

              <Separator />

              {/* Report a Problem */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="problem">Report a Problem</Label>
                  <p className="text-sm text-muted-foreground mt-1">Describe the issue you're experiencing</p>
                </div>
                <Textarea id="problem" placeholder="Please describe the problem in detail..." rows={5} />
                <Button className="w-full md:w-auto">Submit Report</Button>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>App Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Version</span>
                <span className="font-medium text-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="font-medium text-foreground">December 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Terms of Service</span>
                <Button variant="link" className="h-auto p-0">
                  View
                </Button>
              </div>
              <div className="flex justify-between">
                <span>Privacy Policy</span>
                <Button variant="link" className="h-auto p-0">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
