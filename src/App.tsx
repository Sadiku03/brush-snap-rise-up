
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { Battery, Wifi } from "lucide-react";
import Index from "./pages/Index";
import AppLayout from "./pages/AppLayout";
import NotFound from "./pages/NotFound";
import OnboardingFlow from "./components/OnboardingFlow";

const queryClient = new QueryClient();

// Mobile frame wrapper component with enhanced iPhone look
const MobileFrame = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (!isAppRoute) {
    return <>{children}</>;
  }
  
  return (
    <div className="mobile-frame-container">
      <div className="mobile-frame">
        <div className="mobile-frame-notch" />
        <div className="mobile-status-bar">
          <div className="font-semibold">{currentTime}</div>
          <div className="flex items-center gap-2">
            <div className="text-[10px] font-medium">5G</div>
            <Wifi size={14} className="opacity-90" />
            <div className="relative">
              <Battery size={16} className="opacity-90" />
              <div className="absolute inset-0 right-1.5 flex items-center justify-start">
                <div className="h-[6px] w-[6px] bg-green-500 rounded-full"></div>
              </div>
            </div>
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
