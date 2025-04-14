import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Award, Star, RefreshCw, Info, ChevronDown, ChevronRight } from "lucide-react";
import { useUserStore } from '@/store/userStore';
import { 
  generateDailyQuests, 
  shouldRefreshQuests,
  getXpUntilNextLevel 
} from '@/utils/questManager';
import { useToast } from '@/components/ui/use-toast';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuestList from './QuestList';
import QuestCalendarView from './QuestCalendarView';
import { useQuestHistory } from '@/hooks/useQuestHistory';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Add state for collapsible sections
  const [availableExpanded, setAvailableExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);
  
  const questHistory = useQuestHistory(availableQuests, completedQuests);
  
  const streakMultiplier = (1 + (progress.streak * 0.1)).toFixed(1);
  
  const xpRemaining = getXpUntilNextLevel(progress.level, progress.xp);
  
  const weeklyStreakProgress = Math.min(progress.streak / 7, 1) * 100;
  
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
          <h2 className="text-xl font-bold text-indigo">Daily Quests</h2>
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
      
      <div className="p-5">
        {questsRefreshed && (
          <div className="bg-skyblue/20 text-indigo rounded-lg p-3 mb-4 flex items-center">
            <Info className="h-4 w-4 mr-2 text-indigo" />
            <p className="text-sm">New quests have been generated for today!</p>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-indigo/60 mb-1">Your Progress</p>
            <div className="flex items-center gap-2">
              <div className="font-bold text-lg text-indigo">Level {progress.level}</div>
              <div className="h-2 w-24 bg-indigo/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-coral rounded-full transition-all duration-700"
                  style={{ width: `${(progress.xp / (progress.level * 100)) * 100}%` }}
                />
              </div>
              <div className="text-sm text-indigo/60">{progress.xp}/{progress.level * 100} XP</div>
            </div>
            <p className="text-xs text-indigo/60 mt-1">{xpRemaining} XP until Level {progress.level + 1}</p>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 bg-lilac/20 px-3 py-1 rounded-full">
              <Star className="h-4 w-4 text-coral" />
              <span className="font-medium text-indigo">
                {progress.streak} day streak
              </span>
            </div>
            
            <div className="w-24 bg-indigo/10 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-lilac transition-all duration-500"
                style={{ width: `${weeklyStreakProgress}%` }}
              />
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-xs text-indigo/70 cursor-help">
                    <Info className="h-3 w-3" />
                    <span>Streak multiplier: {streakMultiplier}x</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Each day in your streak gives a 10% XP bonus!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Available Quests Section with Collapsible */}
          <Collapsible
            open={availableExpanded}
            onOpenChange={setAvailableExpanded}
            className="border border-amber-100 rounded-lg overflow-hidden"
          >
            <div className="bg-amber-50 p-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider">
                  Available Quests
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
                emptyMessage="You've completed all quests for today! New quests will be available tomorrow."
                showDetails={false}
              />
            </CollapsibleContent>
          </Collapsible>
          
          {/* Completed Quests Section with Collapsible */}
          {completedQuests.length > 0 && (
            <Collapsible
              open={completedExpanded}
              onOpenChange={setCompletedExpanded}
              className="border border-emerald-100 rounded-lg overflow-hidden"
            >
              <div className="bg-emerald-50 p-3">
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">
                    Completed Quests
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
                  quests={completedQuests}
                  isCompleted={true}
                  streakMultiplier={streakMultiplier}
                  calculateAdjustedXp={calculateAdjustedXp}
                  emptyMessage="No completed quests yet. Complete some quests to see them here!"
                  showDetails={true}
                />
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestSystem;
