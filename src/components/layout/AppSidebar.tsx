import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  User, 
  Settings, 
  LogOut,
  Users,
  UserCheck,
  Building,
  Calendar,
  BarChart3,
  Award,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  userRole: string;
  userName: string;
}

const menuItems = {
  student: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Opportunities", url: "/opportunities", icon: Briefcase },
    { title: "My Applications", url: "/applications", icon: FileText },
    { title: "Profile", url: "/profile", icon: User },
    { title: "Certificates", url: "/certificates", icon: Award },
  ],
  placement_officer: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Opportunities", url: "/opportunities", icon: Briefcase },
    { title: "Applications", url: "/applications", icon: FileText },
    { title: "Students", url: "/students", icon: Users },
    { title: "Verify Recruiters", url: "/verify-recruiters", icon: UserCheck },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Profile", url: "/profile", icon: User },
  ],
  faculty_mentor: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "My Students", url: "/students", icon: Users },
    { title: "Applications", url: "/applications", icon: FileText },
    { title: "Feedback", url: "/feedback", icon: MessageSquare },
    { title: "Profile", url: "/profile", icon: User },
  ],
  recruiter: [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Post Opportunity", url: "/opportunities/new", icon: Briefcase },
    { title: "My Opportunities", url: "/opportunities", icon: Building },
    { title: "Applications", url: "/applications", icon: FileText },
    { title: "Schedule", url: "/schedule", icon: Calendar },
    { title: "Profile", url: "/profile", icon: User },
  ],
};

const roleIcons = {
  student: GraduationCap,
  placement_officer: Users,
  faculty_mentor: UserCheck,
  recruiter: Building,
};

export function AppSidebar({ userRole, userName }: SidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const items = menuItems[userRole as keyof typeof menuItems] || [];
  const RoleIcon = roleIcons[userRole as keyof typeof roleIcons] || User;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            {!collapsed && (
              <>
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-bold text-sidebar-foreground">Campus Connect</h2>
                  <p className="text-xs text-sidebar-foreground/70">Hub</p>
                </div>
              </>
            )}
            {collapsed && <GraduationCap className="h-6 w-6 text-primary mx-auto" />}
          </div>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <RoleIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sidebar-foreground truncate">{userName}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {userRole.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!collapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavCls}>
                    <Settings className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={handleSignOut}
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}