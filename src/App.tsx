import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthForm } from "@/components/auth/AuthForm";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Opportunities from "@/pages/Opportunities";
import CreateOpportunity from "@/pages/CreateOpportunity";
import Applications from "@/pages/Applications";
import Profile from "@/pages/Profile";
import VerifyRecruiters from "@/pages/VerifyRecruiters";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="campus-connect-theme">
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
              <Route path="applications" element={<Applications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="verify-recruiters" element={<VerifyRecruiters />} />
              <Route path="settings" element={<div className="p-6">Settings Page - Coming Soon</div>} />
              <Route path="students" element={<div className="p-6">Students Page - Coming Soon</div>} />
              <Route path="analytics" element={<div className="p-6">Analytics Page - Coming Soon</div>} />
              <Route path="feedback" element={<div className="p-6">Feedback Page - Coming Soon</div>} />
              <Route path="schedule" element={<div className="p-6">Schedule Page - Coming Soon</div>} />
              <Route path="certificates" element={<div className="p-6">Certificates Page - Coming Soon</div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
