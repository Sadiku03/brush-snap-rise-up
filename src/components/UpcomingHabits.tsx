
import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock } from "lucide-react";
import { useUserStore } from '@/store/userStore';
import { allHabitQuests } from '@/data/questsByLevel';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

const UpcomingHabits = () => {
  const [upcomingExpanded, setUpcomingExpanded] = useState(true);
  const { progress } = useUserStore();
  
  // Get upcoming habits that are locked
  const lockedHabits = allHabitQuests
    .filter(habit => habit.levelRequired > progress.level)
    .sort((a, b) => a.levelRequired - b.levelRequired)
    .slice(0, 3);  // Show only the next few habits
  
  if (lockedHabits.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-purple-50 p-4 border-b border-purple-100">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-700">Upcoming Habits</h2>
        </div>
      </div>
      
      <div className="p-5">
        {/* Upcoming habits section */}
        <Collapsible
          open={upcomingExpanded}
          onOpenChange={setUpcomingExpanded}
          className="border border-purple-100 rounded-lg overflow-hidden"
        >
          <div className="bg-purple-50 p-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wider">
                Habits Unlocked by Leveling Up
              </h3>
              {upcomingExpanded ? (
                <ChevronDown className="h-5 w-5 text-purple-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-purple-500" />
              )}
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="p-3 bg-white">
            {lockedHabits.length > 0 ? (
              <div className="space-y-3">
                {lockedHabits.map(habit => (
                  <div 
                    key={habit.id}
                    className="border border-purple-100 rounded-lg p-4 opacity-60 relative overflow-hidden"
                  >
                    <div className="absolute right-0 top-0 bg-purple-100 text-purple-700 px-2 py-1 text-xs font-medium rounded-bl-lg flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Level {habit.levelRequired}
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-purple-600 uppercase font-medium mb-1">{habit.category}</p>
                      <h4 className="font-medium text-purple-800">{habit.title}</h4>
                      <p className="text-xs text-purple-600 mt-1">{habit.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-purple-600">
                        Keep leveling up to unlock!
                      </span>
                      <div className="bg-purple-100 px-2 py-1 rounded-full flex items-center">
                        <span className="text-xs font-medium text-purple-700 ml-1">{habit.xp} XP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-indigo/70">You've unlocked all available habits! Great job!</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default UpcomingHabits;
