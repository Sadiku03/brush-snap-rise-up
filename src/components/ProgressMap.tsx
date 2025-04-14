
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";

const ProgressMap = () => {
  const { wakeUpPlan, brushSnaps } = useUserStore();
  const [expanded, setExpanded] = useState(false);
  
  // Prepare data for the chart
  const getChartData = () => {
    if (!wakeUpPlan) return [];
    
    return wakeUpPlan.intervals.map(interval => {
      // Convert wake time to minutes for the chart
      const [hours, minutes] = interval.wakeTime.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      // Check if this interval was completed
      const completed = interval.completed;
      
      return {
        date: new Date(interval.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric'
        }),
        plannedWakeUp: timeInMinutes,
        actualWakeUp: completed ? timeInMinutes : null,
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
      
      <div className={`transition-all duration-300 ${expanded ? 'max-h-[600px]' : 'max-h-80'} overflow-hidden`}>
        <div className="p-5">
          {wakeUpPlan ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-indigo/60 mb-1">Journey Progress</p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-indigo">{calculateProgress()}%</div>
                    <div className="h-2 w-40 bg-indigo/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-coral transition-all duration-700 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-lilac/20 px-3 py-1.5 rounded-full">
                  <Calendar className="h-4 w-4 text-coral" />
                  <span className="text-sm font-medium text-indigo">
                    {brushSnaps.length} verifications
                  </span>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: '#2D3142' }}
                      tickMargin={10}
                    />
                    <YAxis 
                      tickFormatter={formatMinutes}
                      tick={{ fontSize: 12, fill: '#2D3142' }}
                      tickMargin={10}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatMinutes(value), 'Wake-Up Time']}
                      labelStyle={{ color: '#2D3142' }}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #D8CFF9',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="plannedWakeUp"
                      stroke="#BFD7EA"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#BFD7EA', strokeWidth: 1, stroke: '#FFF' }}
                      name="Planned"
                    />
                    <Line
                      type="monotone"
                      dataKey="actualWakeUp"
                      stroke="#FF7A5A"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#FF7A5A', strokeWidth: 1, stroke: '#FFF' }}
                      activeDot={{ r: 6 }}
                      name="Actual"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {expanded && (
                <div className="pt-4 space-y-4">
                  <h3 className="font-semibold text-indigo">Wake-Up Milestones</h3>
                  <div className="space-y-2">
                    {wakeUpPlan.intervals.map((interval, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border flex justify-between items-center
                          ${interval.completed 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-white border-lilac/20'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${interval.completed 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-lilac/20 text-indigo/60'}`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-indigo">
                              {new Date(interval.date).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-indigo/70">
                              Wake-up time: {interval.wakeTime}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {interval.completed && (
                            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full font-medium">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-indigo/70 mb-4">
                Create a wake-up plan to see your progress journey.
              </p>
              <Button
                variant="outline"
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
