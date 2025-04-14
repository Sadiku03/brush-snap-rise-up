import LandingPage from "@/components/LandingPage";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useUserStore } from "@/store/userStore";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { name, isOnboarded } = useUserStore();
  
  // If user is already onboarded, redirect them to app
  if (name && isOnboarded) {
    return <Navigate to="/app" replace />;
  }
  
  // If user has a name but isn't onboarded, show onboarding
  if (name && !isOnboarded) {
    return <OnboardingFlow />;
  }
  
  // Otherwise, show landing page
  return <LandingPage />;
};

export default Index;
