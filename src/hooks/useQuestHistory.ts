
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Quest } from '@/store/userStore';

interface QuestHistoryData {
  byDate: Record<string, { completed: Quest[], uncompleted: Quest[] }>;
  completedDates: string[];
}

export function useQuestHistory(availableQuests: Quest[], completedQuests: Quest[]): QuestHistoryData {
  const questHistoryByDate = useMemo(() => {
    // Combine all quests (available and completed)
    const allQuests = [...availableQuests, ...completedQuests];
    
    // Group quests by date
    const byDate: Record<string, { completed: Quest[], uncompleted: Quest[] }> = {};
    const dateSet = new Set<string>();
    
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
    
    // Convert the set to an array for completedDates
    return {
      byDate,
      completedDates: Array.from(dateSet)
    };
  }, [availableQuests, completedQuests]);

  return {
    byDate: questHistoryByDate.byDate,
    completedDates: questHistoryByDate.completedDates
  };
}
