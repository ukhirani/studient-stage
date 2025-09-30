"use client"

import { useState } from "react"
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
import { Building2, Plus, Search, Edit, Trash2, MapPin, Users, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Company {
  id: string
  name: string
  industry: string
  location: string
  website: string
  description: string
  activeOpportunities: number
  totalHires: number
  status: "active" | "inactive"
}

export default function CompanyManagement() {
  const { profile } = useOutletContext<{ profile: any }>()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    website: "",
    description: "",
  })

  // Mock data - replace with actual API calls
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "Tech Corp",
      industry: "Technology",
      location: "Bangalore, India",
      website: "https://techcorp.com",
      description: "Leading technology company specializing in AI and ML solutions",
      activeOpportunities: 5,
      totalHires: 23,
      status: "active",
    },
    {
      id: "2",
      name: "DataCorp",
      industry: "Data Analytics",
      location: "Mumbai, India",
      website: "https://datacorp.com",
      description: "Data analytics and business intelligence solutions provider",
      activeOpportunities: 3,
      totalHires: 15,
      status: "active",
    },
    {
      id: "3",
      name: "StartupXYZ",
      industry: "E-commerce",
      location: "Delhi, India",
      website: "https://startupxyz.com",
      description: "Fast-growing e-commerce platform",
      activeOpportunities: 0,
      totalHires: 8,
      status: "inactive",
    },
  ])

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.industry || !newCompany.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const company: Company = {
      id: Date.now().toString(),
      ...newCompany,
      activeOpportunities: 0,
      totalHires: 0,
      status: "active",
    }

    setCompanies([...companies, company])
    setIsAddDialogOpen(false)
    setNewCompany({
      name: "",
      industry: "",
      location: "",
      website: "",
      description: "",
    })

    toast({
      title: "Company added",
      description: `${company.name} has been added successfully`,
    })
  }

  const handleDeleteCompany = (id: string) => {
    setCompanies(companies.filter((c) => c.id !== id))
    toast({
      title: "Company removed",
      description: "The company has been removed from the system",
    })
  }

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <DialogContent className="max-w-2xl">
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
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newCompany.location}
                      onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                      placeholder="Bangalore, India"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{companies.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {companies.filter((c) => c.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {companies.reduce((sum, c) => sum + c.activeOpportunities, 0)}
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
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="bg-gradient-card border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{company.name}</h3>
                        <Badge variant={company.status === "active" ? "default" : "secondary"}>{company.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{company.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {company.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {company.industry}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {company.totalHires} hires
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
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
    </div>
  )
}
