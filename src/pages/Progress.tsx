
import ProgressMap from '@/components/ProgressMap';
import BrushSnap from '@/components/BrushSnap';

const Progress = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo mb-1">Your Progress</h1>
        <p className="text-indigo/70">Track your sleep journey and wake-up verifications</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ProgressMap />
        <BrushSnap />
      </div>
    </div>
  );
};

export default Progress;
