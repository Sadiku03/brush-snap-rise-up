import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Award, Star, RefreshCw, Info, ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { useUserStore } from '@/store/userStore';
import { 
  generateDailyQuests, 
  shouldRefreshQuests,
  getXpUntilNextLevel 
} from '@/utils/questManager';
import { useToast } from '@/components/ui/use-toast';
import QuestList from './QuestList';
import QuestCalendarView from './QuestCalendarView';
import { useQuestHistory } from '@/hooks/useQuestHistory';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { allHabitQuests } from '@/data/questsByLevel';

const calculateXpWithStreak = (baseXp: number, streak: number): number => {
  const bonusPercentage = 0.1; // 10% bonus per day in streak
  const multiplier = 1 + (streak * bonusPercentage);
  return Math.round(baseXp * multiplier);
};

const LOCAL_STORAGE_LAST_REFRESH_KEY = 'risequest-last-refresh-date';

const QuestSystem = () => {
  const { 
    availableQuests, 
    completedQuests, 
    completeQuest, 
    progress,
    refreshDailyQuests
  } = useUserStore();
  
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [questsRefreshed, setQuestsRefreshed] = useState(false);
  
  const [dailyQuestsExpanded, setDailyQuestsExpanded] = useState(true);
  const [availableExpanded, setAvailableExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);
  
  const questHistory = useQuestHistory(availableQuests, completedQuests);
  
  const streakMultiplier = (1 + (progress.streak * 0.1)).toFixed(1);
  
  const xpRemaining = getXpUntilNextLevel(progress.level, progress.xp);
  
  const weeklyStreakProgress = Math.min(progress.streak / 7, 1) * 100;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayCompletedQuests = completedQuests.filter(quest => {
    const questCompletedDate = quest.dateCompleted ? new Date(quest.dateCompleted).toISOString().split('T')[0] : null;
    return questCompletedDate === todayStr;
  });
  
  const unlockedHabits = allHabitQuests.filter(habit => habit.levelRequired <= progress.level);
  const totalUnlockedHabits = unlockedHabits.length;
  const totalHabits = allHabitQuests.length;
  
  const unlockedCategories = [...new Set(unlockedHabits.map(habit => habit.category))];
  const totalCategories = [...new Set(allHabitQuests.map(habit => habit.category))].length;
  
  const calculateAdjustedXp = (baseXp: number) => {
    return calculateXpWithStreak(baseXp, progress.streak);
  };
  
  const handleCompleteQuest = (quest: any) => {
    const adjustedXp = calculateXpWithStreak(quest.xpReward, progress.streak);
    
    completeQuest(quest.id);
    
    toast({
      title: "Quest Completed!",
      description: `You earned ${adjustedXp} XP for completing "${quest.title}"`,
      duration: 3000,
    });
  };
  
  const handleRefreshQuests = () => {
    setRefreshing(true);
    
    refreshDailyQuests();
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(LOCAL_STORAGE_LAST_REFRESH_KEY, today);
    
    setQuestsRefreshed(true);
    
    setTimeout(() => {
      setRefreshing(false);
      
      toast({
        title: "Quests Refreshed",
        description: "Your daily quests have been updated with new challenges!",
        duration: 3000,
      });
    }, 1000);
  };
  
  useEffect(() => {
    const lastRefreshDate = localStorage.getItem(LOCAL_STORAGE_LAST_REFRESH_KEY);
    
    if (shouldRefreshQuests(lastRefreshDate)) {
      refreshDailyQuests();
      
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(LOCAL_STORAGE_LAST_REFRESH_KEY, today);
      
      setQuestsRefreshed(true);
    }
  }, [refreshDailyQuests]);
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-skyblue/20 border-b border-lilac/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-coral" />
          <h2 className="text-xl font-bold text-indigo">Daily Habits</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="mr-2 text-sm text-indigo/70">
            <span className="font-medium">Level {progress.level}</span>
            <span className="mx-1">•</span>
            <span>{progress.xp}/{progress.level * 100} XP</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshQuests}
            disabled={refreshing}
            className="text-indigo/70 border-lilac/30"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="p-5">
        {questsRefreshed && (
          <div className="bg-skyblue/20 text-indigo rounded-lg p-3 mb-4 flex items-center">
            <Info className="h-4 w-4 mr-2 text-indigo" />
            <p className="text-sm">New habits have been generated for today!</p>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-semibold text-indigo-700">Habit Progress</h3>
                <p className="text-sm text-indigo-600">
                  You've unlocked <strong>{totalUnlockedHabits}/{totalHabits}</strong> habits across <strong>{unlockedCategories.length}/{totalCategories}</strong> categories.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-600">Next level in</p>
                <p className="font-bold text-indigo-700">{xpRemaining} XP</p>
              </div>
            </div>
          </div>
        
          <Collapsible
            open={dailyQuestsExpanded}
            onOpenChange={setDailyQuestsExpanded}
            className="border border-indigo-100 rounded-lg overflow-hidden"
          >
            <div className="bg-indigo-50 p-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">
                  Daily Habits
                </h3>
                {dailyQuestsExpanded ? (
                  <ChevronDown className="h-5 w-5 text-indigo-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-indigo-500" />
                )}
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="p-3 bg-white">
              <div className="space-y-4">
                <Collapsible
                  open={availableExpanded}
                  onOpenChange={setAvailableExpanded}
                  className="border border-amber-100 rounded-lg overflow-hidden"
                >
                  <div className="bg-amber-50 p-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                        Available Habits
                      </h3>
                      {availableExpanded ? (
                        <ChevronDown className="h-5 w-5 text-amber-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-amber-500" />
                      )}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="p-3 bg-white">
                    <QuestList 
                      quests={availableQuests}
                      onCompleteQuest={handleCompleteQuest}
                      streakMultiplier={streakMultiplier}
                      calculateAdjustedXp={calculateAdjustedXp}
                      emptyMessage="You've completed all habits for today! New habits will be available tomorrow."
                      showDetails={false}
                    />
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible
                  open={completedExpanded}
                  onOpenChange={setCompletedExpanded}
                  className="border border-emerald-100 rounded-lg overflow-hidden"
                >
                  <div className="bg-emerald-50 p-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                        Completed Habits
                      </h3>
                      {completedExpanded ? (
                        <ChevronDown className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-emerald-500" />
                      )}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="p-3 bg-white">
                    <QuestList
                      quests={todayCompletedQuests}
                      isCompleted={true}
                      streakMultiplier={streakMultiplier}
                      calculateAdjustedXp={calculateAdjustedXp}
                      emptyMessage="No completed habits yet today. Complete some habits to see them here!"
                      showDetails={true}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <QuestCalendarView 
            completedQuests={completedQuests}
            allHistoricalQuests={questHistory.byDate}
            completionStatus={questHistory.completionStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestSystem;
