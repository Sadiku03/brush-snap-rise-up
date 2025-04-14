
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { getMotivationalMessage } from '@/utils/questManager';

const Avatar = () => {
  const { progress } = useUserStore();
  const [animation, setAnimation] = useState(false);
  
  // Avatar state based on progress level
  const getAvatarState = () => {
    if (progress.level >= 10) return 'evolved';
    if (progress.level >= 5) return 'growing';
    return 'starting';
  };
  
  const avatarState = getAvatarState();
  
  // Trigger animation on mount
  useEffect(() => {
    setAnimation(true);
    const timer = setTimeout(() => setAnimation(false), 1500);
    return () => clearTimeout(timer);
  }, []);
  
  // Get motivational message
  const motivationalMessage = getMotivationalMessage(progress.streak);
  
  // Avatar appearance based on state
  const renderAvatar = () => {
    switch (avatarState) {
      case 'evolved':
        return (
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-coral/10 border-4 border-coral/30 flex items-center justify-center overflow-hidden">
              <div className="relative">
                <div className="w-24 h-24 bg-indigo/10 rounded-full flex items-center justify-center">
                  <div className="w-18 h-18 bg-coral/20 rounded-full"></div>
                </div>
                <div className="absolute top-8 left-4 w-16 h-8 bg-indigo rounded-full flex items-center justify-center">
                  <div className="w-12 h-4 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-6 left-7 w-10 h-5 bg-coral rounded-full"></div>
              </div>
            </div>
            {animation && (
              <motion.div 
                className="absolute -top-4 -right-4 w-12 h-12 bg-lilac rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Star className="h-6 w-6 text-indigo" />
              </motion.div>
            )}
          </div>
        );
      
      case 'growing':
        return (
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-skyblue/20 border-4 border-skyblue/40 flex items-center justify-center overflow-hidden">
              <div className="relative">
                <div className="w-20 h-20 bg-indigo/10 rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 bg-coral/20 rounded-full"></div>
                </div>
                <div className="absolute top-6 left-4 w-12 h-6 bg-indigo rounded-full flex items-center justify-center">
                  <div className="w-8 h-3 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-5 left-6 w-8 h-4 bg-coral rounded-full"></div>
              </div>
            </div>
          </div>
        );
      
      case 'starting':
      default:
        return (
          <div className="w-32 h-32 rounded-full bg-lilac/20 border-4 border-lilac/30 flex items-center justify-center overflow-hidden">
            <div className="relative">
              <div className="w-16 h-16 bg-indigo/10 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-coral/20 rounded-full"></div>
              </div>
              <div className="absolute top-5 left-3 w-10 h-4 bg-indigo rounded-full flex items-center justify-center">
                <div className="w-6 h-2 bg-white rounded-full"></div>
              </div>
              <div className="absolute bottom-4 left-5 w-6 h-3 bg-coral rounded-full"></div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-skyblue/20 border-b border-lilac/10 p-4">
        <h2 className="text-xl font-bold text-indigo text-center">Your Sleep Companion</h2>
      </div>
      
      <div className="p-6 flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          {renderAvatar()}
        </motion.div>
        
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-indigo">
            Level {progress.level} Dreamer
          </h3>
          <p className="text-indigo/70">{motivationalMessage}</p>
        </div>
        
        <div className="w-full space-y-3">
          <div className="bg-lilac/10 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-coral" />
              <span className="text-indigo font-medium">Total XP</span>
            </div>
            <div className="font-bold text-indigo">{progress.totalXp}</div>
          </div>
          
          <div className="bg-lilac/10 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-coral" />
              <span className="text-indigo font-medium">Current Streak</span>
            </div>
            <div className="font-bold text-indigo">{progress.streak} days</div>
          </div>
          
          <div className="bg-lilac/10 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-coral" />
              <span className="text-indigo font-medium">Longest Streak</span>
            </div>
            <div className="font-bold text-indigo">{progress.longestStreak} days</div>
          </div>
        </div>
        
        <div className="mt-6 bg-coral/10 p-4 rounded-lg border border-coral/20 text-center w-full">
          <p className="text-indigo/80 text-sm">
            Your sleep companion grows stronger as you maintain your streak and level up!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
