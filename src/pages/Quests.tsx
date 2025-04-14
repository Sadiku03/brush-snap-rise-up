
import QuestSystem from '@/components/QuestSystem';

const Quests = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo mb-1">Daily Quests</h1>
        <p className="text-indigo/70">Complete quests to earn XP and level up your sleep companion</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <QuestSystem />
      </div>
    </div>
  );
};

export default Quests;
