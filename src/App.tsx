import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/vacancies" element={<VacanciesPage />} />
            <Route path="/vacancies/new" element={<VacancyFormPage />} />
            <Route path="/vacancies/:id" element={<VacancyDetailPage />} />
            <Route path="/vacancies/:id/edit" element={<VacancyFormPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/metrics" element={<MetricsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
