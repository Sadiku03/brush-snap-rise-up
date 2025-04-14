import { Quest } from "../store/userStore";

export enum QuestCategory {
  MORNING = "Morning",
  NIGHT = "Night",
  CONSISTENCY = "Consistency",
  GENERAL = "General"
}

export interface QuestTemplate {
  title: string;
  description: string;
  xpReward: number;
  category: QuestCategory;
  detailedDescription?: string;
}

/**
 * Generates a set of daily quests
 */
export function generateDailyQuests(): Quest[] {
  // Pool of possible quests
  const questPool: QuestTemplate[] = [
    {
      title: 'Early Bird',
      description: 'Wake up at your scheduled time',
      xpReward: 50,
      category: QuestCategory.MORNING,
      detailedDescription: 'Get up within 15 minutes of your target wake-up time to establish a consistent rhythm.'
    },
    {
      title: 'Screen-Free Wind-Down',
      description: 'Spend 30 minutes without screens before bed',
      xpReward: 30,
      category: QuestCategory.NIGHT,
      detailedDescription: 'Avoid blue light from devices to help your body naturally prepare for sleep.'
    },
    {
      title: 'Consistency Champion',
      description: 'Go to bed within 30 minutes of your target bedtime',
      xpReward: 40,
      category: QuestCategory.CONSISTENCY,
      detailedDescription: 'Maintain a steady sleep schedule by going to bed at approximately the same time each night.'
    },
    {
      title: 'Morning Stretcher',
      description: 'Do 5 minutes of stretching after waking up',
      xpReward: 20,
      category: QuestCategory.MORNING,
      detailedDescription: 'Gentle stretching helps increase blood flow and wakes up your muscles and mind.'
    },
    {
      title: 'Hydration Hero',
      description: 'Drink a glass of water right after waking up',
      xpReward: 15,
      category: QuestCategory.MORNING,
      detailedDescription: 'Rehydrating first thing helps kickstart your metabolism and replenishes fluids lost during sleep.'
    },
    {
      title: 'Sunshine Seeker',
      description: 'Get natural light within 30 minutes of waking up',
      xpReward: 25,
      category: QuestCategory.MORNING,
      detailedDescription: 'Morning sunlight helps reset your circadian rhythm and improves mood and alertness.'
    },
    {
      title: 'Balanced Breakfast',
      description: 'Eat a healthy breakfast within an hour of waking up',
      xpReward: 35,
      category: QuestCategory.MORNING,
      detailedDescription: 'A nutritious breakfast provides energy and helps regulate your appetite throughout the day.'
    },
    {
      title: 'Journal Journey',
      description: 'Write in your journal before going to bed',
      xpReward: 20,
      category: QuestCategory.NIGHT,
      detailedDescription: 'Journaling helps clear your mind and process thoughts before sleep, reducing nighttime anxiety.'
    },
    {
      title: 'Meditation Master',
      description: 'Meditate for 5 minutes before bed',
      xpReward: 30,
      category: QuestCategory.NIGHT,
      detailedDescription: 'Brief meditation helps calm your nervous system and prepare your mind for restful sleep.'
    },
    {
      title: 'Sleep Environment Setup',
      description: 'Prepare your bedroom for optimal sleep',
      xpReward: 25,
      category: QuestCategory.NIGHT,
      detailedDescription: 'Ensure your room is cool, dark, and quiet to create ideal conditions for quality sleep.'
    },
    {
      title: 'Consistent Wake-Up',
      description: 'Wake up within 30 minutes of the same time for 3 days',
      xpReward: 45,
      category: QuestCategory.CONSISTENCY,
      detailedDescription: "Maintaining a regular wake-up time helps train your body's internal clock for better sleep quality."
    },
    {
      title: 'Caffeine Cutoff',
      description: 'Avoid caffeine after 2pm',
      xpReward: 20,
      category: QuestCategory.NIGHT,
      detailedDescription: 'Caffeine can stay in your system for 6+ hours and interfere with your ability to fall asleep.'
    }
  ];
  
  // Select quests from different categories to ensure variety
  const morningQuests = questPool.filter(q => q.category === QuestCategory.MORNING);
  const nightQuests = questPool.filter(q => q.category === QuestCategory.NIGHT);
  const consistencyQuests = questPool.filter(q => q.category === QuestCategory.CONSISTENCY);
  const generalQuests = questPool.filter(q => q.category === QuestCategory.GENERAL);
  
  // Randomly select 1 from each category if possible, then fill remaining slots randomly
  const selectedQuests: Quest[] = [];
  const maxQuests = 3;
  
  // Helper to get a random quest from array
  const getRandomQuest = (quests: QuestTemplate[]) => {
    return quests[Math.floor(Math.random() * quests.length)];
  };
  
  // Try to get one from each main category first
  if (morningQuests.length > 0 && selectedQuests.length < maxQuests) {
    const quest = getRandomQuest(morningQuests);
    selectedQuests.push(createQuestFromTemplate(quest));
  }
  
  if (nightQuests.length > 0 && selectedQuests.length < maxQuests) {
    const quest = getRandomQuest(nightQuests);
    selectedQuests.push(createQuestFromTemplate(quest));
  }
  
  if (consistencyQuests.length > 0 && selectedQuests.length < maxQuests) {
    const quest = getRandomQuest(consistencyQuests);
    selectedQuests.push(createQuestFromTemplate(quest));
  }
  
  // If we still need more quests, fill with random ones
  const allQuests = [...questPool];
  while (selectedQuests.length < maxQuests && allQuests.length > 0) {
    const randomIndex = Math.floor(Math.random() * allQuests.length);
    const quest = allQuests[randomIndex];
    
    // Remove this quest from the pool
    allQuests.splice(randomIndex, 1);
    
    // Make sure we don't have a duplicate title
    if (!selectedQuests.find(q => q.title === quest.title)) {
      selectedQuests.push(createQuestFromTemplate(quest));
    }
  }
  
  return selectedQuests;
}

/**
 * Creates a Quest object from a template
 */
function createQuestFromTemplate(template: QuestTemplate): Quest {
  return {
    ...template,
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    completed: false,
    dateAssigned: new Date().toISOString()
  };
}

/**
 * Checks if quests should be refreshed based on the last refresh date
 */
export function shouldRefreshQuests(lastRefreshDate: string | null): boolean {
  if (!lastRefreshDate) {
    return true;
  }
  
  const today = new Date().toISOString().split('T')[0];
  return lastRefreshDate !== today;
}

/**
 * Calculate the XP required for the next level
 */
export function getXpForNextLevel(currentLevel: number): number {
  // Each level requires more XP than the previous
  return currentLevel * 100;
}

/**
 * Calculate XP remaining until next level
 */
export function getXpUntilNextLevel(currentLevel: number, currentXp: number): number {
  const xpForNextLevel = getXpForNextLevel(currentLevel);
  return xpForNextLevel - currentXp;
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
