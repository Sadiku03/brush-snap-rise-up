
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from '@/store/userStore';
import Avatar from '@/components/Avatar';
import { User, AtSign, AlertCircle, Settings, Edit, Star, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  const { name, email, setUser, resetProgress } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [nameInput, setNameInput] = useState(name || '');
  const [emailInput, setEmailInput] = useState(email || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const { toast } = useToast();
  
  const handleSaveProfile = () => {
    if (nameInput.trim()) {
      setUser(nameInput, emailInput);
      setEditMode(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
        duration: 3000,
      });
    }
  };
  
  const handleResetProgress = () => {
    resetProgress();
    setShowResetConfirm(false);
    
    toast({
      title: "Progress Reset",
      description: "Your progress has been reset. You can start fresh!",
      duration: 3000,
    });
  };
  
  return (
    <div className="space-y-6 px-4 pb-8">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-indigo mb-1">Profile</h1>
        <p className="text-indigo/70">Manage your account and progress</p>
      </div>
      
      <div className="space-y-6">
        {/* Profile card - optimized for mobile */}
        <Card className="border border-lilac/20 shadow-md overflow-hidden">
          <CardHeader className="bg-skyblue/20 border-b border-lilac/10 pb-4">
            <CardTitle className="text-xl font-bold text-indigo">Your Profile</CardTitle>
          </CardHeader>
          
          <CardContent className="p-5">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-indigo/80 mb-1 block">
                    Your Name
                  </Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo/70" />
                    <Input
                      id="name"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="input-field"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-indigo/80 mb-1 block">
                    Email (optional)
                  </Label>
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-indigo/70" />
                    <Input
                      id="email"
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="input-field"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="pt-2 flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    className="btn-primary"
                    disabled={!nameInput.trim()}
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User avatar - centered on mobile */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-lilac/20 rounded-full flex items-center justify-center text-3xl font-bold text-indigo mb-3">
                    {name ? name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <h3 className="text-lg font-semibold text-indigo">{name || 'Not set'}</h3>
                  <p className="text-sm text-indigo/70">{email || <span className="italic">Email not provided</span>}</p>
                </div>
                
                <Button
                  onClick={() => setEditMode(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Sleep companion - optimized for mobile */}
        <Card className="border border-lilac/20 shadow-md overflow-hidden">
          <CardHeader className="bg-skyblue/20 border-b border-lilac/10 pb-4">
            <CardTitle className="text-xl font-bold text-indigo">Sleep Companion</CardTitle>
          </CardHeader>
          
          <CardContent className="p-5">
            <Avatar />
          </CardContent>
        </Card>
        
        {/* Settings card */}
        <Card className="border border-lilac/20 shadow-md overflow-hidden">
          <CardHeader className="bg-skyblue/20 border-b border-lilac/10 pb-4">
            <CardTitle className="text-xl font-bold text-indigo flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-5">
            <div className="space-y-5">
              <div className="border-b border-lilac/10 pb-5">
                <h3 className="font-semibold text-indigo mb-3">Account</h3>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-indigo">App Notifications</p>
                      <p className="text-sm text-indigo/70">
                        Receive reminders about quests and wake-up times
                      </p>
                    </div>
                    <Button variant="outline" className="border-lilac/30 whitespace-nowrap self-start sm:self-center mt-1 sm:mt-0">
                      Coming Soon
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-indigo">Data Export</p>
                      <p className="text-sm text-indigo/70">
                        Download all your progress and statistics
                      </p>
                    </div>
                    <Button variant="outline" className="border-lilac/30 whitespace-nowrap self-start sm:self-center mt-1 sm:mt-0">
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-indigo mb-3">Danger Zone</h3>
                
                {showResetConfirm ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700 mb-2">
                          Are you sure you want to reset your progress?
                        </p>
                        <p className="text-sm text-red-600 mb-4">
                          This will delete your wake-up plan, quests, streak, and all statistics. 
                          This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          <Button
                            variant="outline"
                            onClick={() => setShowResetConfirm(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleResetProgress}
                            className="flex-1"
                          >
                            Yes, Reset Everything
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-indigo">Reset Progress</p>
                      <p className="text-sm text-indigo/70">
                        Delete all your data and start over
                      </p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={() => setShowResetConfirm(true)}
                      className="self-start sm:self-center mt-1 sm:mt-0"
                    >
                      Reset
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
