
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
  Sun
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
  [QuestCategory.GENERAL]: <CheckSquare className="h-4 w-4 text-gray-500" />
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
  
  // Use yellow background for incomplete quests and green for completed ones
  const backgroundClass = isCompleted 
    ? "bg-[#F2FCE2] border-emerald-200" // Soft Green
    : "bg-[#FEF7CD] border-amber-200";   // Soft Yellow
  
  return (
    <div className={cn(
      "quest-item border rounded-xl p-4 mb-4 transition-all",
      backgroundClass,
      detailsOpen && "shadow-md"
    )}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : categoryIcon}
            <span className="font-semibold text-base text-indigo">
              {quest.title}
            </span>
          </div>
          
          <p className="text-indigo/70 text-sm mb-2">{quest.description}</p>
          
          {/* Expandable details */}
          {quest.detailedDescription && (
            <button 
              className="flex items-center text-xs text-indigo/60 hover:text-indigo/80 mb-2"
              onClick={() => setDetailsOpen(!detailsOpen)}
            >
              {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              <span className="ml-1">{detailsOpen ? "Hide details" : "Show details"}</span>
            </button>
          )}
          
          {detailsOpen && quest.detailedDescription && (
            <div className="text-sm text-indigo/70 bg-white/50 rounded-lg p-3 mb-3 border border-current/10">
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
