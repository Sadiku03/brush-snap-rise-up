
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Star, RefreshCw } from "lucide-react";
import { useUserStore, Quest } from '@/store/userStore';
import { generateDailyQuests } from '@/utils/questManager';
import { useToast } from '@/components/ui/use-toast';

const QuestSystem = () => {
  const { 
    availableQuests, 
    completedQuests, 
    completeQuest, 
    progress 
  } = useUserStore();
  const { toast } = useToast();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const handleCompleteQuest = (quest: Quest) => {
    completeQuest(quest.id);
    
    toast({
      title: "Quest Completed!",
      description: `You earned ${quest.xpReward} XP for completing "${quest.title}"`,
      duration: 3000,
    });
  };
  
  const handleRefreshQuests = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Coming Soon",
        description: "Quest refreshing will be available in a future update.",
        duration: 3000,
      });
    }, 1000);
  };
  
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
          </div>
          
          <div className="flex items-center gap-1 bg-lilac/20 px-3 py-1 rounded-full">
            <Star className="h-4 w-4 text-coral" />
            <span className="font-medium text-indigo">
              {progress.streak} day streak
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          {availableQuests.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-indigo/70 mb-2">
                You've completed all quests for today!
              </p>
              <p className="text-sm text-indigo/60">
                New quests will be available tomorrow
              </p>
            </div>
          ) : (
            availableQuests.map((quest) => (
              <div key={quest.id} className="quest-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-indigo">{quest.title}</h3>
                    <p className="text-indigo/70 text-sm">{quest.description}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-coral/10 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 text-coral" />
                    <span className="text-sm font-medium text-coral">{quest.xpReward} XP</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={() => handleCompleteQuest(quest)}
                    className="bg-skyblue hover:bg-skyblue/80 text-indigo"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {completedQuests.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-indigo mb-3">Completed Quests</p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {completedQuests.slice(0, 5).map((quest) => (
                <div 
                  key={quest.id} 
                  className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-indigo/80">{quest.title}</span>
                  </div>
                  <div className="text-sm text-indigo/60">+{quest.xpReward} XP</div>
                </div>
              ))}
              
              {completedQuests.length > 5 && (
                <p className="text-sm text-center text-indigo/60 mt-2">
                  +{completedQuests.length - 5} more completed quests
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestSystem;
