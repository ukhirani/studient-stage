"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Plus, Search, Edit, Trash2, MapPin, Briefcase, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"

type Company = Tables<"companies">

interface ContextType {
  profile: any
}

export default function CompanyManagement() {
  const { profile } = useOutletContext<ContextType>()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    address: "",
    website: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    logo_url: "",
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setCompanies(data || [])
    } catch (error: any) {
      console.error("[v0] Error fetching companies:", error)
      toast({
        title: "Error loading companies",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompany = async () => {
    if (!newCompany.name || !newCompany.industry) {
      toast({
        title: "Missing information",
        description: "Please fill in company name and industry",
        variant: "destructive",
      })
      return
    }

    try {
      const { data, error } = await supabase
        .from("companies")
        .insert({
          name: newCompany.name,
          industry: newCompany.industry,
          address: newCompany.address || null,
          website: newCompany.website || null,
          description: newCompany.description || null,
          contact_email: newCompany.contact_email || null,
          contact_phone: newCompany.contact_phone || null,
          logo_url: newCompany.logo_url || null,
          status: "pending",
        })
        .select()
        .single()

      if (error) throw error

      setCompanies([data, ...companies])
      setIsAddDialogOpen(false)
      setNewCompany({
        name: "",
        industry: "",
        address: "",
        website: "",
        description: "",
        contact_email: "",
        contact_phone: "",
        logo_url: "",
      })

      toast({
        title: "Company added",
        description: `${data.name} has been added successfully`,
      })
    } catch (error: any) {
      console.error("[v0] Error adding company:", error)
      toast({
        title: "Error adding company",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (companyId: string, status: "verified" | "rejected") => {
    try {
      const { error } = await supabase
        .from("companies")
        .update({
          status,
          verified_by: profile.user_id,
          verified_at: new Date().toISOString(),
        })
        .eq("id", companyId)

      if (error) throw error

      setCompanies(
        companies.map((c) =>
          c.id === companyId
            ? { ...c, status, verified_by: profile.user_id, verified_at: new Date().toISOString() }
            : c,
        ),
      )

      toast({
        title: `Company ${status}`,
        description: `The company has been ${status} successfully`,
      })
    } catch (error: any) {
      console.error("[v0] Error updating company status:", error)
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEditCompany = async () => {
    if (!selectedCompany) return

    try {
      const { error } = await supabase
        .from("companies")
        .update({
          name: selectedCompany.name,
          industry: selectedCompany.industry,
          address: selectedCompany.address,
          website: selectedCompany.website,
          description: selectedCompany.description,
          contact_email: selectedCompany.contact_email,
          contact_phone: selectedCompany.contact_phone,
          logo_url: selectedCompany.logo_url,
        })
        .eq("id", selectedCompany.id)

      if (error) throw error

      setCompanies(companies.map((c) => (c.id === selectedCompany.id ? selectedCompany : c)))
      setIsEditDialogOpen(false)
      setSelectedCompany(null)

      toast({
        title: "Company updated",
        description: "Company details have been updated successfully",
      })
    } catch (error: any) {
      console.error("[v0] Error updating company:", error)
      toast({
        title: "Error updating company",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return
    }

    try {
      const { error } = await supabase.from("companies").delete().eq("id", id)

      if (error) throw error

      setCompanies(companies.filter((c) => c.id !== id))
      toast({
        title: "Company removed",
        description: "The company has been removed from the system",
      })
    } catch (error: any) {
      console.error("[v0] Error deleting company:", error)
      toast({
        title: "Error deleting company",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (company.address && company.address.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Management</h1>
            <p className="text-muted-foreground mt-1">Manage companies and their recruitment activities</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
                <DialogDescription>Enter the company details to add them to the system</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    placeholder="Tech Corp"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                      placeholder="Technology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newCompany.address}
                      onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                      placeholder="Bangalore, India"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={newCompany.contact_email}
                      onChange={(e) => setNewCompany({ ...newCompany, contact_email: e.target.value })}
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={newCompany.contact_phone}
                      onChange={(e) => setNewCompany({ ...newCompany, contact_phone: e.target.value })}
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    placeholder="https://company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={newCompany.logo_url}
                    onChange={(e) => setNewCompany({ ...newCompany, logo_url: e.target.value })}
                    placeholder="https://company.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                    placeholder="Brief description about the company..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCompany} className="bg-gradient-primary">
                  Add Company
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{companies.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {companies.filter((c) => c.status === "verified").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {companies.filter((c) => c.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {companies.filter((c) => c.status === "rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies by name, industry, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Companies List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredCompanies.map((company, idx) => (
            <Card
              key={company.id}
              className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url || "/placeholder.svg"}
                          alt={company.name}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                        {getStatusBadge(company.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{company.description || "No description"}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {company.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {company.address}
                          </div>
                        )}
                        {company.industry && (
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {company.industry}
                          </div>
                        )}
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {company.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(company.id, "verified")}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(company.id, "rejected")}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(company)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search" : "Add your first company to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company details</DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Company Name</Label>
                <Input
                  id="edit-name"
                  value={selectedCompany.name}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-industry">Industry</Label>
                  <Input
                    id="edit-industry"
                    value={selectedCompany.industry || ""}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, industry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={selectedCompany.address || ""}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, address: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-email">Contact Email</Label>
                  <Input
                    id="edit-contact-email"
                    type="email"
                    value={selectedCompany.contact_email || ""}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, contact_email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-contact-phone">Contact Phone</Label>
                  <Input
                    id="edit-contact-phone"
                    value={selectedCompany.contact_phone || ""}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, contact_phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  value={selectedCompany.website || ""}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, website: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-logo">Logo URL</Label>
                <Input
                  id="edit-logo"
                  value={selectedCompany.logo_url || ""}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, logo_url: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedCompany.description || ""}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCompany} className="bg-gradient-primary">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
