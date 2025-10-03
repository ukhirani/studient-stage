"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Search, UserCheck, UserX, Mail, Phone, GraduationCap, Users, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client" // add supabase

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "student" | "placement_officer" | "faculty_mentor" | "recruiter"
  status: "active" | "inactive" | "suspended"
  joinedDate: string
  department?: string
}

const roleIcons = {
  student: GraduationCap,
  placement_officer: Shield,
  faculty_mentor: UserCheck,
  recruiter: Building,
}

const roleColors = {
  student: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  placement_officer: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  faculty_mentor: "bg-green-500/10 text-green-600 border-green-500/20",
  recruiter: "bg-orange-500/10 text-orange-600 border-orange-500/20",
}

export default function UserManagement() {
  const { profile } = useOutletContext<{ profile: any }>()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // fetch all profiles
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
        if (error) throw error

        // get departments for students
        const studentIds = (profiles || []).filter((p: any) => p.role === "student").map((p: any) => p.user_id)
        let studentProfilesMap: Record<string, any> = {}
        if (studentIds.length) {
          const { data: sps } = await supabase
            .from("student_profiles")
            .select("user_id, department")
            .in("user_id", studentIds)
          studentProfilesMap = Object.fromEntries((sps || []).map((s: any) => [s.user_id, s]))
        }

        const mapped: User[] = (profiles || []).map((p: any) => ({
          id: p.user_id,
          name: p.full_name,
          email: p.email,
          phone: p.phone || "",
          role: p.role,
          status: "active",
          joinedDate: (p.created_at || "").split("T")[0] || "",
          department: studentProfilesMap[p.user_id]?.department || undefined,
        }))

        setUsers(mapped)
      } catch (err: any) {
        toast({ title: "Error loading users", description: err.message, variant: "destructive" })
      }
    }
    fetchUsers()
  }, [toast])

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "suspended" : "active"
          toast({ title: `User ${newStatus}`, description: `${user.name} has been ${newStatus}` })
          return { ...user, status: newStatus }
        }
        return user
      }),
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    students: users.filter((u) => u.role === "student").length,
    faculty: users.filter((u) => u.role === "faculty_mentor").length,
    recruiters: users.filter((u) => u.role === "recruiter").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and access controls</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.students}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.faculty}</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recruiters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.recruiters}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="faculty_mentor">Faculty</SelectItem>
                  <SelectItem value="recruiter">Recruiters</SelectItem>
                  <SelectItem value="placement_officer">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user, idx) => {
            const RoleIcon = roleIcons[user.role]
            const roleColorClass = roleColors[user.role]

            return (
              <Card
                key={user.id}
                className="bg-gradient-card border-border/50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${roleColorClass}`}
                      >
                        <RoleIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "suspended"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                          <Badge variant="outline" className={roleColorClass}>
                            {user.role.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {user.phone}
                          </div>
                          {user.department && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {user.department}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={user.status === "suspended" ? "text-green-600" : "text-destructive"}
                      >
                        {user.status === "suspended" ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No users found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
