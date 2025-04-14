
import { WakeUpPlan } from "../store/userStore";

/**
 * Calculates wake up intervals to gradually shift from current to target time
 */
export function calculateWakeUpPlan(
  currentWakeTime: string,
  targetWakeTime: string,
  targetDate: string
): WakeUpPlan {
  // Parse input dates and times
  const targetDateObj = new Date(targetDate);
  
  // Parse times (format: "HH:MM")
  const [currentHours, currentMinutes] = currentWakeTime.split(':').map(Number);
  const [targetHours, targetMinutes] = targetWakeTime.split(':').map(Number);
  
  // Convert wake times to minutes for easier calculation
  const currentWakeMinutes = currentHours * 60 + currentMinutes;
  const targetWakeMinutes = targetHours * 60 + targetMinutes;
  
  // Calculate the time difference in minutes
  let diffMinutes = targetWakeMinutes - currentWakeMinutes;
  
  // If the target wake time is earlier in the day (e.g., going from 8:00 to 6:00)
  // We need to adjust by subtracting from 24 hours (1440 minutes)
  if (diffMinutes > 0) {
    diffMinutes = diffMinutes - 1440;
  }
  
  // Get the absolute difference
  const absDiffMinutes = Math.abs(diffMinutes);
  
  // Calculate days until target date
  const currentDate = new Date();
  const daysUntilTarget = Math.max(
    1,
    Math.ceil((targetDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  
  // Determine the number of intervals
  // Use a 15-minute adjustment every 2-3 days depending on the total time difference
  const adjustmentMinutes = 15;
  const numberOfIntervals = Math.ceil(absDiffMinutes / adjustmentMinutes);
  
  // Calculate the days between adjustments
  const daysBetweenAdjustments = Math.max(2, Math.floor(daysUntilTarget / numberOfIntervals));
  
  // Generate intervals
  const intervals = [];
  let currentAdjustment = 0;
  let currentIntervalDate = new Date();
  
  for (let i = 0; i < numberOfIntervals; i++) {
    // Calculate the new wake time for this interval
    currentAdjustment += adjustmentMinutes;
    let adjustedMinutes = currentWakeMinutes;
    
    if (diffMinutes < 0) {
      // Earlier wake up (e.g., 8:00 to 6:00)
      adjustedMinutes = (currentWakeMinutes - currentAdjustment + 1440) % 1440;
    } else {
      // Later wake up (e.g., 6:00 to 8:00)
      adjustedMinutes = (currentWakeMinutes + currentAdjustment) % 1440;
    }
    
    // Convert adjusted minutes back to hours:minutes format
    const adjustedHours = Math.floor(adjustedMinutes / 60);
    const adjustedMins = adjustedMinutes % 60;
    const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMins.toString().padStart(2, '0')}`;
    
    // Add days to the current date for this interval
    currentIntervalDate = new Date(currentIntervalDate);
    currentIntervalDate.setDate(currentIntervalDate.getDate() + (i === 0 ? 1 : daysBetweenAdjustments));
    
    intervals.push({
      date: currentIntervalDate.toISOString().split('T')[0],
      wakeTime: formattedTime,
      completed: false
    });
    
    // Stop if we've reached the target date
    if (currentIntervalDate >= targetDateObj) {
      break;
    }
  }
  
  // Add the final target date with the exact target wake time
  intervals.push({
    date: targetDateObj.toISOString().split('T')[0],
    wakeTime: targetWakeTime,
    completed: false
  });
  
  return {
    currentWakeTime,
    targetWakeTime,
    targetDate,
    intervals
  };
}

/**
 * Get the next wake-up time based on the current date and plan
 */
export function getNextWakeUpTime(plan: WakeUpPlan): { date: string; time: string } | null {
  if (!plan || !plan.intervals || plan.intervals.length === 0) {
    return null;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // Find the next uncompleted interval that is today or in the future
  const nextInterval = plan.intervals.find(
    interval => !interval.completed && interval.date >= today
  );
  
  if (!nextInterval) {
    return null;
  }
  
  return {
    date: nextInterval.date,
    time: nextInterval.wakeTime
  };
}

/**
 * Check if a wake-up verification is within the allowed time window
 */
export function isValidWakeUpTime(
  plan: WakeUpPlan | null, 
  timestamp: number
): boolean {
  if (!plan) return false;
  
  const nextWakeUp = getNextWakeUpTime(plan);
  if (!nextWakeUp) return false;
  
  const today = new Date().toISOString().split('T')[0];
  if (nextWakeUp.date !== today) return false;
  
  // Parse the scheduled wake-up time
  const [hours, minutes] = nextWakeUp.time.split(':').map(Number);
  
  // Create Date objects for comparison
  const wakeUpDate = new Date();
  wakeUpDate.setHours(hours, minutes, 0, 0);
  
  // Allow verification up to 5 minutes after the scheduled time (changed from 30 minutes)
  const latestAllowed = new Date(wakeUpDate);
  latestAllowed.setMinutes(latestAllowed.getMinutes() + 5);
  
  // Create a Date from the verification timestamp
  const verificationDate = new Date(timestamp);
  
  // Check if verification time is within the allowed window
  return verificationDate >= wakeUpDate && verificationDate <= latestAllowed;
}
