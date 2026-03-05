import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { ForgeAuthProvider, useForgeAuth } from "@/contexts/ForgeAuthContext";
import { ForgeDataProvider } from "@/contexts/ForgeDataContext";
import AppLayout from "@/components/layout/AppLayout";
import ForgeLayout from "@/components/forge/ForgeLayout";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import PitchesPage from "@/pages/PitchesPage";
import PitchCreatePage from "@/pages/PitchCreatePage";
import PitchDetailPage from "@/pages/PitchDetailPage";
import NotificationsPage from "@/pages/NotificationsPage";
import ForgeLoginPage from "@/pages/forge/ForgeLoginPage";
import ForgeDashboard from "@/pages/forge/ForgeDashboard";
import ProblemBankPage from "@/pages/forge/ProblemBankPage";
import ForgeTodosPage from "@/pages/forge/ForgeTodosPage";
import ForgeKPIsPage from "@/pages/forge/ForgeKPIsPage";
import MarketValidationPage from "@/pages/forge/MarketValidationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function ForgeProtectedRoute({ children }: { children: React.ReactNode }) {
  const { member } = useForgeAuth();
  if (!member) return <Navigate to="/forge" replace />;
  return <>{children}</>;
}

function ForgeAuthRoute({ children }: { children: React.ReactNode }) {
  const { member } = useForgeAuth();
  if (member) return <Navigate to="/forge/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pitches" element={<PitchesPage />} />
        <Route path="/pitch/new" element={<PitchCreatePage />} />
        <Route path="/pitch/:id" element={<PitchDetailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Forge Portal */}
      <Route path="/forge" element={<ForgeAuthRoute><ForgeLoginPage /></ForgeAuthRoute>} />
      <Route element={<ForgeProtectedRoute><ForgeLayout /></ForgeProtectedRoute>}>
        <Route path="/forge/dashboard" element={<ForgeDashboard />} />
        <Route path="/forge/problems" element={<ProblemBankPage />} />
        <Route path="/forge/todos" element={<ForgeTodosPage />} />
        <Route path="/forge/kpis" element={<ForgeKPIsPage />} />
        <Route path="/forge/validation" element={<MarketValidationPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <ForgeAuthProvider>
            <ForgeDataProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </ForgeDataProvider>
          </ForgeAuthProvider>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
