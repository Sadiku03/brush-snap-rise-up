
import QuestSystem from '@/components/QuestSystem';
import UpcomingHabits from '@/components/UpcomingHabits';
import { useUserStore } from '@/store/userStore';

const Quests = () => {
  const { progress } = useUserStore();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-2xl font-bold text-indigo">Habit Builder</h1>
          <div className="px-3 py-1 bg-indigo-100 rounded-full text-indigo">
            <span className="font-medium">Level {progress.level}</span>
          </div>
        </div>
        <p className="text-indigo/70">Build healthy sleep habits through daily practice and unlock advanced techniques as you level up</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <QuestSystem />
        <UpcomingHabits />
      </div>
    </div>
  );
};

export default Quests;
