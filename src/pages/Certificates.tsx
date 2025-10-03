"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
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
import { useToast } from "@/hooks/use-toast"
import { dummyDataStore } from "@/lib/dummyData"
import { Award, Search, Filter, Download, CheckCircle, Upload, Eye, QrCode, Building2, User, Plus } from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

export default function Certificates() {
  const { profile } = useOutletContext<ContextType>()
  const [certificates, setCertificates] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { toast } = useToast()

  const [newCertificate, setNewCertificate] = useState({
    student_id: "",
    application_id: "",
    company_id: "",
    certificate_type: "internship",
    title: "",
    description: "",
    issue_date: new Date().toISOString().split("T")[0],
    certificate_url: "",
  })

  useEffect(() => {
    fetchCertificates()
    if (profile?.role === "placement_officer" || profile?.role === "recruiter") {
      fetchCompletedApplications()
      fetchCompanies()
    }
  }, [profile])

  const fetchCertificates = () => {
    if (!profile) return

    setLoading(true)
    setTimeout(() => {
      let certs = [...dummyDataStore.certificates]

      if (profile.role === "student") {
        certs = dummyDataStore.getCertificatesForStudent(profile.user_id)
      }

      // Sort by issue date
      certs.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())

      // Add related data
      const certificatesWithData = certs.map((cert) => {
        const studentProfile = dummyDataStore.getUserProfile(cert.student_id)
        const company = cert.company_id 
          ? dummyDataStore.companies.find(c => c.id === cert.company_id)
          : null

        return {
          ...cert,
          student: studentProfile,
          company: company,
        }
      })

      setCertificates(certificatesWithData)
      setLoading(false)
    }, 300)
  }

  const fetchCompletedApplications = () => {
    const completedApps = dummyDataStore.applications.filter(a => 
      a.status === "internship_completed" || a.status === "placed" || a.status === "selected"
    )

    const applicationsWithData = completedApps.map((app) => {
      const opportunity = dummyDataStore.opportunities.find(o => o.id === app.opportunity_id)
      const studentProfile = dummyDataStore.getUserProfile(app.student_id)

      return {
        ...app,
        opportunity: opportunity,
        student: studentProfile,
      }
    })

    setApplications(applicationsWithData)
  }

  const fetchCompanies = () => {
    const verifiedCompanies = dummyDataStore.companies.filter(c => c.status === "verified")
    setCompanies(verifiedCompanies)
  }

  const handleCreateCertificate = () => {
    if (!newCertificate.student_id || !newCertificate.title || !newCertificate.certificate_type) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const certificate = dummyDataStore.addCertificate({
      student_id: newCertificate.student_id,
      application_id: newCertificate.application_id || undefined,
      company_id: newCertificate.company_id || undefined,
      certificate_type: newCertificate.certificate_type as "internship" | "placement" | "training",
      title: newCertificate.title,
      description: newCertificate.description || "",
      issue_date: newCertificate.issue_date,
      certificate_url: newCertificate.certificate_url || `/certificates/${newCertificate.student_id}-${Date.now()}.pdf`,
      verification_id: `CERT-2024-${Date.now().toString().slice(-8)}`,
      status: "generated",
    })

    toast({
      title: "Certificate created",
      description: "The certificate has been generated successfully.",
    })

    setShowCreateDialog(false)
      setNewCertificate({
        student_id: "",
        application_id: "",
        company_id: "",
        certificate_type: "internship",
        title: "",
        description: "",
        issue_date: new Date().toISOString().split("T")[0],
        certificate_url: "",
      })

    fetchCertificates()
  }

  const handleUpload = () => {
    toast({
      title: "Upload submitted",
      description: "Your certificate has been submitted for admin approval.",
    })
    setShowUploadDialog(false)
  }

  const getStatusIcon = (status: string) => {
    return <CheckCircle className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    return "bg-green-100 text-green-800 border-green-200"
  }

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cert.company?.name && cert.company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cert.student?.full_name && cert.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType = typeFilter === "all" || cert.certificate_type === typeFilter

    return matchesSearch && matchesType
  })

  const certificatesByType = {
    internship: certificates.filter((c) => c.certificate_type === "internship").length,
    placement: certificates.filter((c) => c.certificate_type === "placement").length,
    training: certificates.filter((c) => c.certificate_type === "training").length,
    achievement: certificates.filter((c) => c.certificate_type === "achievement").length,
  }

  const isAdmin = profile?.role === "placement_officer" || profile?.role === "recruiter"

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isAdmin ? "Certificates Management" : "My Certificates"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Generate and manage certificates for students"
              : "View and manage your internship, training, and placement certificates"}
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Generate New Certificate</DialogTitle>
                  <DialogDescription>Create a certificate for a student</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Application (Optional)</Label>
                    <Select
                      value={newCertificate.application_id}
                      onValueChange={(value) => {
                        const app = applications.find((a) => a.id === value)
                        setNewCertificate({
                          ...newCertificate,
                          application_id: value,
                          student_id: app?.student_id || "",
                          title: app?.opportunity?.title
                            ? `${app.opportunity.title} Certificate`
                            : newCertificate.title,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a completed application" />
                      </SelectTrigger>
                      <SelectContent>
                        {applications.map((app) => (
                          <SelectItem key={app.id} value={app.id}>
                            {app.student?.full_name} - {app.opportunity?.title}
                          </SelectItem>
                        ))}
                        {applications.length === 0 && (
                          <SelectItem value="none" disabled>
                            No completed applications
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Certificate Type *</Label>
                    <Select
                      value={newCertificate.certificate_type}
                      onValueChange={(value) => setNewCertificate({ ...newCertificate, certificate_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="placement">Placement</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Certificate Title *</Label>
                    <Input
                      placeholder="e.g., Software Development Internship Certificate"
                      value={newCertificate.title}
                      onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Company (Optional)</Label>
                    <Select
                      value={newCertificate.company_id}
                      onValueChange={(value) => setNewCertificate({ ...newCertificate, company_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Issue Date *</Label>
                    <Input
                      type="date"
                      value={newCertificate.issue_date}
                      onChange={(e) => setNewCertificate({ ...newCertificate, issue_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Brief description of the certificate..."
                      value={newCertificate.description}
                      onChange={(e) => setNewCertificate({ ...newCertificate, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Certificate URL (Optional)</Label>
                    <Input
                      placeholder="https://..."
                      value={newCertificate.certificate_url}
                      onChange={(e) => setNewCertificate({ ...newCertificate, certificate_url: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleCreateCertificate} className="w-full bg-gradient-primary">
                    Generate Certificate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {!isAdmin && (
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload External Certificate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload External Certificate</DialogTitle>
                  <DialogDescription>
                    Upload certificates from non-campus programs. These will require admin approval.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Certificate Title</Label>
                    <Input placeholder="e.g., AWS Cloud Practitioner" />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization</Label>
                    <Input placeholder="e.g., Amazon Web Services" />
                  </div>
                  <div className="space-y-2">
                    <Label>Completion Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Certificate File (PDF)</Label>
                    <Input type="file" accept=".pdf" />
                  </div>
                  <Button onClick={handleUpload} className="w-full">
                    Submit for Approval
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {Object.entries(certificatesByType).map(([type, count], idx) => (
          <Card
            key={type}
            className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in"
            style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2 animate-pulse">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{type}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card
        className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-slide-up"
        style={{ animationDelay: "0.2s" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary animate-pulse" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredCertificates.length} of {certificates.length} certificates
        </p>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCertificates.map((certificate, idx) => (
          <Card
            key={certificate.id}
            className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xl text-foreground flex items-start space-x-2">
                    <Award className="h-5 w-5 text-primary mt-1 flex-shrink-0 animate-pulse" />
                    <span>{certificate.title}</span>
                  </CardTitle>
                  {certificate.company && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{certificate.company.name}</span>
                    </div>
                  )}
                  {isAdmin && certificate.student && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{certificate.student.full_name}</span>
                    </div>
                  )}
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 capitalize">
                  {certificate.certificate_type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Issue Date</p>
                  <p className="font-medium text-foreground">{new Date(certificate.issue_date).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {certificate.certificate_type}
                  </Badge>
                </div>
              </div>

              {certificate.description && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">{certificate.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setSelectedCertificate(certificate)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{certificate.title}</DialogTitle>
                      <DialogDescription>Certificate Details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        {certificate.company && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Company</p>
                            <p className="text-foreground">{certificate.company.name}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Type</p>
                          <p className="text-foreground capitalize">{certificate.certificate_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
                          <p className="text-foreground">{new Date(certificate.issue_date).toLocaleDateString()}</p>
                        </div>
                        {isAdmin && certificate.student && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Student</p>
                            <p className="text-foreground">{certificate.student.full_name}</p>
                          </div>
                        )}
                      </div>
                      {certificate.description && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                          <p className="text-foreground bg-muted/50 p-3 rounded-lg">{certificate.description}</p>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button className="flex-1">Add to Resume</Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Share
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex space-x-2">
                  {certificate.certificate_url && (
                    <Button
                      size="sm"
                      onClick={() => window.open(certificate.certificate_url, "_blank")}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: `Certificate ID: ${certificate.id}` })}
                  >
                    <QrCode className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCertificates.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {certificates.length === 0 ? "No certificates yet" : "No certificates found"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {certificates.length === 0
                ? isAdmin
                  ? "Generate certificates for students who have completed their programs."
                  : "Complete an internship or training to earn one!"
                : "Try adjusting your filters to see more results."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
