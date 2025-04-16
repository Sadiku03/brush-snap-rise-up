
import { useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, User, Award, Calendar, Moon, Menu, LogOut, Wifi, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/components/ui/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import Quests from "./Quests";
import Progress from "./Progress";
import WindDown from "./WindDown";

const AppLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
      duration: 3000,
    });
    
    window.localStorage.removeItem("risequest-storage");
    window.location.href = "/";
  };
  
  // Helper function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app') return 'Dashboard';
    if (path === '/app/profile') return 'Profile';
    if (path === '/app/quests') return 'Quests';
    if (path === '/app/progress') return 'Progress';
    if (path === '/app/wind-down') return 'Wind Down';
    return 'RiseQuest';
  };
  
  return (
    <div className="min-h-full bg-sand relative">
      {/* iOS-Style Header */}
      <header className="bg-white border-b border-lilac/20 sticky top-0 z-10">
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo">{getPageTitle()}</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-indigo rounded-full h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* iOS-style Drawer Menu - The only navigation method */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent className="ios-drawer h-[60%] max-h-[60%]" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-indigo/20"></div>
          <DrawerHeader className="text-center border-b border-lilac/10 pb-2">
            <DrawerTitle className="text-lg font-semibold text-indigo">Menu</DrawerTitle>
          </DrawerHeader>
          
          <nav className="p-3 overflow-auto">
            <div className="space-y-1">
              <Link
                to="/app"
                className={`ios-menu-button ${
                  location.pathname === '/app' 
                    ? 'ios-menu-button-active' 
                    : 'ios-menu-button-inactive'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/app/progress"
                className={`ios-menu-button ${
                  location.pathname === '/app/progress' 
                    ? 'ios-menu-button-active' 
                    : 'ios-menu-button-inactive'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="h-5 w-5" />
                <span>Schedule</span>
              </Link>
              
              <Link
                to="/app/quests"
                className={`ios-menu-button ${
                  location.pathname === '/app/quests' 
                    ? 'ios-menu-button-active' 
                    : 'ios-menu-button-inactive'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Award className="h-5 w-5" />
                <span>Quests</span>
              </Link>
              
              <Link
                to="/app/profile"
                className={`ios-menu-button ${
                  location.pathname === '/app/profile' 
                    ? 'ios-menu-button-active' 
                    : 'ios-menu-button-inactive'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              
              <Link
                to="/app/wind-down"
                className={`ios-menu-button ${
                  location.pathname === '/app/wind-down' 
                    ? 'ios-menu-button-active' 
                    : 'ios-menu-button-inactive'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Moon className="h-5 w-5" />
                <span>Wind Down</span>
              </Link>
            </div>
          </nav>
          
          <DrawerFooter className="pb-8 pt-2">
            <Button 
              variant="outline" 
              className="w-full border-coral/30 text-coral flex items-center justify-center gap-2 ios-menu-button"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Main Content - Adjusted to remove the bottom padding needed for tab bar */}
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quests" element={<Quests />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/wind-down" element={<WindDown />} />
        </Routes>
      </main>
    </div>
  );
};

export default AppLayout;
