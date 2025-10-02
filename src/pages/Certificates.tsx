"use client"

import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import {
  Award,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Eye,
  QrCode,
  Calendar,
  Building2,
  User,
} from "lucide-react"

interface ContextType {
  user: any
  profile: any
}

// Mock data - in production, this would come from Supabase
const mockCertificates = [
  {
    id: "1",
    title: "AI Guru – Internship Training",
    issuing_authority: "Dr. Sarah Johnson (Faculty Mentor)",
    status: "issued",
    date_issued: "2024-08-15",
    completion_date: "2024-08-10",
    type: "internship",
    company: "Tech Innovations Inc",
    duration: "3 months",
    mentor: "Dr. Sarah Johnson",
    feedback: "Excellent performance throughout the internship. Demonstrated strong technical skills and teamwork.",
    certificate_url: "/certificates/cert-001.pdf",
    verification_id: "CERT-2024-AI-001",
  },
  {
    id: "2",
    title: "Full Stack Development Workshop",
    issuing_authority: "Placement Cell",
    status: "approved",
    date_issued: "2024-09-20",
    completion_date: "2024-09-15",
    type: "training",
    company: "Campus Connect Hub",
    duration: "2 weeks",
    mentor: "Prof. Michael Chen",
    feedback: "Successfully completed all modules with distinction.",
    certificate_url: "/certificates/cert-002.pdf",
    verification_id: "CERT-2024-FS-002",
  },
  {
    id: "3",
    title: "Data Science Internship Certificate",
    issuing_authority: "DataCorp Analytics",
    status: "under_review",
    date_issued: null,
    completion_date: "2024-11-30",
    type: "internship",
    company: "DataCorp Analytics",
    duration: "6 months",
    mentor: "Jane Smith (Recruiter)",
    feedback: null,
    certificate_url: null,
    verification_id: null,
  },
  {
    id: "4",
    title: "Placement Offer - Software Engineer",
    issuing_authority: "StartupXYZ HR",
    status: "pending",
    date_issued: null,
    completion_date: "2024-12-01",
    type: "placement",
    company: "StartupXYZ",
    duration: "Full-time",
    mentor: "Placement Officer",
    feedback: null,
    certificate_url: null,
    verification_id: null,
  },
]

export default function Certificates() {
  const { profile } = useOutletContext<ContextType>()
  const [certificates, setCertificates] = useState(mockCertificates)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const { toast } = useToast()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "issued":
        return <CheckCircle className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "under_review":
        return <Clock className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "issued":
        return "default" as const
      case "approved":
        return "default" as const
      case "under_review":
        return "secondary" as const
      case "pending":
        return "outline" as const
      default:
        return "secondary" as const
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "issued":
        return "bg-green-100 text-green-800 border-green-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuing_authority.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || cert.status === statusFilter
    const matchesType = typeFilter === "all" || cert.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const certificatesByStatus = {
    issued: certificates.filter((c) => c.status === "issued").length,
    approved: certificates.filter((c) => c.status === "approved").length,
    under_review: certificates.filter((c) => c.status === "under_review").length,
    pending: certificates.filter((c) => c.status === "pending").length,
  }

  const handleDownload = (certificateId: string) => {
    toast({
      title: "Downloading certificate",
      description: "Your certificate is being downloaded...",
    })
  }

  const handleVerify = (verificationId: string) => {
    toast({
      title: "Verification ID",
      description: `Certificate ID: ${verificationId}`,
    })
  }

  const handleUpload = () => {
    toast({
      title: "Upload submitted",
      description: "Your certificate has been submitted for admin approval.",
    })
    setShowUploadDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground">View and manage your internship, training, and placement certificates</p>
        </div>
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
                <label className="text-sm font-medium">Certificate Title</label>
                <Input placeholder="e.g., AWS Cloud Practitioner" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Issuing Organization</label>
                <Input placeholder="e.g., Amazon Web Services" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Completion Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Certificate File (PDF)</label>
                <Input type="file" accept=".pdf" />
              </div>
              <Button onClick={handleUpload} className="w-full">
                Submit for Approval
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
        {Object.entries(certificatesByStatus).map(([status, count], idx) => (
          <Card key={status} className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-scale-in" style={{ animationDelay: `${0.1 + idx * 0.05}s` }}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2 animate-pulse">{getStatusIcon(status)}</div>
              <div className="text-2xl font-bold text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{status.replace("_", " ")}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary animate-pulse" />
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
                  placeholder="Search certificates..."
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
                  <SelectItem value="issued">Issued</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="placement">Placement Offer</SelectItem>
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
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{certificate.company}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(certificate.status)}>
                  {getStatusIcon(certificate.status)}
                  <span className="ml-1 capitalize">{certificate.status.replace("_", " ")}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Issuing Authority</p>
                  <p className="font-medium text-foreground">{certificate.issuing_authority}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {certificate.type}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">{certificate.duration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Completion Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(certificate.completion_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {certificate.date_issued && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Issued on {new Date(certificate.date_issued).toLocaleDateString()}</span>
                </div>
              )}

              {certificate.mentor && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Mentor: {certificate.mentor}</span>
                </div>
              )}

              {certificate.feedback && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">Supervisor Feedback:</p>
                  <p className="text-sm text-muted-foreground">{certificate.feedback}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex space-x-2">
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
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Company</p>
                            <p className="text-foreground">{certificate.company}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                            <p className="text-foreground capitalize">{certificate.type}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Duration</p>
                            <p className="text-foreground">{certificate.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge className={getStatusColor(certificate.status)}>
                              {certificate.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Mentor</p>
                            <p className="text-foreground">{certificate.mentor}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Completion Date</p>
                            <p className="text-foreground">
                              {new Date(certificate.completion_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {certificate.feedback && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Supervisor Feedback</p>
                            <p className="text-foreground bg-muted/50 p-3 rounded-lg">{certificate.feedback}</p>
                          </div>
                        )}
                        {certificate.verification_id && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Verification ID</p>
                            <p className="text-foreground font-mono bg-muted/50 p-3 rounded-lg">
                              {certificate.verification_id}
                            </p>
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
                </div>

                <div className="flex space-x-2">
                  {certificate.certificate_url && (
                    <Button
                      size="sm"
                      onClick={() => handleDownload(certificate.id)}
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  {certificate.verification_id && (
                    <Button size="sm" variant="outline" onClick={() => handleVerify(certificate.verification_id)}>
                      <QrCode className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                  )}
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
              {certificates.length === 0 ? "You don't have any certificates yet" : "No certificates found"}
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {certificates.length === 0
                ? "Complete an internship or training to earn one!"
                : "Try adjusting your filters to see more results."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
