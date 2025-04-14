
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

export default ScheduleCalendar;
