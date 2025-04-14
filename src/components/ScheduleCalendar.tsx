import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { WakeUpPlan } from "@/store/userStore";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleCalendarProps {
  wakeUpPlan: WakeUpPlan | null;
}

const ScheduleCalendar = ({ wakeUpPlan }: ScheduleCalendarProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  if (!wakeUpPlan) return null;
  
  // Parse dates from the wake-up plan
  const dates = wakeUpPlan.intervals.map(interval => {
    const date = new Date(interval.date);
    return {
      date,
      wakeTime: interval.wakeTime,
      completed: interval.completed
    };
  });
  
  // Get unique dates for the calendar
  const uniqueDates = [...new Set(dates.map(d => d.date.toISOString().split('T')[0]))];
  
  // Create a map of dates to wake times for easy lookup
  const dateToWakeTimeMap = new Map();
  dates.forEach(({ date, wakeTime, completed }) => {
    const dateStr = date.toISOString().split('T')[0];
    dateToWakeTimeMap.set(dateStr, { wakeTime, completed });
  });
  
  // Group intervals by wake time to create blocks
  const wakeTimeBlocks = groupIntervalsByWakeTime(wakeUpPlan.intervals);
  
  // Custom day rendering to show wake time below date
  const renderDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const wakeInfo = dateToWakeTimeMap.get(dateStr);
    
    if (!wakeInfo) return null;
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className="sr-only">{day.toDateString()}</span>
        <span className="text-base font-medium">{day.getDate()}</span>
        <span className={`text-xs font-medium mt-0.5 ${wakeInfo.completed ? "text-emerald-500" : "text-coral"}`}>
          {wakeInfo.wakeTime}
        </span>
        
        {wakeInfo.completed && (
          <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        )}
      </div>
    );
  };

  const handleViewSchedule = () => {
    navigate('/app/progress');
    setOpen(false);
  };
  
  // Format date range as "Apr 13 - Apr 15"
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If dates are in same month, show "Apr 13 - 15"
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString(undefined, { month: 'short' })} ${start.getDate()} - ${end.getDate()}`;
    }
    
    // Otherwise show "Apr 13 - May 2"
    return `${start.toLocaleDateString(undefined, { month: 'short' })} ${start.getDate()} - ${end.toLocaleDateString(undefined, { month: 'short' })} ${end.getDate()}`;
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex gap-2 px-4 py-2 rounded-full border-indigo/30 bg-skyblue/10 hover:bg-skyblue/20 hover:text-indigo"
        >
          <CalendarIcon className="h-5 w-5 text-indigo/70" />
          <span className="text-sm font-medium text-indigo">View Schedule</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-center text-indigo">Wake-Up Schedule</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 p-2 bg-skyblue/5 rounded-lg shadow-inner">
          <Calendar
            mode="multiple"
            selected={dates.map(d => d.date)}
            className="w-full rounded-md bg-white p-3 border border-lilac/10"
            components={{
              Day: ({ date }) => (
                <div className="w-9 h-9 p-0 flex items-center justify-center rounded-md hover:bg-skyblue/10">
                  {renderDay(date)}
                </div>
              ),
            }}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
            <p className="text-sm font-medium text-indigo mb-1">Wake-Up Blocks</p>
            {wakeTimeBlocks.map((block, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border flex justify-between items-center bg-white border-lilac/20
                  ${block.hasCompleted ? 'border-l-2 border-l-emerald-400' : ''}
                  ${block.hasAdjusted ? 'border-r-2 border-r-coral' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center 
                    ${block.hasCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-skyblue/10 text-indigo'}`}>
                    <span className="text-lg font-semibold">{block.wakeTime}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo">
                      {formatDateRange(block.startDate, block.endDate)}
                    </p>
                    <p className="text-xs text-indigo/70">
                      {block.daysCount} {block.daysCount === 1 ? 'day' : 'days'}
                      {block.hasAdjusted && <span className="text-coral ml-2">(adjusted)</span>}
                    </p>
                  </div>
                </div>
                
                {block.allCompleted && (
                  <div className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full">
                    Completed
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleViewSchedule} 
            className="w-full"
          >
            Go to Full Schedule
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Helper function to group intervals by wake time into blocks
function groupIntervalsByWakeTime(intervals: WakeUpPlan['intervals']) {
  // Sort intervals by date first
  const sortedIntervals = [...intervals].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const blocks: {
    wakeTime: string;
    startDate: string;
    endDate: string;
    daysCount: number;
    hasCompleted: boolean;
    allCompleted: boolean;
    hasAdjusted: boolean;
  }[] = [];
  
  let currentBlock: {
    wakeTime: string;
    startDate: string;
    endDate: string;
    intervalIndices: number[];
    hasCompleted: boolean;
    allCompleted: boolean;
    hasAdjusted: boolean;
  } | null = null;
  
  sortedIntervals.forEach((interval, index) => {
    if (!currentBlock || currentBlock.wakeTime !== interval.wakeTime) {
      // If we have a current block, add it to blocks
      if (currentBlock) {
        blocks.push({
          ...currentBlock,
          daysCount: currentBlock.intervalIndices.length,
        });
      }
      
      // Start a new block
      currentBlock = {
        wakeTime: interval.wakeTime,
        startDate: interval.date,
        endDate: interval.date,
        intervalIndices: [index],
        hasCompleted: interval.completed,
        allCompleted: interval.completed,
        hasAdjusted: !!interval.isAdjusted
      };
    } else {
      // Continue the current block
      currentBlock.endDate = interval.date;
      currentBlock.intervalIndices.push(index);
      currentBlock.hasCompleted = currentBlock.hasCompleted || interval.completed;
      currentBlock.allCompleted = currentBlock.allCompleted && interval.completed;
      currentBlock.hasAdjusted = currentBlock.hasAdjusted || !!interval.isAdjusted;
    }
  });
  
  // Add the last block if it exists
  if (currentBlock) {
    blocks.push({
      ...currentBlock,
      daysCount: currentBlock.intervalIndices.length,
    });
  }
  
  return blocks;
}

export default ScheduleCalendar;
