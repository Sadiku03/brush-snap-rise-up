
import { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Quest } from '@/store/userStore';
import { useUserStore } from '@/store/userStore';
import { cn } from "@/lib/utils";
import QuestItem from './QuestItem';

interface QuestCalendarViewProps {
  completedQuests: Quest[];
  allHistoricalQuests?: Record<string, { completed: Quest[], uncompleted: Quest[] }>;
}

const QuestCalendarView = ({ 
  completedQuests, 
  allHistoricalQuests = {} 
}: QuestCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { progress } = useUserStore();
  
  // Format the selected date as YYYY-MM-DD for lookup
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  
  // Get quests for the selected date
  const selectedDayQuests = selectedDateStr ? (allHistoricalQuests[selectedDateStr] || { 
    completed: [], 
    uncompleted: [] 
  }) : { completed: [], uncompleted: [] };
  
  // Get unique dates from the completed quests for calendar highlighting
  const completedDates = completedQuests.reduce<Record<string, boolean>>((acc, quest) => {
    const dateStr = new Date(quest.dateAssigned).toISOString().split('T')[0];
    acc[dateStr] = true;
    return acc;
  }, {});
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-indigo/60 uppercase tracking-wider">Quest History</h3>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-fit justify-start text-left font-normal bg-white/80 text-indigo/80 border-lilac/20"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("p-3 pointer-events-auto")}
              modifiers={{
                completed: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return !!completedDates[dateStr];
                }
              }}
              modifiersClassNames={{
                completed: "bg-skyblue/20 font-semibold text-indigo rounded-md"
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {selectedDate && (
        <Card className="border border-lilac/20 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-indigo">
                {format(selectedDate, "MMMM d, yyyy")}
              </h3>
              
              {/* Show streak status for this day if available */}
              {selectedDateStr === format(new Date(), 'yyyy-MM-dd') && (
                <div className="bg-lilac/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-indigo/80">
                    Current streak: {progress.streak} days
                  </span>
                </div>
              )}
            </div>
            
            {/* If no quests for this day */}
            {selectedDayQuests.completed.length === 0 && selectedDayQuests.uncompleted.length === 0 && (
              <div className="text-center py-6 text-indigo/60">
                <p>No quest data available for this day</p>
              </div>
            )}
            
            {/* Completed quests for this day */}
            {selectedDayQuests.completed.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-sm font-medium text-indigo/80">Completed</h4>
                </div>
                <div className="space-y-2">
                  {selectedDayQuests.completed.map(quest => (
                    <QuestItem 
                      key={quest.id}
                      quest={quest}
                      isCompleted={true}
                      streakMultiplier="1.0"
                      showDetails={true}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Uncompleted quests for this day */}
            {selectedDayQuests.uncompleted.length > 0 && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <XCircle className="h-4 w-4 text-coral/70" />
                  <h4 className="text-sm font-medium text-indigo/80">Not completed</h4>
                </div>
                <div className="space-y-2">
                  {selectedDayQuests.uncompleted.map(quest => (
                    <QuestItem 
                      key={quest.id}
                      quest={quest}
                      isCompleted={false}
                      streakMultiplier="1.0"
                      showDetails={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestCalendarView;
