
import { Navigate } from "react-router-dom";

const Index = () => {
  // Directly navigate to app dashboard
  return <Navigate to="/app" replace />;
};

export default Index;
