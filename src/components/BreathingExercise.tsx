
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
}

const BreathingExercise = ({ isOpen, onClose }: BreathingExerciseProps) => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  
  const breathingIntervalRef = useRef<number | null>(null);
  const maxCycles = 3; // Number of breathing cycles to complete
  
  // Breathing exercise logic
  useEffect(() => {
    if (isOpen) {
      // Start breathing exercise
      setBreathingPhase('inhale');
      setBreathingTimer(4); // 4 seconds for inhale
      setCycleCount(0);
      
      let currentPhase: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale';
      let timeRemaining = 4;
      let cycles = 0;
      
      breathingIntervalRef.current = window.setInterval(() => {
        timeRemaining -= 1;
        setBreathingTimer(timeRemaining);
        
        if (timeRemaining <= 0) {
          // Transition to next phase
          switch (currentPhase) {
            case 'inhale':
              currentPhase = 'hold';
              timeRemaining = 7; // 7 seconds for hold
              break;
            case 'hold':
              currentPhase = 'exhale';
              timeRemaining = 8; // 8 seconds for exhale
              break;
            case 'exhale':
              currentPhase = 'inhale';
              timeRemaining = 4; // Back to inhale
              cycles += 1;
              setCycleCount(cycles);
              
              // If we've completed the max cycles, end the exercise
              if (cycles >= maxCycles) {
                clearInterval(breathingIntervalRef.current!);
                setTimeout(() => {
                  onClose();
                }, 1000);
                return;
              }
              break;
            default:
              currentPhase = 'inhale';
              timeRemaining = 4;
          }
          
          setBreathingPhase(currentPhase);
          setBreathingTimer(timeRemaining);
        }
      }, 1000);
    }
    
    return () => {
      // Clean up interval on component unmount or dialog close
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
      }
    };
  }, [isOpen, onClose]);
  
  // Breathing instructions based on phase
  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly';
      case 'hold':
        return 'Hold your breath';
      case 'exhale':
        return 'Breathe out slowly';
      default:
        return 'Prepare to breathe';
    }
  };
  
  // Get breathing circle size based on phase
  const getBreathingCircleSize = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'scale-110 duration-4000';
      case 'hold':
        return 'scale-110 duration-1000';
      case 'exhale':
        return 'scale-100 duration-8000';
      default:
        return 'scale-100 duration-1000';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-skyblue/5 to-lilac/10 backdrop-blur-sm border-lilac/20">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full h-8 w-8 text-indigo/70 hover:text-indigo hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col items-center gap-6 pt-6">
          <h2 className="text-xl font-semibold text-indigo text-center">4-7-8 Breathing</h2>
          
          <div className="relative mb-4">
            <div 
              className={`w-52 h-52 rounded-full bg-skyblue/10 border-4 border-skyblue/40 flex items-center justify-center transition-transform ${getBreathingCircleSize()}`}
            >
              <div className="text-indigo font-medium text-3xl">
                {breathingTimer}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-indigo font-medium text-lg">
              {getBreathingInstruction()}
            </p>
            <p className="text-indigo/70 text-sm mt-2">
              Cycle {cycleCount+1} of {maxCycles}
            </p>
          </div>
          
          <p className="text-sm text-indigo/70 text-center mt-4 max-w-xs">
            The 4-7-8 breathing technique can help reduce anxiety and help you fall asleep faster.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreathingExercise;
