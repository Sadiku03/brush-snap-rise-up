
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useUserStore } from '@/store/userStore';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from '@/hooks/use-mobile';

// Define our data structure for type safety
interface ChartDataPoint {
  date: string;
  plannedWakeUp: number;
  actualWakeUp: number | null;
  originalDate: string;
  completed: boolean;
  plannedWakeUpFormatted: string;
  actualWakeUpFormatted: string;
}

const ProgressMap = () => {
  const { wakeUpPlan, brushSnaps } = useUserStore();
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Format minutes since midnight to readable time (e.g., "6:30 AM")
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHour}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  // Format for 24-hour time display
  const format24Hours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Prepare data for the chart
  const getChartData = (): ChartDataPoint[] => {
    if (!wakeUpPlan) return [];

    // Map through the intervals to create data points
    return wakeUpPlan.intervals.map(interval => {
      // Convert wake time to minutes for the chart
      const [hours, minutes] = interval.wakeTime.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Find actual wake-up verification for this date if it exists
      const verification = brushSnaps.find(snap => snap.date === interval.date);

      // If verification exists, get the actual wake-up time
      let actualWakeUpMinutes = null;
      if (verification) {
        // For demo purposes, we'll generate a random time close to the planned time
        // In a real app, you would extract the actual time from the verification
        const randomOffset = Math.floor(Math.random() * 30) - 15; // -15 to +15 minutes
        actualWakeUpMinutes = timeInMinutes + randomOffset;
      }
      
      return {
        date: new Date(interval.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          weekday: 'short'
        }).replace(',', ''),
        plannedWakeUp: timeInMinutes,
        actualWakeUp: actualWakeUpMinutes,
        originalDate: interval.date,
        completed: interval.completed,
        plannedWakeUpFormatted: format24Hours(timeInMinutes),
        actualWakeUpFormatted: actualWakeUpMinutes ? format24Hours(actualWakeUpMinutes) : 'No check-in'
      };
    });
  };
  
  const chartData = getChartData();

  // Calculate overall progress
  const calculateProgress = () => {
    if (!wakeUpPlan) return 0;
    const totalIntervals = wakeUpPlan.intervals.length;
    const completedIntervals = wakeUpPlan.intervals.filter(i => i.completed).length;
    return totalIntervals > 0 ? Math.round(completedIntervals / totalIntervals * 100) : 0;
  };
  
  // Custom tooltip formatter to display both planned and actual times
  const tooltipFormatter = (value: any, name: string, props: any) => {
    // Instead of showing the minutes value, show the formatted time
    if (name === "plannedWakeUp") {
      return [props.payload.plannedWakeUpFormatted, "Target"];
    }
    if (name === "actualWakeUp") {
      return [props.payload.actualWakeUpFormatted, "Actual"];
    }
    return [format24Hours(value), name];
  };
  
  return (
    <Card className="overflow-hidden border-lilac/20 shadow-md mx-auto w-[95%] sm:w-[90%]">
      <CardHeader className="bg-skyblue/20 border-b border-lilac/10 p-4 flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-xl font-bold text-indigo">Your Sleep Journey</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)} 
          className="text-indigo/70"
        >
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </CardHeader>
      
      <CardContent className={`p-0 transition-all duration-300 ${expanded ? 'max-h-[500px]' : 'max-h-64'} overflow-hidden`}>
        <div className="p-4">
          {wakeUpPlan ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo/60 mb-1">Journey Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-indigo">{calculateProgress()}%</div>
                    <Progress value={calculateProgress()} className="h-2 w-24 sm:w-40 bg-indigo/10 rounded-full">
                      <div className="h-full bg-coral transition-all duration-700 rounded-full" />
                    </Progress>
                  </div>
                </div>
                
                {/* Target time display */}
                <div className="text-xs font-medium text-indigo my-px">
                  {wakeUpPlan?.intervals[0]?.wakeTime || 'No target set'}
                </div>
              </div>
              
              <div className="h-48 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 5,
                      bottom: 10
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis 
                      dataKey="date" 
                      tick={{
                        fontSize: isMobile ? 10 : 12,
                        fill: '#2D3142'
                      }} 
                      tickMargin={8}
                    />
                    <YAxis 
                      tickFormatter={formatMinutes} 
                      tick={{
                        fontSize: isMobile ? 10 : 12,
                        fill: '#2D3142'
                      }} 
                      tickMargin={8} 
                      width={isMobile ? 35 : 45}
                    />
                    <Tooltip
                      formatter={tooltipFormatter}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #D8CFF9',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      iconSize={8} 
                      wrapperStyle={{
                        fontSize: '11px',
                        paddingTop: '10px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="plannedWakeUp" 
                      stroke="#FF7A5A" 
                      strokeWidth={2} 
                      dot={{
                        r: 3,
                        fill: '#FF7A5A',
                        strokeWidth: 1,
                        stroke: '#FFF'
                      }} 
                      name="Target Wake-Up" 
                      activeDot={{ r: 5 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actualWakeUp" 
                      stroke="#C19FF5" 
                      strokeWidth={2} 
                      dot={{
                        r: 3,
                        fill: '#C19FF5',
                        strokeWidth: 1,
                        stroke: '#FFF'
                      }} 
                      activeDot={{
                        r: 5
                      }} 
                      name="Actual Wake-Up" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {expanded && (
                <div className="pt-2 space-y-3">
                  <h3 className="font-semibold text-indigo text-sm">Wake-Up Milestones</h3>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {wakeUpPlan.intervals.map((interval, index) => {
                      // Find matching brush snap for this day, if any
                      const brushSnap = brushSnaps.find(snap => snap.date === interval.date);
                      return (
                        <div 
                          key={index} 
                          className={`p-2 rounded-lg border flex justify-between items-center
                            ${interval.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-lilac/20'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                                ${interval.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-lilac/20 text-indigo/60'}`}>
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
                                {brushSnap && <span className="text-coral">Completed</span>}
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
              <Button variant="outline" size="sm" className="border-lilac/30 text-indigo">
                Set Up Plan
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressMap;
