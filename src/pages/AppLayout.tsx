
import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, User, Award, BarChart, Moon, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/components/ui/use-toast";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Quests from "./Quests";
import Progress from "./Progress";
import WindDown from "./WindDown";

const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    // Simulate logout (in a real app, would clear authentication)
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      duration: 3000,
    });
    
    // This will clear the local storage and reset the store
    window.localStorage.removeItem("risequest-storage");
    // Reload the page to clear the state
    window.location.href = "/";
  };
  
  return (
    <div className="min-h-screen bg-sand">
      {/* Mobile Header */}
      <header className="bg-white border-b border-lilac/20 p-4 md:hidden sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo">RiseQuest</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-indigo"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-indigo/50 backdrop-blur-sm z-20 md:hidden" onClick={toggleMenu}>
          <div className="bg-white w-64 h-full shadow-xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-indigo">Menu</h2>
              <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-indigo">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="space-y-1">
              <Link
                to="/app"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
                onClick={toggleMenu}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/app/profile"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/profile' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
                onClick={toggleMenu}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              
              <Link
                to="/app/quests"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/quests' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
                onClick={toggleMenu}
              >
                <Award className="h-5 w-5" />
                <span>Quests</span>
              </Link>
              
              <Link
                to="/app/progress"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/progress' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
                onClick={toggleMenu}
              >
                <BarChart className="h-5 w-5" />
                <span>Progress</span>
              </Link>
              
              <Link
                to="/app/wind-down"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/wind-down' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
                onClick={toggleMenu}
              >
                <Moon className="h-5 w-5" />
                <span>Wind Down</span>
              </Link>
            </nav>
            
            <div className="absolute bottom-8 left-0 right-0 px-5">
              <Button 
                variant="outline" 
                className="w-full border-coral/30 text-coral flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex h-screen pt-0 md:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-lilac/20 h-full fixed left-0 top-0">
          <div className="p-5">
            <h1 className="text-2xl font-bold text-indigo mb-8">RiseQuest</h1>
            
            <nav className="space-y-1">
              <Link
                to="/app"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/app/profile"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/profile' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              
              <Link
                to="/app/quests"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/quests' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
              >
                <Award className="h-5 w-5" />
                <span>Quests</span>
              </Link>
              
              <Link
                to="/app/progress"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/progress' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
              >
                <BarChart className="h-5 w-5" />
                <span>Progress</span>
              </Link>
              
              <Link
                to="/app/wind-down"
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  location.pathname === '/app/wind-down' 
                    ? 'bg-coral text-white' 
                    : 'text-indigo hover:bg-lilac/10'
                }`}
              >
                <Moon className="h-5 w-5" />
                <span>Wind Down</span>
              </Link>
            </nav>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 px-5">
            <Button 
              variant="outline" 
              className="w-full border-coral/30 text-coral flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/wind-down" element={<WindDown />} />
          </Routes>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-lilac/20 flex justify-around py-2 md:hidden">
          <Link
            to="/app"
            className={`p-2 rounded-lg flex flex-col items-center ${
              location.pathname === '/app' ? 'text-coral' : 'text-indigo/70'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            to="/app/quests"
            className={`p-2 rounded-lg flex flex-col items-center ${
              location.pathname === '/app/quests' ? 'text-coral' : 'text-indigo/70'
            }`}
          >
            <Award className="h-6 w-6" />
            <span className="text-xs mt-1">Quests</span>
          </Link>
          
          <Link
            to="/app/progress"
            className={`p-2 rounded-lg flex flex-col items-center ${
              location.pathname === '/app/progress' ? 'text-coral' : 'text-indigo/70'
            }`}
          >
            <BarChart className="h-6 w-6" />
            <span className="text-xs mt-1">Progress</span>
          </Link>
          
          <Link
            to="/app/profile"
            className={`p-2 rounded-lg flex flex-col items-center ${
              location.pathname === '/app/profile' ? 'text-coral' : 'text-indigo/70'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
