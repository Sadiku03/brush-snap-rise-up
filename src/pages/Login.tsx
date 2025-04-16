
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/userStore";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setUser, completeOnboarding } = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if ((!isLogin && !name) || !email || !password) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (isLogin) {
      // Simple login check - in a real app, this would be server authentication
      if (email === "demo@example.com" && password === "password") {
        setUser("Demo User", email);
        completeOnboarding();
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate("/app");
      } else {
        // For demo purposes, allow any login
        setUser(email.split("@")[0], email);
        completeOnboarding();
        toast({
          title: "Welcome!",
          description: "Login successful.",
        });
        navigate("/app");
      }
    } else {
      // Signup logic - in a real app, this would create a new account
      setUser(name, email);
      completeOnboarding();
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      navigate("/app");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sand to-white p-4 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-indigo mb-2">RiseQuest</h1>
          <p className="text-indigo/70">Transform your morning routine</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-indigo mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-indigo/70 mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo/40 h-5 w-5" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo/70 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo/40 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-indigo/70 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo/40 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-coral hover:bg-coral/90 text-white flex items-center justify-center gap-2 mt-6"
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-indigo/70">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-coral font-medium"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
