
import { Quest } from '@/store/userStore';
import QuestItem from './QuestItem';

interface QuestListProps {
  quests: Quest[];
  isCompleted?: boolean;
  onCompleteQuest?: (quest: Quest) => void;
  streakMultiplier: string;
  calculateAdjustedXp?: (baseXp: number) => number;
  emptyMessage?: string;
  showDetails?: boolean;
}

const QuestList = ({
  quests,
  isCompleted = false,
  onCompleteQuest,
  streakMultiplier,
  calculateAdjustedXp,
  emptyMessage = "No quests available",
  showDetails = false
}: QuestListProps) => {
  if (quests.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-indigo/70">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {quests.map((quest) => (
        <QuestItem
          key={quest.id}
          quest={quest}
          isCompleted={isCompleted}
          onComplete={onCompleteQuest}
          streakMultiplier={streakMultiplier}
          streakAdjustedXp={calculateAdjustedXp ? calculateAdjustedXp(quest.xpReward) : undefined}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
};

export default QuestList;
