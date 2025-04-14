import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useUserStore } from '@/store/userStore';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  plannedWakeUp: number;
  actualWakeUp: number | null;
  originalDate: string;
  completed: boolean;
  plannedWakeUpFormatted: string;
  actualWakeUpFormatted: string;
  isAdjusted?: boolean;
}

const ProgressMap = () => {
  const { wakeUpPlan, brushSnaps } = useUserStore();
  const isMobile = useIsMobile();

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHour}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const format24Hours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getChartData = (): ChartDataPoint[] => {
    if (!wakeUpPlan) return [];

    return wakeUpPlan.intervals.map(interval => {
      const [hours, minutes] = interval.wakeTime.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;

      const verification = brushSnaps.find(snap => snap.date === interval.date);

      let actualWakeUpMinutes = null;
      if (verification) {
        const randomOffset = Math.floor(Math.random() * 30) - 15;
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
        actualWakeUpFormatted: actualWakeUpMinutes ? format24Hours(actualWakeUpMinutes) : 'No check-in',
        isAdjusted: interval.isAdjusted
      };
    });
  };
  
  const chartData = getChartData();
  
  const getYAxisDomain = () => {
    if (!chartData.length) return [360, 540]; // Default range if no data
    
    let minValue = Number.MAX_SAFE_INTEGER;
    let maxValue = Number.MIN_SAFE_INTEGER;
    
    chartData.forEach(point => {
      if (point.plannedWakeUp < minValue) minValue = point.plannedWakeUp;
      if (point.plannedWakeUp > maxValue) maxValue = point.plannedWakeUp;
      
      if (point.actualWakeUp !== null) {
        if (point.actualWakeUp < minValue) minValue = point.actualWakeUp;
        if (point.actualWakeUp > maxValue) maxValue = point.actualWakeUp;
      }
    });
    
    return [Math.max(0, minValue - 30), maxValue + 30];
  };
  
  const yAxisDomain = getYAxisDomain();

  const calculateProgress = () => {
    if (!wakeUpPlan) return 0;
    const totalIntervals = wakeUpPlan.intervals.length;
    const completedIntervals = wakeUpPlan.intervals.filter(i => i.completed).length;
    return totalIntervals > 0 ? Math.round(completedIntervals / totalIntervals * 100) : 0;
  };
  
  const tooltipFormatter = (value: any, name: string, props: any) => {
    if (name === "plannedWakeUp") {
      return [props.payload.plannedWakeUpFormatted, "Target"];
    }
    if (name === "actualWakeUp") {
      return [props.payload.actualWakeUpFormatted || "No check-in", "Actual"];
    }
    return [format24Hours(value), name];
  };
  
  const hasAdjustments = wakeUpPlan?.intervals.some(interval => interval.isAdjusted) || false;
  const adjustmentCount = wakeUpPlan?.adjustmentHistory?.length || 0;
  
  return (
    <div className="w-full space-y-6 py-4">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold text-indigo">Your Sleep Journey</h3>
      </div>
      
      <div className="max-h-[650px]">
        {wakeUpPlan ? (
          <div className="space-y-5">
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
              
              {hasAdjustments && (
                <div className="flex items-center gap-1.5 bg-skyblue/10 p-1.5 px-2 rounded-md text-xs text-indigo/70">
                  <AlertTriangle className="h-3 w-3 text-coral" />
                  <span>Plan adjusted {adjustmentCount} {adjustmentCount === 1 ? 'time' : 'times'}</span>
                </div>
              )}
              
              <div className="text-xs font-medium text-indigo my-px">
                {wakeUpPlan?.intervals[0]?.wakeTime || 'No target set'}
              </div>
            </div>
            
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 5,
                    bottom: 20
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
                    domain={yAxisDomain}
                    tickFormatter={formatMinutes} 
                    tick={{
                      fontSize: isMobile ? 10 : 12,
                      fill: '#2D3142'
                    }} 
                    tickMargin={8} 
                    width={isMobile ? 45 : 55}
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
                    strokeDasharray={(d) => d.isAdjusted ? "5 5" : "0"}
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
            
            <div className="pt-2 space-y-3">
              <h3 className="font-semibold text-indigo text-sm">Wake-Up Milestones</h3>
              <ScrollArea className="h-[180px] pr-1">
                <div className="space-y-2">
                  {wakeUpPlan.intervals.map((interval, index) => {
                    const brushSnap = brushSnaps.find(snap => snap.date === interval.date);
                    return (
                      <div 
                        key={index} 
                        className={`p-2 rounded-lg border flex justify-between items-center
                          ${interval.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-lilac/20'}
                          ${interval.isAdjusted ? 'border-l-2 border-l-coral' : ''}`}
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
                              <span>Planned: {interval.wakeTime} {interval.isAdjusted && <span className="text-coral text-[10px]">(adjusted)</span>}</span>
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
              </ScrollArea>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-indigo/70 mb-3 text-sm">
              Create a wake-up plan to see your progress journey.
            </p>
            <Button variant="outline" size="sm" className="border-lilac/30 text-indigo">
              Set Up Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressMap;
