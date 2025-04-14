import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import Index from "./pages/Index";
import AppLayout from "./pages/AppLayout";
import NotFound from "./pages/NotFound";
import OnboardingFlow from "./components/OnboardingFlow";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { name, isOnboarded } = useUserStore();
  
  // If user has name but is not onboarded, redirect to onboarding
  if (name && !isOnboarded) {
    return <OnboardingFlow />;
  }
  
  // If user has no name, redirect to landing page
  if (!name) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/app/*" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
