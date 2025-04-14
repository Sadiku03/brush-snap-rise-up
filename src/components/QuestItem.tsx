
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Star,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Calendar,
  Moon,
  Sun,
  Coffee,
  Brain,
  TabletSmartphone
} from "lucide-react";
import { Quest, QuestCategory } from '@/store/userStore';
import { cn } from '@/lib/utils';

interface QuestItemProps {
  quest: Quest;
  isCompleted?: boolean;
  onComplete?: (quest: Quest) => void;
  streakMultiplier: string;
  streakAdjustedXp?: number;
  showDetails?: boolean;
}

const categoryIcons = {
  [QuestCategory.MORNING]: <Sun className="h-4 w-4 text-amber-500" />,
  [QuestCategory.NIGHT]: <Moon className="h-4 w-4 text-indigo-500" />,
  [QuestCategory.CONSISTENCY]: <Calendar className="h-4 w-4 text-emerald-500" />,
  [QuestCategory.GENERAL]: <CheckSquare className="h-4 w-4 text-gray-500" />,
  [QuestCategory.SLEEP_HYGIENE]: <Moon className="h-4 w-4 text-purple-500" />,
  [QuestCategory.NUTRITION]: <Coffee className="h-4 w-4 text-emerald-500" />,
  [QuestCategory.MENTAL_PREP]: <Brain className="h-4 w-4 text-amber-500" />,
  [QuestCategory.TECH_DETOX]: <TabletSmartphone className="h-4 w-4 text-blue-500" />
};

const categoryClasses = {
  [QuestCategory.MORNING]: "text-amber-700 bg-amber-50 border-amber-200",
  [QuestCategory.NIGHT]: "text-indigo-700 bg-indigo-50 border-indigo-200",
  [QuestCategory.CONSISTENCY]: "text-emerald-700 bg-emerald-50 border-emerald-200", 
  [QuestCategory.GENERAL]: "text-gray-700 bg-gray-50 border-gray-200",
  [QuestCategory.SLEEP_HYGIENE]: "text-purple-700 bg-purple-50 border-purple-200",
  [QuestCategory.NUTRITION]: "text-emerald-700 bg-emerald-50 border-emerald-200",
  [QuestCategory.MENTAL_PREP]: "text-amber-700 bg-amber-50 border-amber-200",
  [QuestCategory.TECH_DETOX]: "text-blue-700 bg-blue-50 border-blue-200"
};

const categoryNames = {
  [QuestCategory.MORNING]: "Morning",
  [QuestCategory.NIGHT]: "Night",
  [QuestCategory.CONSISTENCY]: "Consistency",
  [QuestCategory.GENERAL]: "General",
  [QuestCategory.SLEEP_HYGIENE]: "Sleep Hygiene",
  [QuestCategory.NUTRITION]: "Nutrition",
  [QuestCategory.MENTAL_PREP]: "Mental Prep",
  [QuestCategory.TECH_DETOX]: "Tech Detox"
};

const QuestItem = ({ 
  quest, 
  isCompleted = false, 
  onComplete, 
  streakMultiplier,
  streakAdjustedXp,
  showDetails = false
}: QuestItemProps) => {
  const [detailsOpen, setDetailsOpen] = useState(showDetails);
  
  // Get the icon based on category
  const categoryIcon = categoryIcons[quest.category] || 
    categoryIcons[QuestCategory.GENERAL];
  
  // Get the category style
  const categoryClass = categoryClasses[quest.category] || 
    categoryClasses[QuestCategory.GENERAL];
    
  // Get category name for display
  const categoryName = categoryNames[quest.category] || "General";
  
  // Use a completed style for completed quests, and category style for available quests
  const itemClass = isCompleted 
    ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
    : categoryClass;
  
  return (
    <div className={cn(
      "quest-item border rounded-xl p-4 mb-4 transition-all",
      itemClass,
      detailsOpen && "shadow-md"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10 border border-current border-opacity-20">
              {categoryIcon}
              <span className="ml-1">{categoryName}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-1 mt-2">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : categoryIcon}
            <span className="font-semibold text-base">
              {quest.title}
            </span>
          </div>
          
          <p className="text-opacity-70 text-sm mb-2">{quest.description}</p>
          
          {/* Expandable details */}
          {quest.detailedDescription && (
            <button 
              className="flex items-center text-xs opacity-60 hover:opacity-80 mb-2"
              onClick={() => setDetailsOpen(!detailsOpen)}
            >
              {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span className="ml-1">{detailsOpen ? "Hide details" : "Show details"}</span>
            </button>
          )}
          
          {detailsOpen && quest.detailedDescription && (
            <div className="text-sm opacity-70 bg-white/50 rounded-lg p-3 mb-3 border border-current/10">
              {quest.detailedDescription}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          {/* Base XP indicator */}
          <div className="bg-coral/10 px-2 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 text-coral" />
            <span className="text-sm font-medium text-coral ml-1">{quest.xpReward} XP</span>
          </div>
          
          {/* Streak adjusted XP (for incomplete quests) */}
          {!isCompleted && streakAdjustedXp && (
            <div className="bg-emerald-100 px-2 py-1 rounded-full flex items-center mt-1">
              <span className="text-xs font-medium text-emerald-700">
                {streakAdjustedXp} XP with streak
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Complete button for incomplete quests */}
      {!isCompleted && onComplete && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => onComplete(quest)}
            className="bg-skyblue hover:bg-skyblue/80 text-indigo"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestItem;
