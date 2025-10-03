import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { DummyAuthProvider } from "@/contexts/DummyAuthContext"
import { AuthForm } from "@/components/auth/AuthForm"
import { AppLayout } from "@/components/layout/AppLayout"
import Dashboard from "@/pages/Dashboard"
import Opportunities from "@/pages/Opportunities"
import CreateOpportunity from "@/pages/CreateOpportunity"
import Applications from "@/pages/Applications"
import Profile from "@/pages/Profile"
import Certificates from "@/pages/Certificates"
import Settings from "@/pages/Settings"
import CompanyManagement from "@/pages/CompanyManagement"
import UserManagement from "@/pages/UserManagement"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import Students from "@/pages/Students"
import Feedback from "@/pages/Feedback"
import VerifyRecruiters from "@/pages/VerifyRecruiters"
import Schedule from "@/pages/Schedule"
import MyOpportunities from "@/pages/MyOpportunities"
import MyStudents from "@/pages/MyStudents"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="campus-connect-theme">
      <DummyAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthForm />} />
              <Route path="/" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="opportunities/new" element={<CreateOpportunity />} />
              <Route path="my-opportunities" element={<MyOpportunities />} />
              <Route path="applications" element={<Applications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="companies" element={<CompanyManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="students" element={<Students />} />
              <Route path="my-students" element={<MyStudents />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="verify-recruiters" element={<VerifyRecruiters />} />
              <Route path="analytics" element={<div className="p-6">Analytics Page - Coming Soon</div>} />
              <Route path="approvals" element={<div className="p-6">Approvals Page - Coming Soon</div>} />
              <Route path="schedule" element={<Schedule />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </DummyAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
