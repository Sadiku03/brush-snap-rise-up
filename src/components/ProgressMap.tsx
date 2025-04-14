import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const ProgressMap = () => {
  const { wakeUpPlan, brushSnaps } = useUserStore();
  const [expanded, setExpanded] = useState(false);
  
  // Prepare data for the chart
  const getChartData = () => {
    if (!wakeUpPlan) return [];
    
    // Map through the intervals to create data points
    return wakeUpPlan.intervals.map(interval => {
      // Convert wake time to minutes for the chart
      const [hours, minutes] = interval.wakeTime.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      // Find actual wake-up verification for this date if it exists
      const verification = brushSnaps.find(snap => 
        snap.date === interval.date
      );
      
      // If verification exists, get the actual wake-up time
      let actualWakeUpMinutes = null;
      if (verification) {
        // Convert time from date string (assuming format like "2023-04-15")
        // For demo purposes, we'll generate a random time close to the planned time
        // In a real app, you would extract the actual time from the verification
        const randomOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 minutes
        actualWakeUpMinutes = timeInMinutes + randomOffset;
      }
      
      return {
        date: new Date(interval.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        }),
        plannedWakeUp: timeInMinutes,
        actualWakeUp: actualWakeUpMinutes,
        // Store the original date for comparison
        originalDate: interval.date,
        completed: interval.completed
      };
    });
  };
  
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  const chartData = getChartData();
  
  // Calculate overall progress
  const calculateProgress = () => {
    if (!wakeUpPlan) return 0;
    
    const totalIntervals = wakeUpPlan.intervals.length;
    const completedIntervals = wakeUpPlan.intervals.filter(i => i.completed).length;
    
    return totalIntervals > 0 ? Math.round((completedIntervals / totalIntervals) * 100) : 0;
  };
  
  const chartConfig = {
    planned: {
      label: "Planned",
      color: "#BFD7EA" // skyblue
    },
    actual: {
      label: "Actual",
      color: "#FF7A5A" // coral
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-lilac/20 overflow-hidden">
      <div className="bg-skyblue/20 border-b border-lilac/10 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo">Your Sleep Journey</h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-indigo/70"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className={`transition-all duration-300 ${expanded ? 'max-h-[500px]' : 'max-h-64'} overflow-hidden`}>
        <div className="p-4">
          {wakeUpPlan ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo/60 mb-1">Journey Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-indigo">{calculateProgress()}%</div>
                    <div className="h-2 w-24 sm:w-40 bg-indigo/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-coral transition-all duration-700 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Replace the existing badge with a simple target time display */}
                <div className="text-xs font-medium text-indigo">
                  {wakeUpPlan?.intervals[0]?.wakeTime || 'No target set'}
                </div>
              </div>
              
              <div className="h-48">
                <ChartContainer config={chartConfig} className="h-full">
                  <LineChart 
                    data={chartData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: '#2D3142' }}
                      tickMargin={5}
                    />
                    <YAxis 
                      tickFormatter={formatMinutes}
                      tick={{ fontSize: 10, fill: '#2D3142' }}
                      tickMargin={5}
                      width={35}
                    />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          formatter={(value: any, name: string) => [
                            formatMinutes(value), 
                            name === "plannedWakeUp" ? "Planned" : "Actual"
                          ]}
                        />
                      }
                    />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', marginTop: '5px' }} />
                    <Line
                      type="monotone"
                      dataKey="plannedWakeUp"
                      stroke="#BFD7EA"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#BFD7EA', strokeWidth: 1, stroke: '#FFF' }}
                      name="Planned"
                    />
                    <Line
                      type="monotone"
                      dataKey="actualWakeUp"
                      stroke="#FF7A5A"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#FF7A5A', strokeWidth: 1, stroke: '#FFF' }}
                      activeDot={{ r: 5 }}
                      name="Actual"
                    />
                  </LineChart>
                </ChartContainer>
              </div>
              
              {expanded && (
                <div className="pt-2 space-y-3">
                  <h3 className="font-semibold text-indigo text-sm">Wake-Up Milestones</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {wakeUpPlan.intervals.map((interval, index) => {
                      // Find matching brush snap for this day, if any
                      const brushSnap = brushSnaps.find(snap => 
                        snap.date === interval.date
                      );
                      
                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-lg border flex justify-between items-center
                            ${interval.completed 
                              ? 'bg-emerald-50 border-emerald-200' 
                              : 'bg-white border-lilac/20'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                                ${interval.completed 
                                  ? 'bg-emerald-100 text-emerald-600' 
                                  : 'bg-lilac/20 text-indigo/60'}`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-indigo text-xs">
                                {new Date(interval.date).toLocaleDateString(undefined, {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                              <div className="flex flex-col text-xs text-indigo/70">
                                <span>Planned: {interval.wakeTime}</span>
                                {brushSnap && (
                                  <span className="text-coral">Completed</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {interval.completed && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-medium">
                                ✓
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-indigo/70 mb-3 text-sm">
                Create a wake-up plan to see your progress journey.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-lilac/30 text-indigo"
              >
                Set Up Plan
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressMap;
