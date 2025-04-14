
export interface DailyCheckIn {
  date: string; // e.g., '2025-04-28'
  scheduledWakeMinutes: number;
  actualWakeMinutes?: number; // undefined if user didn't check in
  deviationMinutes?: number;  // abs(actual - scheduled)
}

/**
 * Logs a new check-in entry, calculating deviation and ensuring uniqueness by date
 */
export function logCheckIn(
  history: DailyCheckIn[],
  entry: Omit<DailyCheckIn, 'deviationMinutes'>,
): DailyCheckIn[] {
  const deviation = entry.actualWakeMinutes !== undefined
    ? Math.abs(entry.actualWakeMinutes - entry.scheduledWakeMinutes)
    : undefined;

  const newEntry: DailyCheckIn = {
    ...entry,
    deviationMinutes: deviation,
  };

  const updated = [...history.filter(d => d.date !== entry.date), newEntry];
  return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Converts HH:MM time format to minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes since midnight to HH:MM time format
 */
export function minutesToTime(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
