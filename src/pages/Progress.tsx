
import ProgressMap from '@/components/ProgressMap';

const Progress = () => {
  return (
    <div className="space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <div>
        <h1 className="text-xl font-bold text-indigo mb-1">Your Progress</h1>
        <p className="text-sm text-indigo/70">Track your sleep journey</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <ProgressMap />
      </div>
    </div>
  );
};

export default Progress;
