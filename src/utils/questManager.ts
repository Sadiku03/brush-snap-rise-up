
import { Quest } from "../store/userStore";

/**
 * Generates a set of daily quests
 */
export function generateDailyQuests(): Quest[] {
  // Pool of possible quests
  const questPool: Omit<Quest, 'id' | 'completed' | 'dateAssigned'>[] = [
    {
      title: 'Early Bird',
      description: 'Wake up at your scheduled time',
      xpReward: 50,
    },
    {
      title: 'Screen-Free Wind-Down',
      description: 'Spend 30 minutes without screens before bed',
      xpReward: 30,
    },
    {
      title: 'Consistency Champion',
      description: 'Go to bed within 30 minutes of your target bedtime',
      xpReward: 40,
    },
    {
      title: 'Morning Stretcher',
      description: 'Do 5 minutes of stretching after waking up',
      xpReward: 20,
    },
    {
      title: 'Hydration Hero',
      description: 'Drink a glass of water right after waking up',
      xpReward: 15,
    },
    {
      title: 'Sunshine Seeker',
      description: 'Get natural light within 30 minutes of waking up',
      xpReward: 25,
    },
    {
      title: 'Balanced Breakfast',
      description: 'Eat a healthy breakfast within an hour of waking up',
      xpReward: 35,
    },
    {
      title: 'Journal Journey',
      description: 'Write in your journal before going to bed',
      xpReward: 20,
    },
    {
      title: 'Meditation Master',
      description: 'Meditate for 5 minutes before bed',
      xpReward: 30,
    }
  ];
  
  // Randomly select 3 quests from the pool
  const selectedQuests: Quest[] = [];
  const shuffledPool = [...questPool].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < Math.min(3, shuffledPool.length); i++) {
    const quest = shuffledPool[i];
    selectedQuests.push({
      ...quest,
      id: `${Date.now()}-${i}`,
      completed: false,
      dateAssigned: new Date().toISOString()
    });
  }
  
  return selectedQuests;
}

/**
 * Calculate the XP required for the next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  // Each level requires more XP than the previous
  return currentLevel * 100;
}

/**
 * Generate a verification prompt for the Brush Snap feature
 */
export function generateVerificationPrompt(): string {
  const prompts = [
    "Show your toothbrush",
    "Show your bathroom mirror",
    "Hold up one finger",
    "Hold up two fingers",
    "Make a thumbs up",
    "Show today's date on your phone",
    "Smile for the camera",
    "Hold a glass of water",
    "Show the morning sky",
  ];
  
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Get a motivational message based on streak count
 */
export function getMotivationalMessage(streak: number): string {
  if (streak === 0) {
    return "Ready to start your journey?";
  } else if (streak === 1) {
    return "Great start! First day complete!";
  } else if (streak < 5) {
    return "You're building momentum!";
  } else if (streak < 10) {
    return "Impressive streak! Keep it up!";
  } else if (streak < 20) {
    return "Wow! You're on fire!";
  } else {
    return `Incredible! ${streak} days and counting!`;
  }
}
