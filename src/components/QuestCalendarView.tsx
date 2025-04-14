
import { useState } from 'react';
import { format, addMonths, subMonths } from "date-fns";
import { CalendarIcon, CheckCircle, XCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Quest } from '@/store/userStore';
import { useUserStore } from '@/store/userStore';
import { cn } from "@/lib/utils";
import QuestItem from './QuestItem';

interface QuestCalendarViewProps {
  completedQuests: Quest[];
  allHistoricalQuests?: Record<string, { completed: Quest[], uncompleted: Quest[] }>;
  completionStatus?: Record<string, 'full' | 'partial' | 'none'>;
}

const QuestCalendarView = ({ 
  completedQuests, 
  allHistoricalQuests = {},
  completionStatus = {}
}: QuestCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const { progress } = useUserStore();
  
  // New state for collapsible sections
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const [completedExpanded, setCompletedExpanded] = useState(true);
  const [uncompletedExpanded, setUncompletedExpanded] = useState(true);
  
  // Format the selected date as YYYY-MM-DD for lookup
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  
  // Get quests for the selected date
  const selectedDayQuests = selectedDateStr ? (allHistoricalQuests[selectedDateStr] || { 
    completed: [], 
    uncompleted: [] 
  }) : { completed: [], uncompleted: [] };

  // Navigation functions for switching months
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  // Custom day rendering for the calendar
  const renderDay = (day: Date, modifiers: any) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const status = completionStatus[dateStr] || 'none';
    
    let backgroundColor;
    let textColor = 'text-indigo';
    
    switch (status) {
      case 'full':
        backgroundColor = 'bg-green-100';
        break;
      case 'partial':
        backgroundColor = 'bg-amber-100';
        break;
      default:
        backgroundColor = 'bg-white';
    }
    
    return (
      <div className={`flex items-center justify-center h-9 w-9 rounded-md ${backgroundColor} ${textColor}`}>
        {format(day, 'd')}
      </div>
    );
  };

  // Determine the background color for a day based on completion status
  const getDayClass = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const status = completionStatus[dateStr];
    
    switch (status) {
      case 'full':
        return 'bg-green-100 text-green-800 font-medium';
      case 'partial':
        return 'bg-amber-100 text-amber-800 font-medium';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      <Collapsible
        open={historyExpanded}
        onOpenChange={setHistoryExpanded}
        className="border border-lilac/20 rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-3 bg-skyblue/10 border-b border-lilac/20">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-indigo/70" />
            <h3 className="text-sm font-semibold text-indigo/80 uppercase tracking-wider">
              Quest History
            </h3>
          </div>
          <CollapsibleTrigger>
            {historyExpanded ? (
              <ChevronUp className="h-4 w-4 text-indigo/70" />
            ) : (
              <ChevronDown className="h-4 w-4 text-indigo/70" />
            )}
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="flex flex-col space-y-2 p-4">
            <Card className="border border-lilac/20 shadow-sm">
              <CardContent className="p-4">
                {/* Calendar header with month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={goToPreviousMonth}
                    className="text-indigo/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <h3 className="text-lg font-medium text-indigo">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h3>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={goToNextMonth}
                    className="text-indigo/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Full month calendar */}
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className={cn("p-0")}
                  modifiers={{
                    completed: (date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      return completionStatus[dateStr] === 'full';
                    },
                    partial: (date) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      return completionStatus[dateStr] === 'partial';
                    },
                  }}
                  modifiersClassNames={{
                    completed: "bg-green-100 font-medium text-green-800 rounded-md",
                    partial: "bg-amber-100 font-medium text-amber-800 rounded-md",
                  }}
                />
              </CardContent>
            </Card>
            
            {/* Legend for the calendar */}
            <div className="flex items-center justify-center space-x-4 text-sm text-indigo/70">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
                <span>All completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-100 mr-1"></div>
                <span>Partially completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-white border border-indigo/10 mr-1"></div>
                <span>None completed</span>
              </div>
            </div>
          
            {/* Selected day details */}
            {selectedDate && (
              <Card className="border border-lilac/20 shadow-sm mt-4">
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
                  
                  <Separator className="my-3 bg-lilac/10" />
                  
                  {/* If no quests for this day */}
                  {selectedDayQuests.completed.length === 0 && selectedDayQuests.uncompleted.length === 0 && (
                    <div className="text-center py-6 text-indigo/60">
                      <p>No quest data available for this day</p>
                    </div>
                  )}
                  
                  {/* Completed quests for this day */}
                  {selectedDayQuests.completed.length > 0 && (
                    <Collapsible
                      open={completedExpanded}
                      onOpenChange={setCompletedExpanded}
                      className="mb-4 border border-emerald-100 rounded-lg overflow-hidden"
                    >
                      <div className="bg-emerald-50 p-3">
                        <CollapsibleTrigger className="flex items-center gap-1 w-full justify-between">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <h4 className="text-sm font-medium text-indigo/80">Completed</h4>
                          </div>
                          {completedExpanded ? (
                            <ChevronUp className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-emerald-500" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="p-3 bg-white">
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
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                  
                  {/* Uncompleted quests for this day */}
                  {selectedDayQuests.uncompleted.length > 0 && (
                    <Collapsible
                      open={uncompletedExpanded}
                      onOpenChange={setUncompletedExpanded}
                      className="border border-coral/20 rounded-lg overflow-hidden"
                    >
                      <div className="bg-coral/10 p-3">
                        <CollapsibleTrigger className="flex items-center gap-1 w-full justify-between">
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-coral/70" />
                            <h4 className="text-sm font-medium text-indigo/80">Not completed</h4>
                          </div>
                          {uncompletedExpanded ? (
                            <ChevronUp className="h-4 w-4 text-coral/70" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-coral/70" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="p-3 bg-white">
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
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default QuestCalendarView;
