
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CitizenDashboard from "./pages/dashboard/CitizenDashboard";
import LeaderDashboard from "./pages/dashboard/LeaderDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import LeadersManagement from "./pages/admin/LeadersManagement";
import ComplaintsPage from "./pages/complaints/ComplaintsPage";
import ComplaintDetailPage from "./pages/complaints/ComplaintDetailPage";
import CreateComplaintPage from "./pages/complaints/CreateComplaintPage";
import EditComplaintPage from "./pages/complaints/EditComplaintPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute restricted={true}>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute restricted={true}>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute restricted={true}>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute restricted={true}>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          
          {/* Unauthorized page */}
          <Route 
            path="/unauthorized" 
            element={<Unauthorized />} 
          />
          
          {/* Protected routes - Citizen */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['CITIZEN', 'LEADER', 'ADMIN']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaints" 
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <ComplaintsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaints/create" 
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <CreateComplaintPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaints/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <EditComplaintPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/complaints/:id" 
            element={
              <ProtectedRoute allowedRoles={['CITIZEN']}>
                <ComplaintDetailPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - Leader */}
          <Route 
            path="/leader/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['LEADER', 'ADMIN']}>
                <LeaderDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/leaders" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <LeadersManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Common protected routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
