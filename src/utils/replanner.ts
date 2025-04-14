
import { DailyCheckIn } from './checkInTracker';
import { WakeUpPlan, recalculateWakePlan } from '../utils/planCalculator';

/**
 * Determines if the wake-up plan should be automatically recalculated
 * based on recent check-in history
 */
export function shouldAutoReplan(checkIns: DailyCheckIn[]): boolean {
  if (checkIns.length < 3) return false;
  
  // Get the most recent 3 check-ins
  const recent = checkIns.slice(-3);
  
  // Count missed check-ins (no actual wake time)
  const missed = recent.filter(d => d.actualWakeMinutes === undefined).length;
  
  // Count significant deviations (more than 30 minutes)
  const offTarget = recent.filter(d => (d.deviationMinutes ?? 0) > 30).length;
  
  // Trigger auto-replan if 2+ missed or off-target check-ins
  return missed >= 2 || offTarget >= 2;
}

/**
 * Automatically recalculates the wake-up plan when disruptions are detected
 */
export function autoReplanWakeUpSchedule(
  plan: WakeUpPlan,
  checkInHistory: DailyCheckIn[]
): WakeUpPlan | null {
  if (!plan || checkInHistory.length === 0) return null;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find the most recent actual wake-up time
  const latestCheckIn = [...checkInHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find(d => d.actualWakeMinutes !== undefined);
  
  if (!latestCheckIn) return null;
  
  // Use the latest actual wake-up time as the new starting point
  const latestWakeTimeMinutes = latestCheckIn.actualWakeMinutes!;
  const latestWakeTime = convertMinutesToTimeString(latestWakeTimeMinutes);
  
  // Recalculate the plan from today using the latest wake time
  return recalculateWakePlan({
    currentDate: today,
    latestWakeTime,
    targetWakeTime: plan.targetWakeTime,
    targetDate: plan.targetDate,
    originalPlan: plan
  });
}

/**
 * Helper function to convert minutes to "HH:MM" format
 */
function convertMinutesToTimeString(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}
