
import { useState } from 'react';
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
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-indigo">Schedule Details</h3>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1" />
                <span className="text-indigo/70">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-coral mr-1" />
                <span className="text-indigo/70">Upcoming</span>
              </div>
            </div>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 mt-2">
            {wakeUpPlan.intervals.map((interval, idx) => (
              <div 
                key={`${interval.date}-${idx}`}
                className={`p-3 rounded-lg border flex justify-between items-center
                  ${interval.completed 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-white border-lilac/20'}`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-3 h-3 rounded-full 
                      ${interval.completed ? 'bg-emerald-400' : 'bg-coral'}`}
                  />
                  <span className="font-medium">{interval.wakeTime}</span>
                </div>
                <span className="text-sm text-indigo/70">
                  {new Date(interval.date).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ScheduleCalendar;
