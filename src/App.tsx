import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserRole } from "./types";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import VacanciesPage from "./pages/VacanciesPage";
import VacancyDetailPage from "./pages/VacancyDetailPage";
import VacancyFormPage from "./pages/VacancyFormPage";
import ExplorePage from "./pages/ExplorePage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import MetricsPage from "./pages/MetricsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><UsersPage /></ProtectedRoute>} />
            <Route path="/vacancies" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GESTOR]}><VacanciesPage /></ProtectedRoute>} />
            <Route path="/vacancies/new" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GESTOR]}><VacancyFormPage /></ProtectedRoute>} />
            <Route path="/vacancies/:id" element={<ProtectedRoute><VacancyDetailPage /></ProtectedRoute>} />
            <Route path="/vacancies/:id/edit" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GESTOR]}><VacancyFormPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute allowedRoles={[UserRole.CODER]}><ExplorePage /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><ApplicationsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/metrics" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.GESTOR]}><MetricsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
