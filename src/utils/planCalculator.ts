import { WakeUpPlan } from "../store/userStore";

/**
 * Calculates wake up intervals to gradually shift from current to target time
 * using a block-based approach for more stability
 */
export function calculateWakeUpPlan(
  currentWakeTime: string,
  targetWakeTime: string,
  targetDate: string
): WakeUpPlan {
  // Parse input dates and times
  const targetDateObj = new Date(targetDate);
  const currentDate = new Date();
  
  // Parse times (format: "HH:MM")
  const [currentHours, currentMinutes] = currentWakeTime.split(':').map(Number);
  const [targetHours, targetMinutes] = targetWakeTime.split(':').map(Number);
  
  // Convert wake times to minutes for easier calculation
  const currentWakeMinutes = currentHours * 60 + currentMinutes;
  const targetWakeMinutes = targetHours * 60 + targetMinutes;
  
  // Calculate total days until target
  const daysUntilTarget = Math.max(
    1,
    Math.ceil((targetDateObj.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  
  // Calculate the time difference in minutes
  let diffMinutes = targetWakeMinutes - currentWakeMinutes;
  
  // If the target wake time is earlier in the day (e.g., going from 8:00 to 6:00)
  // We need to adjust by adding 24 hours (1440 minutes) to make the difference negative
  if (diffMinutes > 0) {
    diffMinutes = diffMinutes - 1440;
  }
  
  // Get the absolute difference
  const absDiffMinutes = Math.abs(diffMinutes);
  
  // Define block size (number of days to keep the same wake-up time)
  const blockDays = 3; // Keep the same wake-up time for 3 days
  
  // Calculate adjustment per block
  const adjustmentPerBlock = absDiffMinutes / Math.ceil(daysUntilTarget / blockDays);
  
  // Generate the schedule
  const intervals = [];
  let currentIntervalDate = new Date(currentDate);
  
  for (let day = 0; day < daysUntilTarget; day++) {
    // Calculate the block index
    const blockIndex = Math.floor(day / blockDays);
    
    // Calculate minutes to adjust based on the block
    // Apply the first decrement immediately instead of starting at 0
    const minutesToAdjust = (blockIndex + 1) * adjustmentPerBlock;
    
    let adjustedMinutes = currentWakeMinutes;
    
    if (diffMinutes < 0) {
      // Earlier wake up (e.g., 8:00 to 6:00)
      adjustedMinutes = (currentWakeMinutes - minutesToAdjust + 1440) % 1440;
    } else {
      // Later wake up (e.g., 6:00 to 8:00)
      adjustedMinutes = (currentWakeMinutes + minutesToAdjust) % 1440;
    }
    
    // Convert adjusted minutes back to hours:minutes format
    const adjustedHours = Math.floor(adjustedMinutes / 60);
    const adjustedMins = Math.floor(adjustedMinutes % 60);
    const formattedTime = `${adjustedHours.toString().padStart(2, '0')}:${adjustedMins.toString().padStart(2, '0')}`;
    
    // Add days to the current date for this interval
    const intervalDate = new Date(currentIntervalDate);
    intervalDate.setDate(intervalDate.getDate() + day);
    const dateString = intervalDate.toISOString().split('T')[0];
    
    // Only add unique dates/times to avoid duplicates within blocks
    const alreadyAdded = intervals.some(
      interval => interval.date === dateString && interval.wakeTime === formattedTime
    );
    
    if (!alreadyAdded) {
      intervals.push({
        date: dateString,
        wakeTime: formattedTime,
        completed: false
      });
    }
    
    // Stop if we've reached or passed the target date
    if (intervalDate >= targetDateObj) {
      break;
    }
  }
  
  // Add the final target date with the exact target wake time
  intervals.push({
    date: targetDateObj.toISOString().split('T')[0],
    wakeTime: targetWakeTime,
    completed: false
  });
  
  // Remove duplicates and sort by date
  const uniqueIntervals = removeDuplicateIntervals(intervals);
  
  return {
    currentWakeTime,
    targetWakeTime,
    targetDate,
    intervals: uniqueIntervals
  };
}

/**
 * Helper function to remove duplicate intervals with the same date and wake time
 */
function removeDuplicateIntervals(intervals: Array<{date: string, wakeTime: string, completed: boolean}>) {
  const uniqueMap = new Map();
  
  intervals.forEach(interval => {
    const key = `${interval.date}-${interval.wakeTime}`;
    uniqueMap.set(key, interval);
  });
  
  return Array.from(uniqueMap.values())
    .sort((a, b) => a.date.localeCompare(b.date));
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

/**
 * Recalculate the wake-up plan from a new starting point while keeping the same target
 */
export function recalculateWakePlan({
  currentDate,
  latestWakeTime,
  targetWakeTime,
  targetDate,
  originalPlan
}: {
  currentDate: string;
  latestWakeTime: string;
  targetWakeTime: string;
  targetDate: string;
  originalPlan: WakeUpPlan;
}): WakeUpPlan {
  // Create a new plan starting from the current date and latest wake time
  const newPlan = calculateWakeUpPlan(
    latestWakeTime,
    targetWakeTime,
    targetDate
  );
  
  // Preserve history by keeping past intervals from the original plan
  const pastIntervals = originalPlan.intervals.filter(interval => 
    interval.date < currentDate
  );
  
  // Get future intervals from the new plan
  const futureIntervals = newPlan.intervals.filter(interval => 
    interval.date >= currentDate
  );
  
  // Combine past and future intervals, respecting any today's completion
  const todayInterval = originalPlan.intervals.find(interval => 
    interval.date === currentDate
  );
  
  const combinedIntervals = [
    ...pastIntervals,
    // If there's a today's interval, use its completion status
    ...(todayInterval ? [todayInterval] : []),
    // For future dates, use the recalculated times
    ...futureIntervals.filter(interval => interval.date !== currentDate)
  ];
  
  // Sort intervals by date
  const sortedIntervals = combinedIntervals.sort((a, b) => 
    a.date.localeCompare(b.date)
  );
  
  return {
    currentWakeTime: latestWakeTime, // Update the current wake time
    targetWakeTime,
    targetDate,
    intervals: sortedIntervals
  };
}

/**
 * Analyzes a wake up plan to determine if it needs adjustment
 * @returns Object with needsReset and reason if adjustment is recommended
 */
export function analyzeWakeUpPlan(plan: WakeUpPlan): { 
  needsReset: boolean; 
  reason: string | null;
  latestWakeTime: string | null;
} {
  if (!plan || !plan.intervals.length) {
    return { needsReset: false, reason: null, latestWakeTime: null };
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get recent intervals up to today (last 5 days or less)
  const recentIntervals = plan.intervals
    .filter(interval => interval.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date)) // Sort descending by date
    .slice(0, 5);
  
  if (recentIntervals.length < 2) {
    return { needsReset: false, reason: null, latestWakeTime: null };
  }
  
  // Check for missed check-ins (2+ days)
  const missedCheckIns = recentIntervals.filter(interval => 
    !interval.completed && interval.date !== today
  ).length;
  
  if (missedCheckIns >= 2) {
    // Use the most recent wake time or the current wake time as fallback
    const latestCompletedInterval = recentIntervals.find(interval => interval.completed);
    const latestWakeTime = latestCompletedInterval?.wakeTime || plan.currentWakeTime;
    
    return { 
      needsReset: true, 
      reason: "You've missed 2 or more check-ins recently.", 
      latestWakeTime 
    };
  }
  
  // Get the latest actual wake times from brush snaps
  // For a real implementation, we would need to store the actual wake times
  // For now, we'll consider this as a future enhancement
  
  return { needsReset: false, reason: null, latestWakeTime: null };
}
