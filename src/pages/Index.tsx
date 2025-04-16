
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

const Index = () => {
  const { name } = useUserStore();

  // Redirect to login if no user, otherwise go to app
  return name ? <Navigate to="/app" replace /> : <Navigate to="/login" replace />;
};

export default Index;
