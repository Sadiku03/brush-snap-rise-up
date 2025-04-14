
import WindDownZone from '@/components/WindDownZone';

const WindDown = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo mb-1">Wind-Down Zone</h1>
        <p className="text-indigo/70">Prepare your mind and body for sleep with relaxation tools</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <WindDownZone />
      </div>
    </div>
  );
};

export default WindDown;
