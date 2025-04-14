
import { Quest } from "../store/userStore";
import { allHabitQuests, HabitQuest } from "../data/questsByLevel";

export enum QuestCategory {
  MORNING = "Morning",
  NIGHT = "Night",
  CONSISTENCY = "Consistency",
  GENERAL = "General",
  SLEEP_HYGIENE = "Sleep Hygiene",
  NUTRITION = "Nutrition",
  MENTAL_PREP = "Mental Prep",
  TECH_DETOX = "Tech Detox"
}

export interface QuestTemplate {
  title: string;
  description: string;
  xpReward: number;
  category: QuestCategory;
  detailedDescription?: string;
}

/**
 * Generates a set of daily quests based on user level
 */
export function generateDailyQuests(userLevel: number = 1): Quest[] {
  // Filter quests by user level
  const unlockedHabits = allHabitQuests.filter(habit => habit.levelRequired <= userLevel);
  
  // If no habits are unlocked yet, return empty array
  if (unlockedHabits.length === 0) {
    return [];
  }
  
  // Select up to 3 random habits from the unlocked habits
  const maxQuests = 3;
  const selectedQuests: Quest[] = [];
  
  // Make a copy of unlockedHabits to avoid modifying the original array
  const availableHabits = [...unlockedHabits];
  
  // Select random habits
  while (selectedQuests.length < maxQuests && availableHabits.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableHabits.length);
    const habit = availableHabits[randomIndex];
    
    // Remove this habit from the available pool
    availableHabits.splice(randomIndex, 1);
    
    // Convert HabitQuest to Quest
    selectedQuests.push({
      id: `${Date.now()}-${habit.id}`,
      title: habit.title,
      description: habit.description,
      xpReward: habit.xp,
      completed: false,
      dateAssigned: new Date().toISOString(),
      category: mapHabitCategoryToQuestCategory(habit.category),
      detailedDescription: habit.detailedDescription
    });
  }
  
  return selectedQuests;
}

/**
 * Maps HabitQuest category to QuestCategory enum
 */
function mapHabitCategoryToQuestCategory(habitCategory: string): QuestCategory {
  switch (habitCategory) {
    case 'Sleep Hygiene':
      return QuestCategory.SLEEP_HYGIENE;
    case 'Nutrition':
      return QuestCategory.NUTRITION;
    case 'Mental Prep':
      return QuestCategory.MENTAL_PREP;
    case 'Tech Detox':
      return QuestCategory.TECH_DETOX;
    default:
      return QuestCategory.GENERAL;
  }
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
