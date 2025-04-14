
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Quest } from '@/store/userStore';

interface QuestHistoryData {
  byDate: Record<string, { completed: Quest[], uncompleted: Quest[] }>;
  completedDates: string[];
  completionStatus: Record<string, 'full' | 'partial' | 'none'>;
}

export function useQuestHistory(availableQuests: Quest[], completedQuests: Quest[]): QuestHistoryData {
  const questHistoryByDate = useMemo(() => {
    // Combine all quests (available and completed)
    const allQuests = [...availableQuests, ...completedQuests];
    
    // Group quests by date
    const byDate: Record<string, { completed: Quest[], uncompleted: Quest[] }> = {};
    const dateSet = new Set<string>();
    const completionStatus: Record<string, 'full' | 'partial' | 'none'> = {};
    
    // Process completed quests first
    completedQuests.forEach(quest => {
      const dateStr = new Date(quest.dateAssigned).toISOString().split('T')[0];
      dateSet.add(dateStr);
      
      if (!byDate[dateStr]) {
        byDate[dateStr] = { completed: [], uncompleted: [] };
      }
      
      byDate[dateStr].completed.push(quest);
    });
    
    // Then process all quests to find uncompleted ones
    allQuests.forEach(quest => {
      const dateStr = new Date(quest.dateAssigned).toISOString().split('T')[0];
      dateSet.add(dateStr);
      
      if (!byDate[dateStr]) {
        byDate[dateStr] = { completed: [], uncompleted: [] };
      }
      
      // If this quest is not in the completed list for this date, add it to uncompleted
      if (!quest.completed && !byDate[dateStr].completed.some(q => q.id === quest.id)) {
        byDate[dateStr].uncompleted.push(quest);
      }
    });
    
    // Calculate completion status for each date
    Object.keys(byDate).forEach(dateStr => {
      const { completed, uncompleted } = byDate[dateStr];
      const totalQuests = completed.length + uncompleted.length;
      
      if (totalQuests === 0) {
        completionStatus[dateStr] = 'none';
      } else if (uncompleted.length === 0) {
        completionStatus[dateStr] = 'full';
      } else {
        completionStatus[dateStr] = 'partial';
      }
    });
    
    // Convert the set to an array for completedDates
    return {
      byDate,
      completedDates: Array.from(dateSet),
      completionStatus
    };
  }, [availableQuests, completedQuests]);

  return {
    byDate: questHistoryByDate.byDate,
    completedDates: questHistoryByDate.completedDates,
    completionStatus: questHistoryByDate.completionStatus
  };
}
