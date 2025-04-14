
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import Index from "./pages/Index";
import AppLayout from "./pages/AppLayout";
import NotFound from "./pages/NotFound";
import OnboardingFlow from "./components/OnboardingFlow";

const queryClient = new QueryClient();

// Mobile frame wrapper component with enhanced iPhone look
const MobileFrame = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  
  if (!isAppRoute) {
    return <>{children}</>;
  }
  
  return (
    <div className="mobile-frame-container">
      <div className="mobile-frame">
        <div className="mobile-frame-notch" />
        <div className="mobile-status-bar">
          <div>9:41</div>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9H3V3H1V9ZM5 9H7V1H5V9ZM9 9H11V5H9V9ZM13 9H15V7H13V9Z" fill="currentColor"/>
              <rect x="0.5" y="0.5" width="17" height="11" rx="2.5" stroke="currentColor"/>
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor"/>
              <rect x="2" y="2" width="18" height="8" rx="1" fill="currentColor"/>
              <path d="M23 4V8C24.1046 8 25 7.10457 25 6C25 4.89543 24.1046 4 23 4Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <div className="mobile-frame-content">
          {children}
        </div>
        <div className="mobile-home-indicator" />
      </div>
    </div>
  );
};

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
              <MobileFrame>
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              </MobileFrame>
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
