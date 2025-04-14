
export interface HabitQuest {
  id: string;
  title: string;
  xp: number;
  description: string;
  levelRequired: number;
  category: 'Sleep Hygiene' | 'Nutrition' | 'Mental Prep' | 'Tech Detox';
  detailedDescription?: string;
}

export const allHabitQuests: HabitQuest[] = [
  {
    id: 'noScreens30',
    title: 'Screen-Free Wind-Down',
    xp: 30,
    description: 'Avoid screens 30 min before bed.',
    levelRequired: 1,
    category: 'Tech Detox',
    detailedDescription: 'Avoid blue light from devices to help your body naturally prepare for sleep.'
  },
  {
    id: 'earlyBird',
    title: 'Early Bird',
    xp: 50,
    description: 'Wake up before your scheduled time.',
    levelRequired: 1,
    category: 'Sleep Hygiene',
    detailedDescription: 'Get up within 15 minutes of your target wake-up time to establish a consistent rhythm.'
  },
  {
    id: 'consistencyChampion',
    title: 'Consistency Champion',
    description: 'Go to bed within 30 minutes of your target bedtime',
    xp: 40,
    levelRequired: 1,
    category: 'Sleep Hygiene',
    detailedDescription: 'Maintain a steady sleep schedule by going to bed at approximately the same time each night.'
  },
  {
    id: 'morningStretch',
    title: 'Morning Stretcher',
    description: 'Do 5 minutes of stretching after waking up',
    xp: 20,
    levelRequired: 2,
    category: 'Sleep Hygiene',
    detailedDescription: 'Gentle stretching helps increase blood flow and wakes up your muscles and mind.'
  },
  {
    id: 'hydrationHero',
    title: 'Hydration Hero',
    description: 'Drink a glass of water right after waking up',
    xp: 15,
    levelRequired: 2,
    category: 'Nutrition',
    detailedDescription: 'Rehydrating first thing helps kickstart your metabolism and replenishes fluids lost during sleep.'
  },
  {
    id: 'sunshineSeeking',
    title: 'Sunshine Seeker',
    description: 'Get natural light within 30 minutes of waking up',
    xp: 25,
    levelRequired: 3,
    category: 'Sleep Hygiene',
    detailedDescription: 'Morning sunlight helps reset your circadian rhythm and improves mood and alertness.'
  },
  {
    id: 'balancedBreakfast',
    title: 'Balanced Breakfast',
    description: 'Eat a healthy breakfast within an hour of waking up',
    xp: 35,
    levelRequired: 3,
    category: 'Nutrition',
    detailedDescription: 'A nutritious breakfast provides energy and helps regulate your appetite throughout the day.'
  },
  {
    id: 'journalJourney',
    title: 'Journal Journey',
    description: 'Write in your journal before going to bed',
    xp: 20,
    levelRequired: 4,
    category: 'Mental Prep',
    detailedDescription: 'Journaling helps clear your mind and process thoughts before sleep, reducing nighttime anxiety.'
  },
  {
    id: 'meditationMaster',
    title: 'Meditation Master',
    description: 'Meditate for 5 minutes before bed',
    xp: 30,
    levelRequired: 4,
    category: 'Mental Prep',
    detailedDescription: 'Brief meditation helps calm your nervous system and prepare your mind for restful sleep.'
  },
  {
    id: 'magnesiumNight',
    title: 'Try Magnesium Supplement',
    xp: 40,
    description: 'Take magnesium 1 hour before bed.',
    levelRequired: 5,
    category: 'Nutrition',
    detailedDescription: 'Magnesium may help relax muscles and improve sleep quality. Consult a healthcare provider before starting any supplement.'
  },
  {
    id: 'sleepEnvironment',
    title: 'Sleep Environment Setup',
    description: 'Prepare your bedroom for optimal sleep',
    xp: 25,
    levelRequired: 5,
    category: 'Sleep Hygiene',
    detailedDescription: 'Ensure your room is cool, dark, and quiet to create ideal conditions for quality sleep.'
  },
  {
    id: 'consistentWakeUp',
    title: 'Consistent Wake-Up',
    description: 'Wake up within 30 minutes of the same time for 3 days',
    xp: 45,
    levelRequired: 6,
    category: 'Sleep Hygiene',
    detailedDescription: "Maintaining a regular wake-up time helps train your body's internal clock for better sleep quality."
  },
  {
    id: 'caffeineCutoff',
    title: 'Caffeine Cutoff',
    description: 'Avoid caffeine after 2pm',
    xp: 20,
    levelRequired: 6,
    category: 'Nutrition',
    detailedDescription: 'Caffeine can stay in your system for 6+ hours and interfere with your ability to fall asleep.'
  },
  {
    id: 'bodyScanMeditation',
    title: 'Body Scan Meditation',
    xp: 60,
    description: 'Complete a 10-minute body scan meditation.',
    levelRequired: 7,
    category: 'Mental Prep',
    detailedDescription: 'A body scan meditation helps you release tension throughout your body and prepare for deep sleep.'
  },
  {
    id: 'digitalSunset',
    title: 'Digital Sunset',
    description: 'Turn off all electronics 1 hour before bed',
    xp: 50,
    levelRequired: 7,
    category: 'Tech Detox',
    detailedDescription: 'Creating a complete technology-free period before bed significantly improves sleep quality.'
  },
];
